/**
 * Extract SVG path data from Inter font glyphs using opentype.js.
 *
 * Run: node scripts/extract-glyphs.mjs
 *
 * Outputs glyph path constants to ../src/icons/glyph-paths.ts
 * Font: Inter (OFL-1.1 licensed, https://github.com/rsms/inter)
 *
 * Each entry specifies a character and a target bounding box within the
 * 15×15 viewBox. The glyph is scaled to fit that box (maintaining aspect
 * ratio) and centred within it. This allows composing glyphs with other
 * elements (arrows, lines) without runtime transforms.
 *
 * opentype.js preserves Inter's TrueType winding directions, so the
 * default SVG nonzero fill rule works correctly for all glyphs.
 */

import opentype from "opentype.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, "../src/icons/glyph-paths.ts");

function loadFont(filename) {
  const buf = readFileSync(join(__dirname, "fonts", filename));
  return opentype.parse(buf.buffer);
}

const font = loadFont("InterVariable.ttf");
const fontSemiBold = loadFont("Inter-SemiBold.ttf");
const fontItalic = loadFont("Inter-Italic.ttf");

/**
 * Glyph extraction spec.
 *
 * key:    Output key in GLYPH_PATHS (e.g. "A", "A_sm", "a_lower")
 * char:   The actual character to extract
 * box:    Target bounding box [x, y, w, h] within the 15×15 viewBox.
 *         The glyph is scaled to fit within this box and centred.
 * font:   Optional font override ("semibold" | "italic"). Defaults to regular.
 */
const SPECS = [
  // ── Full-size glyphs (fill ~1→14, used as standalone icons) ──
  { key: "A",       char: "A", box: [1, 1, 13, 13] },
  { key: "a_lower", char: "a", box: [1, 1, 13, 13] },
  { key: "B",       char: "B", box: [1, 1, 13, 13] },
  { key: "T",       char: "T", box: [1, 1, 13, 13] },
  { key: "U",       char: "U", box: [1, 1, 13, 13] },
  { key: "S",       char: "S", box: [1, 1, 13, 13] },
  { key: "f_lower", char: "f", box: [1, 1, 13, 13] },

  // ── Composed: text-transform pairs ──
  { key: "A_half_l", char: "A", box: [0, 1, 7, 13] },
  { key: "A_half_r", char: "A", box: [7.5, 1, 7, 13] },
  { key: "a_half_l", char: "a", box: [2, 4.5, 5, 6] },
  { key: "a_half_r", char: "a", box: [8, 4.5, 5, 6] },

  // ── Standard-height standalone glyphs (match text-transform ~8px visual height) ──
  { key: "U_std",       char: "U", box: [1, 3.5, 13, 8] },
  { key: "S_std",       char: "S", box: [1, 3.5, 13, 8] },
  { key: "T_std",       char: "T", box: [1, 3.5, 13, 8] },
  { key: "B_std",       char: "B", box: [1, 3.5, 13, 8], font: "semibold" },
  { key: "f_std",       char: "f", box: [1, 1, 13, 13], font: "italic" },

  // ── Standard-height font-size "AA" (large + small uppercase) ──
  { key: "A_lg_std",    char: "A", box: [0, 3.5, 9, 8] },
  { key: "A_sm_std",    char: "A", box: [8, 5.5, 7, 6] },

  // ── Capitalize "Aa" (large A + small a) ──
  { key: "a_sm_std",    char: "a", box: [8, 5.5, 7, 6] },

  // ── Line-height: centred A with room for horizontal lines above/below ──
  { key: "A_lh",        char: "A", box: [3, 4, 9, 7] },

  // ── Letter-spacing: centred A with room for vertical lines left/right ──
  { key: "A_ls",        char: "A", box: [4, 3.5, 7, 8] },

  // ── Axis labels (standard height) ──
  { key: "X",       char: "X", box: [1, 3.5, 13, 8] },
  { key: "Y",       char: "Y", box: [1, 3.5, 13, 8] },

  // ── Size labels (standard height) ──
  { key: "w_lower", char: "w", box: [1, 3.5, 13, 8] },
  { key: "h_lower", char: "h", box: [1, 3.5, 13, 8] },
];

/**
 * Extract a glyph into a specific target box within the 15×15 viewBox.
 */
function extractGlyph(char, targetBox, sourceFont = font) {
  const glyph = sourceFont.charToGlyph(char);
  const upm = sourceFont.unitsPerEm;

  const bbox = glyph.getBoundingBox();
  const gw = bbox.x2 - bbox.x1;
  const gh = bbox.y2 - bbox.y1;

  if (gw === 0 || gh === 0) {
    console.warn(`Skipping '${char}' — empty bounding box`);
    return null;
  }

  const [tx, ty, tw, th] = targetBox;
  const scale = Math.min(tw / gw, th / gh);

  // Centre the glyph within the target box
  const scaledW = gw * scale;
  const scaledH = gh * scale;
  const offsetX = tx + (tw - scaledW) / 2;
  const offsetY = ty + (th - scaledH) / 2;

  // opentype.js getPath(x, y, fontSize):
  //   x positions the glyph origin (left edge).
  //   y positions the baseline. Font coords have y-up; getPath flips to SVG y-down.
  //   We translate so the bbox top-left maps to (offsetX, offsetY).
  const x = offsetX - bbox.x1 * scale;
  const y = offsetY + bbox.y2 * scale;

  const path = glyph.getPath(x, y, upm * scale);
  const d = path.toPathData(2);

  return {
    d,
    w: Math.round(scaledW * 100) / 100,
    h: Math.round(scaledH * 100) / 100,
  };
}

// Font lookup
const FONTS = { semibold: fontSemiBold, italic: fontItalic };

// Extract all glyphs
const glyphs = {};
for (const spec of SPECS) {
  const sourceFont = spec.font ? FONTS[spec.font] : font;
  const result = extractGlyph(spec.char, spec.box, sourceFont);
  if (result) {
    glyphs[spec.key] = result;
    console.log(`  ${spec.key}: '${spec.char}' → box [${spec.box}], ${result.w}×${result.h}`);
  }
}

// Generate TypeScript output
const lines = [
  `/**`,
  ` * Auto-generated glyph SVG paths from Inter (OFL-1.1).`,
  ` * Generated by: scripts/extract-glyphs.mjs`,
  ` *`,
  ` * Each glyph is scaled to fit a specific bounding box within a 15×15 viewBox.`,
  ` * Uses default nonzero fill rule (Inter's TrueType winding is preserved).`,
  ` * Do not edit manually — re-run the script to regenerate.`,
  ` */`,
  ``,
  `export const GLYPH_PATHS: Record<string, { d: string; w: number; h: number }> = {`,
];

for (const [key, data] of Object.entries(glyphs)) {
  lines.push(`  ${key}: {`);
  lines.push(`    d: "${data.d}",`);
  lines.push(`    w: ${data.w}, h: ${data.h},`);
  lines.push(`  },`);
}

lines.push(`};`);
lines.push(``);

writeFileSync(OUTPUT_PATH, lines.join("\n"));
console.log(`\nWrote ${Object.keys(glyphs).length} glyphs to ${OUTPUT_PATH}`);
