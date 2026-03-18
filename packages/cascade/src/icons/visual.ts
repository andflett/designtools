/**
 * Visual effect icons: opacity, box-shadow.
 * Style: 15×15 viewBox, multi-path, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `vi_${++_id}`; }

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

/** 1px diameter dot at grid position (x,y), centred at (x+0.5, y+0.5). */
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
 * OPACITY — two overlapping outlined circles, dot grid in overlap
 * ================================================================ */

/** Outlined circle ring (evenodd cutout). */
function ring(cx: number, cy: number, r: number, t = 1): string {
  const ri = r - t;
  const outer = `M${cx - r},${cy}a${r},${r} 0 1,1 ${r * 2},0a${r},${r} 0 1,1 ${-r * 2},0`;
  const inner = `M${cx - ri},${cy}a${ri},${ri} 0 1,0 ${ri * 2},0a${ri},${ri} 0 1,0 ${-ri * 2},0`;
  return outer + inner;
}

/** Diagonal hatch lines as a stroked path. */
function hatch(segments: [number, number, number, number][], sw = 0.7): SvgPathData {
  const d = segments.map(([x1, y1, x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`).join("");
  return {
    id: nid(), type: "path", d,
    fill: "none", stroke: "currentColor", strokeWidth: sw,
  };
}

const vi_opacity = icon(
  ef(ring(6, 6, 6, 0.75)),
  ef(ring(9, 9, 6, 0.75)),
  // diamond grid of dots filling the overlap lens (2px spacing)
  cd(7, 5), cd(9, 5),
  cd(6, 6), cd(8, 6),
  cd(5, 7), cd(7, 7), cd(9, 7),
  cd(6, 8), cd(8, 8),
  cd(5, 9), cd(7, 9),
);

/* ================================================================
 * BOX SHADOW — outlined box with L-shaped dot shadow
 * ================================================================ */

const vi_shadow = icon(
  // right strip dots
  cd(11, 3), cd(13, 3),
  cd(11, 5), cd(13, 5),
  cd(11, 7), cd(13, 7),
  cd(11, 9), cd(13, 9),
  // bottom strip dots
  cd(3, 11), cd(5, 11), cd(7, 11), cd(9, 11),
  cd(3, 13), cd(5, 13), cd(7, 13), cd(9, 13),
  // corner dots
  cd(11, 11), cd(13, 11),
  cd(11, 13), cd(13, 13),
  // box outline (on top)
  ef(O(0, 0, 10, 10, 1, 2)),
);

/* ── exports ────────────────────────────────────────────── */

export const VISUAL_ICONS: Record<string, SlotIconData> = {
  "opacity::opacity": vi_opacity,
  "box-shadow::shadow": vi_shadow,
};
