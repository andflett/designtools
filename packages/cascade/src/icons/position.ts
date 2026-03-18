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
  // corner ticks marking reserved 9×9 space at (0,0)
  pl(
    R(0, 0, 3, 1), R(0, 1, 1, 2),                     // TL tick
    R(6, 0, 3, 1), R(8, 1, 1, 2),                     // TR tick
    R(0, 6, 1, 2), R(0, 8, 3, 1),                     // BL tick
  ),
  ef(O(6, 6, 9, 9, 1, 1)),                            // shifted element
);

const pos_absolute = icon(
  ef(O(5, 5, 5, 5, 1, 2)),
  // Top-left L (1px round at outer corner)
  pl("M1 0h3v1h-3v3h-1v-3a1 1 0 0 1 1 -1z"),
  // Top-right L
  pl("M11 0h3a1 1 0 0 1 1 1v3h-1v-3h-3z"),
  // Bottom-left L
  pl("M0 11h1v3h3v1h-3a1 1 0 0 1 -1 -1z"),
  // Bottom-right L
  pl("M14 11h1v3a1 1 0 0 1 -1 1h-3v-1h3z"),
);

const pos_fixed = icon(
  ef(O(0, 0, 15, 15, 1, 2)),
  pl(R(9, 9, 1, 6) + R(9, 9, 6, 1)),
  stroke("M3 3L7.5 7.5"),
  stroke("M7.5 4.5L7.5 7.5L4.5 7.5"),
);

const pos_sticky = icon(
  ef(O(0, 0, 15, 15, 1, 2)),
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
