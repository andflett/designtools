/**
 * Position icons: position values + inset directions.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `ps_${++_id}`; }

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

function pl(...parts: string[]): SvgPathData {
  return {
    id: nid(), type: "path", d: parts.join(""),
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}

function stroke(d: string, sw = 1): SvgPathData {
  return {
    id: nid(), type: "path", d,
    fill: "none", stroke: "currentColor", strokeWidth: sw,
  };
}

const pos_static = icon(
  pl(R(4, 7, 7, 1)),
);

const pos_relative = icon(
  ef(O(5, 5, 10, 10)),
  stroke("M0.5 0.5L4.5 4.5"),
  stroke("M0.5 3.5L0.5 0.5L3.5 0.5"),
);

const pos_absolute = icon(
  ef(O(5, 5, 5, 5)),
  // Top-left L
  pl(R(0, 0, 1, 4) + R(0, 0, 4, 1)),
  // Top-right L
  pl(R(14, 0, 1, 4) + R(11, 0, 4, 1)),
  // Bottom-left L
  pl(R(0, 11, 1, 4) + R(0, 14, 4, 1)),
  // Bottom-right L
  pl(R(14, 11, 1, 4) + R(11, 14, 4, 1)),
);

const pos_fixed = icon(
  ef(O(0, 0, 15, 15)),
  pl(R(9, 9, 1, 6) + R(9, 9, 6, 1)),
  stroke("M3 3L7.5 7.5"),
  stroke("M7.5 4.5L7.5 7.5L4.5 7.5"),
);

const pos_sticky = icon(
  ef(O(0, 0, 15, 15)),
  pl(R(1, 4, 13, 1)),
  stroke("M7.5 12.5L7.5 7.5"),
  stroke("M5.5 9.5L7.5 7.5L9.5 9.5"),
);

/* ── exports ────────────────────────────────────────────── */

export const POSITION_ICONS: Record<string, SlotIconData> = {
  "position::static": pos_static,
  "position::relative": pos_relative,
  "position::absolute": pos_absolute,
  "position::fixed": pos_fixed,
  "position::sticky": pos_sticky,
};
