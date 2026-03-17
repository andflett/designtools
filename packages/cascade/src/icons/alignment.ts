/**
 * Alignment icons: justify-content, align-items, align-self, align-content.
 * Style: 15×15 viewBox, multi-path, no strokes, 1px rounded corners.
 *
 * All icons drawn horizontally (distribution along x-axis).
 * The UI rotates for different axis contexts.
 *
 * justify-content: 2 portrait blocks (items) + vertical boundary lines.
 *   Blocks are vertical (tall) to read as individual items.
 *
 * align-items: 2 landscape blocks (different widths, 1px gap).
 *   Boundary line 1px taller than blocks on each side.
 *   Width difference → height difference when rotated 90°.
 *
 * align-self: same as align-items, top block anchored at start.
 *
 * align-content: 2 landscape bars (same width = rows) distributed.
 *   Same distribution patterns as justify-content but landscape bars
 *   represent rows/lines rather than individual items.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `al_${++_id}`; }

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
 * BOUNDARY — 1px vertical line, 9px tall (y=3→12)
 * ================================================================ */

function vLine(x: number): string { return R(x, 1, 1, 13); }

/* ================================================================
 * JUSTIFY-CONTENT — 2 portrait blocks (items), 3w × 11h
 * ================================================================ */

const JW = 3, JH = 9, JY = 3;

const dist_start   = icon(pl(vLine(0)), ef(O(2, JY, JW, JH)), ef(O(6, JY, JW, JH)));
const dist_center  = icon(pl(vLine(0)), ef(O(4, JY, JW, JH)), ef(O(8, JY, JW, JH)), pl(vLine(14)));
const dist_end     = icon(ef(O(6, JY, JW, JH)), ef(O(10, JY, JW, JH)), pl(vLine(14)));
const dist_between = icon(pl(vLine(0)), ef(O(2, JY, JW, JH)), ef(O(10, JY, JW, JH)), pl(vLine(14)));
const dist_around  = icon(pl(vLine(0)), ef(O(3, JY, JW, JH)), ef(O(9, JY, JW, JH)), pl(vLine(14)));
const dist_evenly  = icon(pl(vLine(0)), ef(O(3.5, JY, JW, JH)), ef(O(8.5, JY, JW, JH)), pl(vLine(14)));
const dist_stretch = icon(pl(vLine(0)), ef(O(2, JY, 11, JH)), pl(vLine(14)));

/* ================================================================
 * ALIGN-ITEMS — 2 landscape blocks, different widths, 1px gap
 * ================================================================ */

const AW1 = 8, AW2 = 5, AH = 4;
const AY1 = 3, AY2 = 8;

const align_start = icon(
  pl(vLine(0)),
  ef(O(2, AY1, AW1, AH)),
  ef(O(2, AY2, AW2, AH)),
);
const align_center = icon(
  pl(vLine(0)),
  ef(O(3.5, AY1, AW1, AH)),
  ef(O(5, AY2, AW2, AH)),
  pl(vLine(14)),
);
const align_end = icon(
  ef(O(5, AY1, AW1, AH)),
  ef(O(8, AY2, AW2, AH)),
  pl(vLine(14)),
);
const align_stretch = icon(
  pl(vLine(0)),
  ef(O(2, AY1, 11, AH)),
  ef(O(2, AY2, 11, AH)),
  pl(vLine(14)),
);
const align_baseline = icon(
  ef(O(2, 1, AW1, AH)),
  ef(O(5, 4, AW2, AH)),
  cd(1, 10), cd(4, 10), cd(7, 10), cd(10, 10), cd(13, 10),
);

/* ================================================================
 * ALIGN-SELF — wide block anchored at start, narrow block moves
 * ================================================================ */

const as_start = icon(
  pl(vLine(0)),
  ef(O(2, AY1, AW1, AH)),
  ef(O(2, AY2, AW2, AH)),
);
const as_center = icon(
  pl(vLine(0)),
  ef(O(2, AY1, AW1, AH)),
  ef(O(5, AY2, AW2, AH)),
  pl(vLine(14)),
);
const as_end = icon(
  pl(vLine(0)),
  ef(O(2, AY1, AW1, AH)),
  ef(O(8, AY2, AW2, AH)),
  pl(vLine(14)),
);
const as_stretch = icon(
  pl(vLine(0)),
  ef(O(2, AY1, AW1, AH)),
  ef(O(2, AY2, 11, AH)),
  pl(vLine(14)),
);
const as_baseline = icon(
  ef(O(2, 1, AW1, AH)),
  ef(O(5, 4, AW2, AH)),
  cd(1, 10), cd(4, 10), cd(7, 10), cd(10, 10), cd(13, 10),
);

/* ================================================================
 * ALIGN-CONTENT — 2 landscape bars (rows), same width, distributed
 * ================================================================ */

const CW = 4, CH = 3, CY = 6;

const ac_start   = icon(pl(vLine(0)), ef(O(2, CY, CW, CH)), ef(O(7, CY, CW, CH)));
const ac_center  = icon(pl(vLine(0)), ef(O(3, CY, CW, CH)), ef(O(8, CY, CW, CH)), pl(vLine(14)));
const ac_end     = icon(ef(O(4, CY, CW, CH)), ef(O(9, CY, CW, CH)), pl(vLine(14)));
const ac_between = icon(pl(vLine(0)), ef(O(2, CY, CW, CH)), ef(O(9, CY, CW, CH)), pl(vLine(14)));
const ac_around  = icon(pl(vLine(0)), ef(O(2.5, CY, CW, CH)), ef(O(8.5, CY, CW, CH)), pl(vLine(14)));
const ac_evenly  = icon(pl(vLine(0)), ef(O(3.5, CY, CW, CH)), ef(O(7.5, CY, CW, CH)), pl(vLine(14)));
const ac_stretch = icon(pl(vLine(0)), ef(O(2, CY, 11, CH)), pl(vLine(14)));

/* ── exports ────────────────────────────────────────────── */

/** Distribution icons — used by justify-content.
 *  The UI rotates: 0° for main axis, 90° for cross axis. */
export const DISTRIBUTION_ICONS: Record<string, SlotIconData> = {
  "flex-start": dist_start,
  start: dist_start,
  center: dist_center,
  end: dist_end,
  "flex-end": dist_end,
  "space-between": dist_between,
  "space-around": dist_around,
  "space-evenly": dist_evenly,
  stretch: dist_stretch,
};

export const ALIGNMENT_ICONS: Record<string, SlotIconData> = {
  "justify-content::flex-start": dist_start,
  "justify-content::center": dist_center,
  "justify-content::flex-end": dist_end,
  "justify-content::space-between": dist_between,
  "justify-content::space-around": dist_around,
  "justify-content::space-evenly": dist_evenly,

  "align-items::flex-start": align_start,
  "align-items::start": align_start,
  "align-items::center": align_center,
  "align-items::flex-end": align_end,
  "align-items::end": align_end,
  "align-items::stretch": align_stretch,
  "align-items::baseline": align_baseline,

  "align-self::auto": { viewBox: VB, paths: [pl(R(4, 7, 7, 1))] },
  "align-self::flex-start": as_start,
  "align-self::start": as_start,
  "align-self::center": as_center,
  "align-self::flex-end": as_end,
  "align-self::end": as_end,
  "align-self::stretch": as_stretch,
  "align-self::baseline": as_baseline,

  "align-content::flex-start": ac_start,
  "align-content::start": ac_start,
  "align-content::center": ac_center,
  "align-content::flex-end": ac_end,
  "align-content::end": ac_end,
  "align-content::space-between": ac_between,
  "align-content::space-around": ac_around,
  "align-content::space-evenly": ac_evenly,
  "align-content::stretch": ac_stretch,
};
