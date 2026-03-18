/**
 * Display icons: block, inline, inline-block, flex, inline-flex,
 * grid, inline-grid, none.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `dp_${++_id}`; }

const VB = "0 0 15 15";

function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

/** Rounded rect (CW). Falls back to sharp R() when r<=0. */
function RR(x: number, y: number, w: number, h: number, r: number): string {
  if (r <= 0) return R(x, y, w, h);
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
}

/** Outlined block with rounded outer corners, inner cutout radius = r-t. */
function O(x: number, y: number, w: number, h: number, t = 1, r = 1): string {
  return RR(x, y, w, h, r) + RR(x + t, y + t, w - t * 2, h - t * 2, Math.max(0, r - t));
}

function ef(...parts: string[]): SvgPathData {
  return {
    id: nid(), type: "path", d: parts.join(""),
    fill: "currentColor", stroke: "none", strokeWidth: 0,
    fillRule: "evenodd",
  };
}

function pl(...parts: string[]): SvgPathData {
  return {
    id: nid(), type: "path", d: parts.join(""),
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

function icon(...paths: SvgPathData[]): SlotIconData {
  return { viewBox: VB, paths };
}

/* ================================================================
 * DISPLAY
 * ================================================================ */

const d_block = icon(
  ef(O(0, 0, 15, 15, 1, 2)),
);

const d_inline = icon(
  pl(R(0, 4, 4, 1)),
  ef(O(5, 2, 5, 5)),
  pl(R(11, 4, 4, 1)),
  pl(R(0, 9, 15, 1)),
  pl(R(0, 12, 15, 1)),
);

const d_inline_block = icon(
  pl(R(0, 7, 2, 1)),
  ef(O(3, 3, 9, 9)),
  pl(R(13, 7, 2, 1)),
);

const d_flex = icon(
  ef(O(0, 0, 15, 15, 1, 2)),      // outer box
  pl(R(8, 1, 1, 13)),              // vertical divider, offset right
);

const d_inline_flex = icon(
  pl(R(0, 7, 2, 1)),
  ef(O(3, 3, 4, 9)),
  ef(O(8, 3, 4, 9)),
  pl(R(13, 7, 2, 1)),
);

const d_grid = icon(
  ef(O(0, 0, 15, 15, 1, 2)),      // outer box
  pl(R(1, 7, 13, 1)),             // horizontal divider
  pl(R(7, 1, 1, 6)),              // vertical divider (top row only)
);

const d_inline_grid = icon(
  pl(R(0, 7, 2, 1)),
  ef(O(3, 3, 4, 4)),
  ef(O(8, 3, 4, 4)),
  ef(O(3, 8, 4, 4)),
  ef(O(8, 8, 4, 4)),
  pl(R(13, 7, 2, 1)),
);

const d_none = icon(
  ef(O(0, 0, 15, 15, 1, 2)),
  { id: nid(), type: "path", d: "M1 14L14 1", fill: "none", stroke: "currentColor", strokeWidth: 1 },
);

/* ── exports ────────────────────────────────────────────── */

export const DISPLAY_ICONS: Record<string, SlotIconData> = {
  "display::block": d_block,
  "display::inline": d_inline,
  "display::inline-block": d_inline_block,
  "display::flex": d_flex,
  "display::inline-flex": d_inline_flex,
  "display::grid": d_grid,
  "display::inline-grid": d_inline_grid,
  "display::none": d_none,
};
