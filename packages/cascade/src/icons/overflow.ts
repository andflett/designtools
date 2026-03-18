/**
 * Overflow icons: visible, hidden, scroll, auto.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `ov_${++_id}`; }

const VB = "0 0 15 15";

function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
}

/** Rounded rect (CW). Falls back to sharp R() when r<=0. */
function RR(x: number, y: number, w: number, h: number, r: number): string {
  if (r <= 0) return R(x, y, w, h);
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
}

function C(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}v${h}h${w}v${-h}z`;
}

function O(x: number, y: number, w: number, h: number, t = 1): string {
  return R(x, y, w, h) + C(x + t, y + t, w - t * 2, h - t * 2);
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
 * OVERFLOW
 * ================================================================ */

/** Faded path at reduced opacity. */
function faded(d: string, op = 0.3): SvgPathData {
  return {
    id: nid(), type: "path", d,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
    opacity: op,
  };
}

// Broken ] bracket — vertical at x=9 with gaps where bars cut through
const BROKEN_BRACKET =
  R(6, 1, 4, 1) +    // top cap
  R(9, 2, 1, 2) +    // vertical y=2-3
                      // gap y=4-10 (bars at y=5,9 + white either side)
  R(9, 11, 1, 2) +   // vertical y=11-12
  R(6, 13, 4, 1);    // bottom cap

// Solid ] bracket — no gaps (content is clipped)
const SOLID_BRACKET = R(9, 1, 1, 13) + R(6, 1, 4, 1) + R(6, 13, 4, 1);

const ov_visible = icon(
  pl(BROKEN_BRACKET),                                  // ] with gaps where bars cut through
  pl(R(0, 5, 15, 1)),                                 // bar 1 — full width, overflows well past ]
  pl(R(0, 9, 15, 1)),                                 // bar 2 — full width, overflows well past ]
);

const ov_hidden = icon(
  pl(SOLID_BRACKET),                                   // solid ] (clip edge)
  pl(R(1, 5, 7, 1)),                                  // bar 1 — stops at bracket
  pl(R(1, 9, 5, 1)),                                  // bar 2 — shorter, clipped
);

const ov_scroll = icon(
  pl(R(1, 5, 7, 1)),                                  // bar 1
  pl(R(1, 9, 5, 1)),                                  // bar 2
  faded(R(11, 1, 2, 13), 0.15),                       // scrollbar track (duotone)
  pl(R(11, 1, 2, 4)),                                 // scrollbar handle (solid)
);

const ov_auto = icon(pl(R(4, 7, 7, 1)));

/* ── exports ────────────────────────────────────────────── */

export const OVERFLOW_ICONS: Record<string, SlotIconData> = {
  "overflow::visible": ov_visible,
  "overflow::hidden": ov_hidden,
  "overflow::scroll": ov_scroll,
  "overflow::auto": ov_auto,
};
