/**
 * Resolve Tailwind theme scales from project config (v3) or @theme CSS blocks (v4).
 * Returns null on failure — callers fall back to hardcoded defaults.
 */

import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";
import type { ResolvedTailwindTheme, ScaleEntry } from "../../shared/tailwind-theme.js";

// ---------------------------------------------------------------------------
// Tailwind v4: parse @theme blocks from CSS files
// ---------------------------------------------------------------------------

/** Variable prefix → theme scale name */
const V4_PREFIX_MAP: Record<string, keyof ResolvedTailwindTheme> = {
  "--spacing": "spacing",
  "--font-size": "fontSize",
  "--font-weight": "fontWeight",
  "--leading": "lineHeight",
  "--line-height": "lineHeight",
  "--tracking": "letterSpacing",
  "--letter-spacing": "letterSpacing",
  "--radius": "borderRadius",
  "--border": "borderWidth",
  "--opacity": "opacity",
};

/**
 * Extract @theme blocks from CSS text and parse variable declarations.
 * Handles `@theme { ... }` and `@theme inline { ... }`.
 */
function parseThemeBlocks(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  const themeRegex = /@theme\s*(?:inline\s*)?\{/g;
  let match: RegExpExecArray | null;

  while ((match = themeRegex.exec(css)) !== null) {
    let depth = 1;
    let i = match.index + match[0].length;
    const start = i;

    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }

    const blockContent = css.slice(start, i - 1);

    // Parse CSS custom property declarations within the block
    const declRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let declMatch: RegExpExecArray | null;
    while ((declMatch = declRegex.exec(blockContent)) !== null) {
      vars.set(declMatch[1].trim(), declMatch[2].trim());
    }
  }

  return vars;
}

/**
 * Classify a CSS variable name into a theme scale and extract the key.
 * Returns null if the variable doesn't match any known scale prefix.
 */
function classifyVar(name: string): { scale: keyof ResolvedTailwindTheme; key: string } | null {
  // Sort prefixes longest-first so --letter-spacing matches before --letter
  const prefixes = Object.keys(V4_PREFIX_MAP).sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (name.startsWith(prefix + "-")) {
      const key = name.slice(prefix.length + 1);
      // Skip color-like variables (they have nested dashes like --spacing-color-red)
      // but keep compound keys like "2xl"
      return { scale: V4_PREFIX_MAP[prefix], key };
    }
  }
  return null;
}

export async function resolveTailwindV4Theme(
  projectRoot: string,
  cssFiles: string[],
): Promise<ResolvedTailwindTheme | null> {
  try {
    const allVars = new Map<string, string>();

    for (const cssFile of cssFiles) {
      const fullPath = path.isAbsolute(cssFile)
        ? cssFile
        : path.join(projectRoot, cssFile);
      try {
        const css = await fs.readFile(fullPath, "utf-8");
        const themeVars = parseThemeBlocks(css);
        for (const [k, v] of themeVars) {
          allVars.set(k, v);
        }
      } catch {
        // File not found — skip
      }
    }

    if (allVars.size === 0) return null;

    const theme: ResolvedTailwindTheme = {
      spacing: [],
      fontSize: [],
      fontWeight: [],
      lineHeight: [],
      letterSpacing: [],
      borderRadius: [],
      borderWidth: [],
      opacity: [],
    };

    let hasAnyScale = false;

    for (const [name, value] of allVars) {
      const classified = classifyVar(name);
      if (classified) {
        theme[classified.scale].push({ key: classified.key, value });
        hasAnyScale = true;
      }
    }

    return hasAnyScale ? theme : null;
  } catch (err) {
    console.warn("[resolve-theme] v4 theme resolution failed:", (err as Error).message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Tailwind v3: resolve config via resolveConfig
// ---------------------------------------------------------------------------

/** Default Tailwind v3 theme values for common scales */
const V3_SCALE_KEYS: Record<string, keyof ResolvedTailwindTheme> = {
  spacing: "spacing",
  fontSize: "fontSize",
  fontWeight: "fontWeight",
  lineHeight: "lineHeight",
  letterSpacing: "letterSpacing",
  borderRadius: "borderRadius",
  borderWidth: "borderWidth",
  opacity: "opacity",
};

export async function resolveTailwindV3Theme(
  projectRoot: string,
  configPath: string,
): Promise<ResolvedTailwindTheme | null> {
  try {
    const require = createRequire(path.join(projectRoot, "package.json"));

    // Load resolveConfig from the project's tailwindcss
    let resolveConfig: (config: any) => any;
    try {
      resolveConfig = require("tailwindcss/resolveConfig");
    } catch {
      console.warn("[resolve-theme] Could not load tailwindcss/resolveConfig");
      return null;
    }

    // Load the project's config file
    const absConfigPath = path.isAbsolute(configPath)
      ? configPath
      : path.join(projectRoot, configPath);

    let userConfig: any;
    try {
      // Try direct require first (works for .js and .cjs)
      userConfig = require(absConfigPath);
      // Handle ES module default export
      if (userConfig && userConfig.__esModule && userConfig.default) {
        userConfig = userConfig.default;
      }
    } catch {
      // Try jiti for .ts configs
      try {
        const jitiModule = require("jiti");
        const jiti = typeof jitiModule === "function" ? jitiModule(absConfigPath) : jitiModule.default(absConfigPath);
        userConfig = jiti(absConfigPath);
        if (userConfig && userConfig.default) {
          userConfig = userConfig.default;
        }
      } catch {
        console.warn("[resolve-theme] Could not load config:", absConfigPath);
        return null;
      }
    }

    const resolved = resolveConfig(userConfig);
    if (!resolved?.theme) return null;

    const theme: ResolvedTailwindTheme = {
      spacing: [],
      fontSize: [],
      fontWeight: [],
      lineHeight: [],
      letterSpacing: [],
      borderRadius: [],
      borderWidth: [],
      opacity: [],
    };

    for (const [themeKey, scaleKey] of Object.entries(V3_SCALE_KEYS)) {
      const scaleObj = resolved.theme[themeKey];
      if (!scaleObj || typeof scaleObj !== "object") continue;

      for (const [key, val] of Object.entries(scaleObj)) {
        if (val == null) continue;
        // fontSize can be [size, { lineHeight }] tuples
        const value = Array.isArray(val) ? String(val[0]) : String(val);
        theme[scaleKey].push({ key, value });
      }
    }

    // Check if theme has any non-empty scale
    const hasAny = Object.values(theme).some((arr) => arr.length > 0);
    return hasAny ? theme : null;
  } catch (err) {
    console.warn("[resolve-theme] v3 theme resolution failed:", (err as Error).message);
    return null;
  }
}
