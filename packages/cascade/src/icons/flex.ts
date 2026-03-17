/**
 * Flex-related icons: flex-direction, flex-wrap, flex-grow/shrink.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `fx_${++_id}`; }

const VB = "0 0 15 15";

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
 * FLEX DIRECTION
 * ================================================================ */

function curve(d: string): SvgPathData {
  return {
    id: nid(), type: "path", d,
    fill: "none", stroke: "currentColor", strokeWidth: 1,
  };
}

function arrowRight(cy: number, x1 = 0, x2 = 15): SvgPathData[] {
  const c = cy + 0.5;
  const tip = x2 - 0.5;
  return [
    pl(R(x1, cy, tip - x1, 1)),
    { id: nid(), type: "path", d: `M${tip - 2} ${c - 2}L${tip} ${c}L${tip - 2} ${c + 2}`, fill: "none", stroke: "currentColor", strokeWidth: 1 },
  ];
}
function arrowLeft(cy: number, x1 = 0, x2 = 15): SvgPathData[] {
  const c = cy + 0.5;
  const tip = x1 + 0.5;
  return [
    pl(R(tip, cy, x2 - tip, 1)),
    { id: nid(), type: "path", d: `M${tip + 2} ${c - 2}L${tip} ${c}L${tip + 2} ${c + 2}`, fill: "none", stroke: "currentColor", strokeWidth: 1 },
  ];
}
function arrowDown(cx: number, y1 = 0, y2 = 15): SvgPathData[] {
  const c = cx + 0.5;
  const tip = y2 - 0.5;
  return [
    pl(R(cx, y1, 1, tip - y1)),
    { id: nid(), type: "path", d: `M${c - 2} ${tip - 2}L${c} ${tip}L${c + 2} ${tip - 2}`, fill: "none", stroke: "currentColor", strokeWidth: 1 },
  ];
}
function arrowUp(cx: number, y1 = 0, y2 = 15): SvgPathData[] {
  const c = cx + 0.5;
  const tip = y1 + 0.5;
  return [
    pl(R(cx, tip, 1, y2 - tip)),
    { id: nid(), type: "path", d: `M${c - 2} ${tip + 2}L${c} ${tip}L${c + 2} ${tip + 2}`, fill: "none", stroke: "currentColor", strokeWidth: 1 },
  ];
}

const fd_row = icon(
  ef(O(0, 0, 9, 7.5)),
  ef(O(10, 0, 5, 7.5)),
  ...arrowRight(12, 1, 14),
);

const fd_row_reverse = icon(
  ef(O(0, 0, 9, 7.5)),
  ef(O(10, 0, 5, 7.5)),
  ...arrowLeft(12, 1, 14),
);

const fd_column = icon(
  ef(O(0, 0, 7.5, 8)),
  ef(O(0, 9, 7.5, 5)),
  ...arrowDown(12, 1, 13),
);

const fd_column_reverse = icon(
  ef(O(0, 0, 7.5, 8)),
  ef(O(0, 9, 7.5, 5)),
  ...arrowUp(12, 1, 13),
);

/* ================================================================
 * FLEX WRAP
 * ================================================================ */

const fw_nowrap = icon(
  ef(O(0, 5, 4, 5)),
  ef(O(5.5, 5, 4, 5)),
  ef(O(11, 5, 4, 5)),
);

const fw_wrap = icon(
  ef(O(0, 2, 4, 5)),
  ef(O(5, 2, 4, 5)),
  ef(O(0, 8, 4, 5)),
  curve("M10.5 4.5L12 4.5C13.5 4.5 14.5 5.5 14.5 7.5C14.5 9.5 13.5 10.5 12 10.5L7 10.5"),
  curve("M9 8.5L7 10.5L9 12.5"),
);

const fw_wrap_reverse = icon(
  ef(O(0, 2, 4, 5)),
  ef(O(0, 8, 4, 5)),
  ef(O(5, 8, 4, 5)),
  curve("M10.5 10.5L12 10.5C13.5 10.5 14.5 9.5 14.5 7.5C14.5 5.5 13.5 4.5 12 4.5L7 4.5"),
  curve("M9 2.5L7 4.5L9 6.5"),
);

/* ================================================================
 * FLEX GROW / SHRINK
 * ================================================================ */

const fg_grow = icon(
  ef(O(5, 2, 5, 11)),
  pl(R(0.5, 7, 3.5, 1)),
  curve("M2.5 5.5L0.5 7.5L2.5 9.5"),
  pl(R(11, 7, 3.5, 1)),
  curve("M12.5 5.5L14.5 7.5L12.5 9.5"),
);

const fg_shrink = icon(
  ef(O(5, 2, 5, 11)),
  pl(R(0.5, 7, 3.5, 1)),
  curve("M2 5.5L4 7.5L2 9.5"),
  pl(R(11, 7, 3.5, 1)),
  curve("M13 5.5L11 7.5L13 9.5"),
);

/* ── exports ────────────────────────────────────────────── */

export const FLEX_ICONS: Record<string, SlotIconData> = {
  "flex-direction::row": fd_row,
  "flex-direction::row-reverse": fd_row_reverse,
  "flex-direction::column": fd_column,
  "flex-direction::column-reverse": fd_column_reverse,

  "flex-wrap::nowrap": fw_nowrap,
  "flex-wrap::wrap": fw_wrap,
  "flex-wrap::wrap-reverse": fw_wrap_reverse,

  "flex-grow-shrink::flex-grow": fg_grow,
  "flex-grow-shrink::flex-shrink": fg_shrink,
};
