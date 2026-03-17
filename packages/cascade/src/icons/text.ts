/**
 * Text icons: text-align, text-decoration, text-transform, typography.
 *
 * Letterforms use SVG paths extracted from Inter (OFL-1.1) via opentype.js.
 * Each glyph variant is pre-positioned into its target box at extraction time,
 * so no runtime transforms are needed.
 *
 * Decorations (lines) use rect path helpers.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";
import { GLYPH_PATHS } from "./glyph-paths";

let _id = 0;
function nid() { return `tx_${++_id}`; }

const VB = "0 0 15 15";

/* ── path primitives ─────────────────────────────────────── */

/** Filled rectangle. */
function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

/* ── element composers ───────────────────────────────────── */

function ef(...parts: string[]): SvgPathData {
  return {
    id: nid(), type: "path", d: parts.join(""),
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

/** Create a pre-positioned glyph path element (no transform needed). */
function glyph(key: string): SvgPathData {
  const g = GLYPH_PATHS[key];
  if (!g) throw new Error(`Missing glyph: ${key}`);
  return {
    id: nid(), type: "path", d: g.d,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

function icon(...paths: SvgPathData[]): SlotIconData {
  return { viewBox: VB, paths };
}

/* ================================================================
 * TEXT ALIGN — horizontal lines of varying lengths
 * ================================================================ */

const LONG = 13;
const SHORT = 8;

const ta_left = icon(ef(
  R(1, 2, LONG, 1) + R(1, 5, SHORT, 1) + R(1, 8, LONG, 1) + R(1, 11, SHORT, 1),
));
const ta_center = icon(ef(
  R(1, 2, LONG, 1) + R(3, 5, SHORT, 1) + R(1, 8, LONG, 1) + R(3, 11, SHORT, 1),
));
const ta_right = icon(ef(
  R(1, 2, LONG, 1) + R(6, 5, SHORT, 1) + R(1, 8, LONG, 1) + R(6, 11, SHORT, 1),
));
const ta_justify = icon(ef(
  R(1, 2, LONG, 1) + R(1, 5, LONG, 1) + R(1, 8, LONG, 1) + R(1, 11, LONG, 1),
));

/* ================================================================
 * TEXT DECORATION
 * ================================================================ */

const td_underline = icon(glyph("U_std"), ef(R(2, 13, 11, 1)));
const td_linethrough = icon(glyph("S_std"), ef(R(2, 7, 11, 1)));
const td_none = icon(ef(R(4, 7, 7, 1)));

/* ================================================================
 * TEXT TRANSFORM
 * ================================================================ */

const tt_uppercase = icon(glyph("A_half_l"), glyph("A_half_r"));
const tt_lowercase = icon(glyph("a_half_l"), glyph("a_half_r"));
const tt_capitalize = icon(glyph("A_lg_std"), glyph("a_sm_std"));

/* ================================================================
 * TYPOGRAPHY
 * ================================================================ */

const ty_fontfamily = icon(glyph("f_std"));
const ty_fontsize = icon(glyph("A_lg_std"), glyph("A_sm_std"));
const ty_fontweight = icon(glyph("B_std"));

const ty_lineheight = icon(
  glyph("A_lh"),
  ef(R(1, 1, 13, 1)),
  ef(R(1, 13, 13, 1)),
);

const ty_letterspacing = icon(
  glyph("A_ls"),
  ef(R(1, 1, 1, 13)),
  ef(R(13, 1, 1, 13)),
);

/* ── exports ────────────────────────────────────────────── */

export const TEXT_ICONS: Record<string, SlotIconData> = {
  "text-align::left": ta_left,
  "text-align::center": ta_center,
  "text-align::right": ta_right,
  "text-align::justify": ta_justify,

  "text-decoration::underline": td_underline,
  "text-decoration::line-through": td_linethrough,
  "text-decoration::none": td_none,

  "text-transform::uppercase": tt_uppercase,
  "text-transform::lowercase": tt_lowercase,
  "text-transform::capitalize": tt_capitalize,

  "typography::font-family": ty_fontfamily,
  "typography::font-size": ty_fontsize,
  "typography::font-weight": ty_fontweight,
  "typography::line-height": ty_lineheight,
  "typography::letter-spacing": ty_letterspacing,
};
