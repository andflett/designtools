/**
 * Alignment icons: justify-content, align-items, align-self, align-content.
 * Style: 15×15 viewBox, solid filled blocks + faded (30%) boundary walls.
 *
 * All icons drawn horizontally (distribution along x-axis).
 * The UI rotates for different axis contexts.
 *
 * justify-content: 2 portrait blocks (3×9) + faded boundary walls.
 * align-items: 2 landscape blocks (different widths) + faded boundaries.
 * align-self: same as align-items, top block anchored at start.
 * align-content: 2 landscape bars (same width = rows) distributed.
 * baseline: solid blocks + dotted baseline (no boundary walls).
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `al_${++_id}`; }

const VB = "0 0 15 15";

function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
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

function curve(d: string): SvgPathData {
  return { id: nid(), type: "path", d, fill: "none", stroke: "currentColor", strokeWidth: 1 };
}

function icon(...paths: SvgPathData[]): SlotIconData {
  return { viewBox: VB, paths };
}

/* ================================================================
 * JUSTIFY-CONTENT — faded boundary walls + solid blocks
 * ================================================================ */

/** Faded path at reduced opacity. */
function faded(d: string, op = 0.15): SvgPathData {
  return {
    id: nid(), type: "path", d,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
    opacity: op,
  };
}

/** Rounded rect (CW). Falls back to sharp R() when r<=0. */
function RR(x: number, y: number, w: number, h: number, r: number): string {
  if (r <= 0) return R(x, y, w, h);
  return `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;
}

/** Faded boundary line (full height). */
function bound(x: number): SvgPathData { return faded(R(x, 0, 1, 15), 0.3); }

const BR = 0.5;
const dist_start   = icon(bound(0), pl(RR(3, 3, 3, 9, BR)), pl(RR(7, 3, 3, 9, BR)));
const dist_center  = icon(bound(0), pl(RR(4, 3, 3, 9, BR)), pl(RR(8, 3, 3, 9, BR)), bound(14));
const dist_end     = icon(pl(RR(5, 3, 3, 9, BR)), pl(RR(9, 3, 3, 9, BR)), bound(14));
const dist_between = icon(bound(0), pl(RR(2, 3, 3, 9, BR)), pl(RR(10, 3, 3, 9, BR)), bound(14));
// space-around: two outward arrows — shaft from tip like grow/shrink
const dist_around  = icon(
  bound(0),
  pl(R(2.5, 7, 4, 1)),                                // ← shaft
  curve("M4.5 5.5L2.5 7.5L4.5 9.5"),                  // ◁ chevron
  pl(R(8.5, 7, 4, 1)),                                // → shaft
  curve("M10.5 5.5L12.5 7.5L10.5 9.5"),               // ▷ chevron
  bound(14),
);

// space-evenly: 3 blocks, all gaps equal — no arrowheads + boundaries
const dist_evenly  = icon(
  bound(0),
  pl(RR(2, 3, 2, 9, BR)), pl(RR(6.5, 3, 2, 9, BR)), pl(RR(11, 3, 2, 9, BR)),
  bound(14),
);
const dist_stretch = icon(bound(0), pl(RR(3, 3, 9, 9, BR)), bound(14));

/* ================================================================
 * ALIGN-ITEMS — 2 landscape blocks, different widths
 * ================================================================ */

const AW1 = 9, AW2 = 5, AH = 4;
const AY1 = 3, AY2 = 8;

const align_start = icon(
  bound(0),
  pl(RR(2, AY1, AW1, AH, BR)),
  pl(RR(2, AY2, AW2, AH, BR)),
);
const align_center = icon(
  bound(0),
  pl(RR(3, AY1, AW1, AH, BR)),
  pl(RR(5, AY2, AW2, AH, BR)),
  bound(14),
);
const align_end = icon(
  pl(RR(4, AY1, AW1, AH, BR)),
  pl(RR(8, AY2, AW2, AH, BR)),
  bound(14),
);
const align_stretch = icon(
  bound(0),
  pl(RR(2, AY1, 11, AH, BR)),
  pl(RR(2, AY2, 11, AH, BR)),
  bound(14),
);
const align_baseline = icon(
  cd(0, 8), cd(7, 8), cd(14, 8),
  pl(RR(2, 1, 3, 12, BR)),
  pl(RR(9, 4, 3, 9, BR)),
);

/* ================================================================
 * ALIGN-SELF — wide block anchored at start, narrow block moves
 * ================================================================ */

const as_start = icon(
  bound(0),
  faded(RR(2, AY1, AW1, AH, BR), 0.3),
  pl(RR(2, AY2, AW2, AH, BR)),
);
const as_center = icon(
  bound(0),
  faded(RR(2, AY1, AW1, AH, BR), 0.3),
  pl(RR(5, AY2, AW2, AH, BR)),
  bound(14),
);
const as_end = icon(
  bound(0),
  faded(RR(2, AY1, AW1, AH, BR), 0.3),
  pl(RR(8, AY2, AW2, AH, BR)),
  bound(14),
);
const as_stretch = icon(
  bound(0),
  faded(RR(2, AY1, AW1, AH, BR), 0.3),
  pl(RR(2, AY2, 11, AH, BR)),
  bound(14),
);
const as_baseline = icon(
  cd(0, 8), cd(7, 8), cd(14, 8),
  faded(RR(2, 1, 3, 12, BR), 0.3),
  pl(RR(9, 4, 3, 9, BR)),
);

/* ================================================================
 * ALIGN-CONTENT — 2 landscape bars (rows), same width, distributed
 * ================================================================ */

const CW = 4, CH = 3, CY = 6;

const ac_start   = icon(bound(0), pl(RR(2, CY, CW, CH, BR)), pl(RR(7, CY, CW, CH, BR)));
const ac_center  = icon(bound(0), pl(RR(3, CY, CW, CH, BR)), pl(RR(8, CY, CW, CH, BR)), bound(14));
const ac_end     = icon(pl(RR(4, CY, CW, CH, BR)), pl(RR(9, CY, CW, CH, BR)), bound(14));
const ac_between = icon(bound(0), pl(RR(2, CY, CW, CH, BR)), pl(RR(9, CY, CW, CH, BR)), bound(14));
const ac_around  = icon(
  bound(0),
  pl(R(2.5, 7, 4, 1)),
  curve("M4.5 5.5L2.5 7.5L4.5 9.5"),
  pl(R(8.5, 7, 4, 1)),
  curve("M10.5 5.5L12.5 7.5L10.5 9.5"),
  bound(14),
);
const ac_evenly  = icon(
  bound(0),
  pl(RR(2, CY, 2, CH, BR)), pl(RR(6.5, CY, 2, CH, BR)), pl(RR(11, CY, 2, CH, BR)),
  bound(14),
);
const ac_stretch = icon(bound(0), pl(RR(2, CY, 11, CH, BR)), bound(14));

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
  "justify-content::stretch": dist_stretch,

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
