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

function bracket(x: number, y: number, h: number, capW: number): string {
  return R(x, y, 1, h) + R(x - capW + 1, y, capW, 1) + R(x - capW + 1, y + h - 1, capW, 1);
}

function bracketWithGaps(x: number, y: number, h: number, capW: number, lineYs: number[]): string {
  const yEnd = y + h;
  const segments: string[] = [];
  let cur = y;
  for (const ly of lineYs.sort((a, b) => a - b)) {
    const gapStart = ly - 1;
    const gapEnd = ly + 2;
    if (cur < gapStart) segments.push(R(x, cur, 1, gapStart - cur));
    cur = gapEnd;
  }
  if (cur < yEnd) segments.push(R(x, cur, 1, yEnd - cur));
  segments.push(R(x - capW + 1, y, capW, 1));
  segments.push(R(x - capW + 1, yEnd - 1, capW, 1));
  return segments.join("");
}

const ov_visible = icon(
  pl(bracketWithGaps(9, 0, 15, 3, [4, 7, 10])),
  pl(R(1, 4, 12, 1) + R(1, 7, 10, 1) + R(1, 10, 12, 1)),
);

const ov_hidden = icon(
  pl(bracket(9, 0, 15, 3)),
  pl(R(1, 4, 7, 1) + R(1, 7, 5, 1) + R(1, 10, 7, 1)),
);

const ov_scroll = icon(
  pl(bracket(9, 0, 15, 3)),
  pl(R(1, 4, 7, 1) + R(1, 7, 5, 1) + R(1, 10, 7, 1)),
  cd(11, 3), cd(11, 5), cd(11, 7), cd(11, 9), cd(11, 11),
);

const ov_auto = icon(pl(R(4, 7, 7, 1)));

/* ── exports ────────────────────────────────────────────── */

export const OVERFLOW_ICONS: Record<string, SlotIconData> = {
  "overflow::visible": ov_visible,
  "overflow::hidden": ov_hidden,
  "overflow::scroll": ov_scroll,
  "overflow::auto": ov_auto,
};
