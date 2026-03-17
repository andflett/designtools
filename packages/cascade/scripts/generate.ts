/**
 * Icon generator — reads SlotIconData from src/icons and produces:
 *   generated/svg/{PascalName}.svg       — static SVG files
 *   generated/icons/{PascalName}.tsx      — React forwardRef components
 *   generated/types.ts                    — CascadeIconProps type
 *   generated/metadata.json               — property/value → icon name lookup
 *   generated/index.ts                    — barrel exports
 *
 * Usage: npx tsx scripts/generate.ts
 */

import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DEFAULT_ICONS, POSITION_ICONS, DISPLAY_ICONS, FLEX_ICONS, ALIGNMENT_ICONS, DISTRIBUTION_ICONS, SPACING_ICONS, BORDER_ICONS, OVERFLOW_ICONS, TEXT_ICONS, VISUAL_ICONS } from "../src/icons/index.js";
import type { SlotIconData, SvgPathData } from "../src/types.js";

const OUT = join(import.meta.dirname!, "..", "generated");
const SVG_DIR = join(OUT, "svg");
const ICONS_DIR = join(OUT, "icons");

// ── Naming helpers ──────────────────────────────────────────

/** Convert kebab-case to PascalCase. */
function toPascal(kebab: string): string {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/**
 * Convert a source `"property::value"` key to a PascalCase icon name.
 * Names match CSS property + value, with fixes for redundant/fake prefixes.
 */
function toIconName(key: string): string {
  const [prop, val] = key.split("::");

  // Redundant value — property name is sufficient
  if (prop === "opacity" && val === "opacity") return "Opacity";
  if (prop === "border-style" && val === "style") return "BorderStyle";
  if (prop === "border-width" && val === "width") return "BorderWidth";
  if (prop === "box-shadow" && val === "shadow") return "BoxShadow";

  // Fake 'typography' prefix — use actual CSS property names
  if (prop === "typography") return toPascal(val);

  // Fake 'flex-grow-shrink' group — use the actual property
  if (prop === "flex-grow-shrink") return toPascal(val);

  // Standard: PropertyValue
  return toPascal(prop) + toPascal(val);
}

/**
 * Extract the real CSS property from the source key.
 * Handles fake group names that don't match actual CSS properties.
 */
function toProperty(key: string): string {
  const [prop, val] = key.split("::");
  if (prop === "typography") return val; // font-family, font-size, etc.
  if (prop === "flex-grow-shrink") return val; // flex-grow, flex-shrink
  return prop;
}

/**
 * Extract the real CSS value from the source key.
 * For entries where the property IS the value, returns null.
 */
function toValue(key: string): string | null {
  const [prop, val] = key.split("::");
  // These are property-only icons (no specific value)
  if (prop === "opacity" && val === "opacity") return null;
  if (prop === "border-style" && val === "style") return null;
  if (prop === "border-width" && val === "width") return null;
  if (prop === "box-shadow" && val === "shadow") return null;
  if (prop === "typography") return null;
  if (prop === "flex-grow-shrink") return null;
  return val;
}

// ── SVG attribute helpers ───────────────────────────────────

/** camelCase → kebab-case for SVG attributes. */
const CAMEL_TO_KEBAB: Record<string, string> = {
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray",
  fillRule: "fill-rule",
  clipRule: "clip-rule",
};

function kebabAttr(name: string): string {
  return CAMEL_TO_KEBAB[name] ?? name;
}

/** Build attribute string for a static SVG element. */
function svgAttrs(p: SvgPathData): string {
  const attrs: string[] = [];

  const add = (name: string, value: string | number | undefined) => {
    if (value === undefined) return;
    attrs.push(`${kebabAttr(name)}="${value}"`);
  };

  // Type-specific geometry attributes
  switch (p.type) {
    case "path":
      add("d", p.d);
      break;
    case "circle":
      add("cx", p.cx);
      add("cy", p.cy);
      add("r", p.r);
      break;
    case "rect":
      add("x", p.x);
      add("y", p.y);
      add("width", p.width);
      add("height", p.height);
      if (p.rx !== undefined) add("rx", p.rx);
      break;
    case "line":
      add("x1", p.x1);
      add("y1", p.y1);
      add("x2", p.x2);
      add("y2", p.y2);
      break;
    case "polyline":
      add("points", p.points);
      break;
  }

  // Presentation attributes
  if (p.fill && p.fill !== "none") add("fill", p.fill);
  else if (p.fill === "none") add("fill", "none");
  if (p.stroke && p.stroke !== "none") add("stroke", p.stroke);
  if (p.strokeWidth && p.stroke !== "none") add("strokeWidth", p.strokeWidth);
  if (p.strokeLinecap) add("strokeLinecap", p.strokeLinecap);
  if (p.strokeLinejoin) add("strokeLinejoin", p.strokeLinejoin);
  if (p.strokeDasharray) add("strokeDasharray", p.strokeDasharray);
  if (p.fillRule) add("fillRule", p.fillRule);
  if (p.clipRule) add("clipRule", p.clipRule);
  if (p.opacity !== undefined && p.opacity !== 1) add("opacity", p.opacity);
  if (p.transform) add("transform", p.transform);

  return attrs.join(" ");
}

/** Build JSX attribute string for a React component element. */
function jsxAttrs(p: SvgPathData): string {
  const attrs: string[] = [];

  const add = (name: string, value: string | number | undefined) => {
    if (value === undefined) return;
    attrs.push(`${name}="${value}"`);
  };

  const addColor = (name: string, value: string | undefined) => {
    if (!value || value === "none") {
      if (value === "none") attrs.push(`${name}="none"`);
      return;
    }
    if (value === "currentColor") {
      attrs.push(`${name}={color}`);
    } else {
      attrs.push(`${name}="${value}"`);
    }
  };

  // Type-specific geometry attributes
  switch (p.type) {
    case "path":
      add("d", p.d);
      break;
    case "circle":
      add("cx", p.cx);
      add("cy", p.cy);
      add("r", p.r);
      break;
    case "rect":
      add("x", p.x);
      add("y", p.y);
      add("width", p.width);
      add("height", p.height);
      if (p.rx !== undefined) add("rx", p.rx);
      break;
    case "line":
      add("x1", p.x1);
      add("y1", p.y1);
      add("x2", p.x2);
      add("y2", p.y2);
      break;
    case "polyline":
      add("points", p.points);
      break;
  }

  // Presentation attributes — use {color} for currentColor
  addColor("fill", p.fill);
  if (p.stroke && p.stroke !== "none") addColor("stroke", p.stroke);
  if (p.strokeWidth && p.stroke !== "none") add("strokeWidth", p.strokeWidth);
  if (p.strokeLinecap) add("strokeLinecap", p.strokeLinecap);
  if (p.strokeLinejoin) add("strokeLinejoin", p.strokeLinejoin);
  if (p.strokeDasharray) add("strokeDasharray", p.strokeDasharray);
  if (p.fillRule) add("fillRule", p.fillRule);
  if (p.clipRule) add("clipRule", p.clipRule);
  if (p.opacity !== undefined && p.opacity !== 1) add("opacity", p.opacity);
  if (p.transform) add("transform", p.transform);

  return attrs.join(" ");
}

// ── Generators ──────────────────────────────────────────────

function generateSvg(icon: { viewBox: string; paths: SvgPathData[] }): string {
  const [, , w, h] = icon.viewBox.split(" ");
  const elements = icon.paths
    .map((p) => `  <${p.type} ${svgAttrs(p)} />`)
    .join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="${w}" height="${h}" fill="none">\n${elements}\n</svg>\n`;
}

function generateComponent(
  name: string,
  icon: { viewBox: string; paths: SvgPathData[] },
): string {
  const [, , w, h] = icon.viewBox.split(" ");
  const elements = icon.paths
    .map((p) => `      <${p.type} ${jsxAttrs(p)} />`)
    .join("\n");

  return `import { forwardRef } from "react";
import type { CascadeIconProps } from "../types";

const ${name} = forwardRef<SVGSVGElement, CascadeIconProps>(
  ({ color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${icon.viewBox}"
      width="${w}"
      height="${h}"
      fill="none"
      {...props}
    >
${elements}
    </svg>
  )
);
${name}.displayName = "${name}";
export { ${name} };
`;
}

const TYPES_CONTENT = `import type { SVGAttributes } from "react";

export interface CascadeIconProps extends SVGAttributes<SVGSVGElement> {
  /** Icon colour. Defaults to \`currentColor\` (inherits from parent text colour). */
  color?: string;
  /** Icons do not accept children. */
  children?: never;
}

/** A single SVG shape element within an icon. */
export interface SvgPathData {
  id: string;
  type: "path" | "circle" | "rect" | "line" | "polyline";
  d?: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  width?: number;
  height?: number;
  rx?: number;
  points?: string;
  opacity?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
  strokeDasharray?: string;
  fillRule?: "nonzero" | "evenodd";
  clipRule?: "nonzero" | "evenodd";
  transform?: string;
}

/** Icon data: viewBox string and array of shape elements. */
export interface SlotIconData {
  viewBox: string;
  paths: SvgPathData[];
}

/** Metadata entry mapping a CSS property/value to an icon. */
export interface IconEntry {
  /** CSS property name, e.g. "align-items" */
  property: string;
  /** CSS value, e.g. "flex-start". Null for property-level icons. */
  value: string | null;
  /** PascalCase icon name matching the SVG file and React component. */
  icon: string;
}
`;

// ── Main ────────────────────────────────────────────────────

// Clean previous output
rmSync(OUT, { recursive: true, force: true });
mkdirSync(SVG_DIR, { recursive: true });
mkdirSync(ICONS_DIR, { recursive: true });

const entries: { name: string; key: string }[] = [];

for (const [key, icon] of Object.entries(DEFAULT_ICONS)) {
  const name = toIconName(key);
  entries.push({ name, key });

  // Write static SVG (PascalCase filename)
  writeFileSync(join(SVG_DIR, `${name}.svg`), generateSvg(icon));

  // Write React component (PascalCase filename)
  writeFileSync(join(ICONS_DIR, `${name}.tsx`), generateComponent(name, icon));
}

// Write types.ts
writeFileSync(join(OUT, "types.ts"), TYPES_CONTENT);

// ── Generate metadata.json ──────────────────────────────────

const metadata: { property: string; value: string | null; icon: string }[] = [];
for (const { name, key } of entries) {
  metadata.push({
    property: toProperty(key),
    value: toValue(key),
    icon: name,
  });
}
writeFileSync(join(OUT, "metadata.json"), JSON.stringify(metadata, null, 2) + "\n");

// Write barrel index.ts
const barrelLines = [
  "// Auto-generated barrel — do not edit manually.",
  '// Run `npm run generate` to regenerate.',
  "",
  'export type { CascadeIconProps, SvgPathData, SlotIconData, IconEntry } from "./types";',
  "",
  ...entries.map((e) => `export { ${e.name} } from "./icons/${e.name}";`),
  "",
  "// Metadata",
  'import type { IconEntry } from "./types";',
  'import _metadata from "./metadata.json";',
  "export const metadata: IconEntry[] = _metadata;",
  "",
  "// Data maps (workspace use — SlotIconData with path arrays)",
  'export { DEFAULT_ICONS, POSITION_ICONS, DISPLAY_ICONS, FLEX_ICONS, ALIGNMENT_ICONS, DISTRIBUTION_ICONS, SPACING_ICONS, BORDER_ICONS, OVERFLOW_ICONS, TEXT_ICONS, VISUAL_ICONS, ICON_NAME_TO_KEY } from "./data";',
  "",
  "// Render utilities",
  'export { renderPreviewElement, IconSvg, PV_BG, PV_LABEL_COLOR } from "./render";',
  "",
  "// Properties",
  'export { LAYOUT_PROPERTIES, slotKey, TOTAL_SLOTS } from "./properties";',
  'export type { LayoutValue, PreviewType, LayoutPropertyGroup } from "./properties";',
  "",
];
writeFileSync(join(OUT, "index.ts"), barrelLines.join("\n"));

// ── Generate data.ts — serialized icon data maps ──────────────────

function serializeIconMap(name: string, map: Record<string, SlotIconData>): string {
  const mapEntries = Object.entries(map).map(([key, icon]) => {
    const paths = icon.paths.map((p) => JSON.stringify(p)).join(",\n    ");
    return `  ${JSON.stringify(key)}: { viewBox: ${JSON.stringify(icon.viewBox)}, paths: [\n    ${paths}\n  ] }`;
  });
  return `export const ${name}: Record<string, SlotIconData> = {\n${mapEntries.join(",\n")}\n};\n`;
}

const GROUPS: [string, Record<string, SlotIconData>][] = [
  ["POSITION_ICONS", POSITION_ICONS],
  ["DISPLAY_ICONS", DISPLAY_ICONS],
  ["FLEX_ICONS", FLEX_ICONS],
  ["ALIGNMENT_ICONS", ALIGNMENT_ICONS],
  ["DISTRIBUTION_ICONS", DISTRIBUTION_ICONS],
  ["SPACING_ICONS", SPACING_ICONS],
  ["BORDER_ICONS", BORDER_ICONS],
  ["OVERFLOW_ICONS", OVERFLOW_ICONS],
  ["TEXT_ICONS", TEXT_ICONS],
  ["VISUAL_ICONS", VISUAL_ICONS],
];

// Build icon name → legacy key map
const nameToKeyEntries = entries.map((e) => `  ${JSON.stringify(e.name)}: ${JSON.stringify(e.key)}`);

const dataLines = [
  "// Auto-generated data maps — do not edit manually.",
  '// Run `npm run generate` to regenerate.',
  "",
  'import type { SlotIconData } from "./types";',
  "",
  ...GROUPS.map(([name, map]) => serializeIconMap(name, map)),
  "export const DEFAULT_ICONS: Record<string, SlotIconData> = {",
  ...GROUPS.map(([name]) => `  ...${name},`),
  "};",
  "",
  "/** Map from PascalCase icon name to internal slot key. */",
  "export const ICON_NAME_TO_KEY: Record<string, string> = {",
  nameToKeyEntries.join(",\n"),
  "};",
  "",
];
writeFileSync(join(OUT, "data.ts"), dataLines.join("\n"));

// ── Copy render.ts and properties.ts verbatim ──────────────────

const SRC = join(import.meta.dirname!, "..", "src");

const renderSrc = readFileSync(join(SRC, "render.ts"), "utf-8");
writeFileSync(join(OUT, "render.ts"), renderSrc);

const propertiesSrc = readFileSync(join(SRC, "properties.ts"), "utf-8");
writeFileSync(join(OUT, "properties.ts"), propertiesSrc);

console.log(`Generated ${entries.length} icons → ${OUT}`);
console.log(`  ${entries.length} SVGs in svg/`);
console.log(`  ${entries.length} React components in icons/`);
console.log(`  types.ts + index.ts + data.ts + metadata.json + render.ts + properties.ts`);
