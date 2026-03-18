/**
 * Copy generated icons to the publish repo at /Users/andrew/Sites/cascade/.
 *
 * Usage: npx tsx scripts/copy-to-publish.ts
 */

import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const GENERATED = join(import.meta.dirname!, "..", "generated");
const PUBLISH = "/Users/andrew/Sites/cascade";

if (!existsSync(GENERATED)) {
  console.error("Error: generated/ not found. Run `npm run generate` first.");
  process.exit(1);
}

if (!existsSync(PUBLISH)) {
  console.error(`Error: publish repo not found at ${PUBLISH}`);
  process.exit(1);
}

// Copy SVGs
cpSync(join(GENERATED, "svg"), join(PUBLISH, "svg"), { recursive: true });
console.log("Copied svg/ → cascade/svg/");

// Copy React components
cpSync(join(GENERATED, "icons"), join(PUBLISH, "src/icons"), { recursive: true });
console.log("Copied icons/ → cascade/src/icons/");

// Write minimal types.ts for published package (no internal SvgPathData/SlotIconData)
const publishTypes = `import type { SVGAttributes } from "react";

export interface CascadeIconProps extends SVGAttributes<SVGSVGElement> {
  /** Icon colour. Defaults to \\\`currentColor\\\` (inherits from parent text colour). */
  color?: string;
  /** Render at full opacity (strips duotone fading). No effect on non-duotone icons. */
  solid?: boolean;
  /** Icons do not accept children. */
  children?: never;
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
writeFileSync(join(PUBLISH, "src/types.ts"), publishTypes);
console.log("Wrote types.ts → cascade/src/types.ts (CascadeIconProps + IconEntry)");

// Copy metadata.json
cpSync(join(GENERATED, "metadata.json"), join(PUBLISH, "src/metadata.json"));
console.log("Copied metadata.json → cascade/src/metadata.json");

// Write barrel index (icons + metadata for npm)
const publishBarrel = [
  "// Auto-generated barrel — do not edit manually.",
  '// Run `npm run generate` in the monorepo to regenerate.',
  "",
  'export type { CascadeIconProps, IconEntry } from "./types";',
  "",
];

// Extract icon component exports from generated barrel
const generatedBarrel = readFileSync(join(GENERATED, "index.ts"), "utf-8");
for (const line of generatedBarrel.split("\n")) {
  if (line.startsWith("export {") && line.includes("./icons/")) {
    publishBarrel.push(line);
  }
}
publishBarrel.push("");

// Metadata
publishBarrel.push("// Metadata");
publishBarrel.push('import type { IconEntry } from "./types";');
publishBarrel.push('import _metadata from "./metadata.json";');
publishBarrel.push("export const metadata: IconEntry[] = _metadata;");
publishBarrel.push("");

writeFileSync(join(PUBLISH, "src/index.ts"), publishBarrel.join("\n"));
console.log("Copied index.ts → cascade/src/index.ts (icons + metadata)");

console.log("\nDone — publish repo updated.");
