/**
 * Spacing icons: padding, margin, gap, size.
 * Style: 15×15 viewBox, multi-path with circle dots, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";
import { GLYPH_PATHS } from "./glyph-paths";

let _id = 0;
function nid() { return `sp_${++_id}`; }

const VB = "0 0 15 15";

/* ── path-builder primitives ────────────────────────────── */

function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

/** Rounded rect (CW). Falls back to sharp R() when r<=0. */
function RR(x: number, y: number, w: number, h: number, r: number): string {
  if (r <= 0) return R(x, y, w, h);
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
}

/** Outlined block with 1px rounded outer corners, sharp inner cutout. */
function O(x: number, y: number, w: number, h: number, t = 1): string {
  return RR(x, y, w, h, 1) + R(x + t, y + t, w - t * 2, h - t * 2);
}

/* ── element composers ──────────────────────────────────── */

function ef(...parts: string[]): SvgPathData {
  return {
    id: nid(), type: "path", d: parts.join(""),
    fill: "currentColor", stroke: "none", strokeWidth: 0,
    fillRule: "evenodd",
  };
}

/** 1×1 circle dot. Grid coord (x,y) → centre at (x+0.5, y+0.5). */
function cd(x: number, y: number): SvgPathData {
  return {
    id: nid(), type: "circle",
    cx: x + 0.5, cy: y + 0.5, r: 0.5,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

function icon(...paths: SvgPathData[]): SlotIconData {
  return { viewBox: VB, paths };
}

/* ================================================================
 * PADDING — circle dots INSIDE the box
 * ================================================================ */

const PAD_TOP = [cd(4, 4), cd(7, 4), cd(10, 4)];
const PAD_RIGHT = [cd(10, 4), cd(10, 7), cd(10, 10)];
const PAD_BOTTOM = [cd(4, 10), cd(7, 10), cd(10, 10)];
const PAD_LEFT = [cd(4, 4), cd(4, 7), cd(4, 10)];

const pad_all = icon(ef(O(1, 1, 13, 13)), ...PAD_TOP, ...PAD_RIGHT, ...PAD_BOTTOM, ...PAD_LEFT);
const pad_top = icon(ef(O(1, 1, 13, 13)), ...PAD_TOP);
const pad_right = icon(ef(O(1, 1, 13, 13)), ...PAD_RIGHT);
const pad_bottom = icon(ef(O(1, 1, 13, 13)), ...PAD_BOTTOM);
const pad_left = icon(ef(O(1, 1, 13, 13)), ...PAD_LEFT);

/* ================================================================
 * MARGIN — circle dots OUTSIDE the box
 * ================================================================ */

const mar_all = icon(
  ef(O(5, 5, 5, 5)),
  cd(1, 1), cd(3, 1), cd(5, 1), cd(7, 1), cd(9, 1), cd(11, 1), cd(13, 1),
  cd(1, 13), cd(3, 13), cd(5, 13), cd(7, 13), cd(9, 13), cd(11, 13), cd(13, 13),
  cd(1, 3), cd(1, 5), cd(1, 7), cd(1, 9), cd(1, 11),
  cd(13, 3), cd(13, 5), cd(13, 7), cd(13, 9), cd(13, 11),
);

const mar_top = icon(
  ef(O(1, 5, 13, 9)),
  cd(1, 1), cd(3, 1), cd(5, 1), cd(7, 1), cd(9, 1), cd(11, 1), cd(13, 1),
  cd(1, 3), cd(13, 3),
);

const mar_right = icon(
  ef(O(1, 1, 9, 13)),
  cd(13, 1), cd(13, 3), cd(13, 5), cd(13, 7), cd(13, 9), cd(13, 11), cd(13, 13),
  cd(11, 1), cd(11, 13),
);

const mar_bottom = icon(
  ef(O(1, 1, 13, 9)),
  cd(1, 13), cd(3, 13), cd(5, 13), cd(7, 13), cd(9, 13), cd(11, 13), cd(13, 13),
  cd(1, 11), cd(13, 11),
);

const mar_left = icon(
  ef(O(5, 1, 9, 13)),
  cd(1, 1), cd(1, 3), cd(1, 5), cd(1, 7), cd(1, 9), cd(1, 11), cd(1, 13),
  cd(3, 1), cd(3, 13),
);

/* ================================================================
 * GAP — two boxes pushed to edges with dots in the space between
 * ================================================================ */

const gap_col = icon(
  ef(O(0, 0, 5, 15) + O(10, 0, 5, 15)),
  cd(7, 3), cd(7, 5), cd(7, 7), cd(7, 9), cd(7, 11),
);

const gap_row = icon(
  ef(O(0, 0, 15, 5) + O(0, 10, 15, 5)),
  cd(3, 7), cd(5, 7), cd(7, 7), cd(9, 7), cd(11, 7),
);

/* ================================================================
 * SIZE — full-size lowercase letter glyphs
 * ================================================================ */

/** Create a pre-positioned glyph path element. */
function glyph(key: string): SvgPathData {
  const g = GLYPH_PATHS[key];
  if (!g) throw new Error(`Missing glyph: ${key}`);
  return {
    id: nid(), type: "path", d: g.d,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

const size_horizontal = icon(glyph("w_lower"));
const size_vertical = icon(glyph("h_lower"));

/* ================================================================
 * AXIS — full-size uppercase letter glyphs
 * ================================================================ */

const axis_x = icon(glyph("X"));
const axis_y = icon(glyph("Y"));

/* ── exports ────────────────────────────────────────────── */

export const SPACING_ICONS: Record<string, SlotIconData> = {
  "padding::all": pad_all,
  "padding::top": pad_top,
  "padding::right": pad_right,
  "padding::bottom": pad_bottom,
  "padding::left": pad_left,

  "margin::all": mar_all,
  "margin::top": mar_top,
  "margin::right": mar_right,
  "margin::bottom": mar_bottom,
  "margin::left": mar_left,

  "gap::column": gap_col,
  "gap::row": gap_row,

  "size::horizontal": size_horizontal,
  "size::vertical": size_vertical,

  "axis::x": axis_x,
  "axis::y": axis_y,
};
