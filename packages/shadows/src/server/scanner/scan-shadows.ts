import fs from "fs/promises";
import path from "path";
import type { FrameworkInfo } from "@designtools/core/scanner";
import type { StylingSystem } from "@designtools/core/scanner/detect-styling";
import { parseBlock } from "@designtools/core/scanner/scan-tokens";
import { TAILWIND_SHADOW_PRESETS, type ShadowPreset } from "./presets/tailwind.js";

export interface ShadowLayer {
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  color: string;
  inset: boolean;
}

export interface ShadowDefinition {
  /** Display name: "shadow-md", "--shadow-card", etc. */
  name: string;
  /** Raw CSS value */
  value: string;
  /** Where this shadow comes from */
  source: "custom" | "framework-preset";
  /** Whether the user has overridden this value */
  isOverridden: boolean;
  /** Parsed individual shadow layers */
  layers: ShadowLayer[];
  /** The CSS variable name if applicable (e.g. "--shadow-md") */
  cssVariable?: string;
}

export interface ShadowMap {
  shadows: ShadowDefinition[];
  /** CSS file path where custom shadows can be written */
  cssFilePath: string;
  /** Detected styling system info */
  stylingType: StylingSystem["type"];
}

export async function scanShadows(
  projectRoot: string,
  framework: FrameworkInfo,
  styling: StylingSystem
): Promise<ShadowMap> {
  const shadows: ShadowDefinition[] = [];
  const cssFilePath = framework.cssFiles[0] || "";

  // 1. Scan CSS files for custom shadow variables/values
  const customShadows = await scanCustomShadows(projectRoot, framework.cssFiles);

  // Track which preset names have been overridden
  const overriddenNames = new Set(customShadows.map(s => s.name));

  // 2. Add framework presets (Tailwind)
  if (styling.type === "tailwind-v4" || styling.type === "tailwind-v3") {
    for (const preset of TAILWIND_SHADOW_PRESETS) {
      const isOverridden = overriddenNames.has(preset.name);
      if (!isOverridden) {
        shadows.push({
          name: preset.name,
          value: preset.value,
          source: "framework-preset",
          isOverridden: false,
          layers: parseShadowValue(preset.value),
        });
      }
    }
  }

  // 3. Add custom shadows (these override presets)
  for (const custom of customShadows) {
    shadows.push({
      ...custom,
      isOverridden: true,
    });
  }

  // Sort: custom first, then presets by name
  shadows.sort((a, b) => {
    if (a.source !== b.source) {
      return a.source === "custom" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return { shadows, cssFilePath, stylingType: styling.type };
}

async function scanCustomShadows(
  projectRoot: string,
  cssFiles: string[]
): Promise<ShadowDefinition[]> {
  const shadows: ShadowDefinition[] = [];

  for (const file of cssFiles) {
    try {
      const css = await fs.readFile(path.join(projectRoot, file), "utf-8");

      // Parse :root block for shadow custom properties
      const rootTokens = parseBlock(css, ":root");
      for (const [name, value] of rootTokens) {
        if (name.includes("shadow") || isShadowValue(value)) {
          shadows.push({
            name: name.replace(/^--/, ""),
            value,
            source: "custom",
            isOverridden: true,
            layers: parseShadowValue(value),
            cssVariable: name,
          });
        }
      }

      // Also check @theme blocks (Tailwind v4)
      const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\}/);
      if (themeMatch) {
        const themeBlock = themeMatch[1];
        const propRegex = /(--shadow[\w-]*)\s*:\s*([^;]+);/g;
        let match;
        while ((match = propRegex.exec(themeBlock)) !== null) {
          const name = match[1].replace(/^--/, "");
          // Don't duplicate if already found in :root
          if (!shadows.find(s => s.name === name)) {
            shadows.push({
              name,
              value: match[2].trim(),
              source: "custom",
              isOverridden: true,
              layers: parseShadowValue(match[2].trim()),
              cssVariable: match[1],
            });
          }
        }
      }
    } catch {
      // File not found
    }
  }

  return shadows;
}

function isShadowValue(value: string): boolean {
  // Check if a CSS value looks like a box-shadow
  return /\d+px\s+\d+px/.test(value) || value.includes("inset");
}

export function parseShadowValue(value: string): ShadowLayer[] {
  if (!value || value === "none") return [];

  // Split by comma, but not inside parentheses (for rgb/oklch colors)
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of value) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) parts.push(current.trim());

  return parts.map(parseSingleShadow).filter((s): s is ShadowLayer => s !== null);
}

function parseSingleShadow(shadow: string): ShadowLayer | null {
  const trimmed = shadow.trim();
  if (!trimmed) return null;

  const inset = trimmed.startsWith("inset");
  const withoutInset = inset ? trimmed.replace(/^inset\s*/, "") : trimmed;

  // Extract color (at the end, may be rgb/oklch/hex/named)
  let color = "rgb(0 0 0 / 0.1)";
  let measurements = withoutInset;

  // Try to find color at end: rgb(...), oklch(...), rgba(...), hsl(...), hex, or named
  const colorPatterns = [
    /\s+((?:rgb|rgba|oklch|hsl|hsla)\([^)]+\))$/,
    /\s+(#[\da-fA-F]{3,8})$/,
    /\s+((?:black|white|transparent|currentColor))$/i,
  ];

  for (const pattern of colorPatterns) {
    const match = measurements.match(pattern);
    if (match) {
      color = match[1];
      measurements = measurements.slice(0, match.index).trim();
      break;
    }
  }

  // Parse measurements: offsetX offsetY blur? spread?
  const parts = measurements.split(/\s+/);
  if (parts.length < 2) return null;

  return {
    offsetX: parts[0] || "0",
    offsetY: parts[1] || "0",
    blur: parts[2] || "0",
    spread: parts[3] || "0",
    color,
    inset,
  };
}

export function formatShadowValue(layers: ShadowLayer[]): string {
  if (layers.length === 0) return "none";
  return layers.map(formatSingleShadow).join(", ");
}

function formatSingleShadow(layer: ShadowLayer): string {
  const parts: string[] = [];
  if (layer.inset) parts.push("inset");
  parts.push(layer.offsetX);
  parts.push(layer.offsetY);
  parts.push(layer.blur);
  parts.push(layer.spread);
  parts.push(layer.color);
  return parts.join(" ");
}
