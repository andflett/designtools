/**
 * Border icons: border-radius, border-style.
 * Style: 15×15 viewBox, multi-path with circle dots, no strokes.
 */

import type { SlotIconData } from "../types";
import type { SvgPathData } from "../types";

let _id = 0;
function nid() { return `bd_${++_id}`; }

const VB = "0 0 15 15";

function R(x: number, y: number, w: number, h: number): string {
  return `M${x} ${y}h${w}v${h}h${-w}z`;
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

/* ================================================================
 * BORDER STYLE — three line styles stacked vertically
 * ================================================================ */

const bs_style = icon(
  // solid
  ef(R(1, 3, 13, 1)),
  // dashed: 3px dash, 2px gap, 3px dash, 2px gap, 3px dash = 13px
  ef(R(1, 7, 3, 1) + R(6, 7, 3, 1) + R(11, 7, 3, 1)),
  // dotted
  cd(1, 11), cd(3, 11), cd(5, 11), cd(7, 11), cd(9, 11), cd(11, 11), cd(13, 11),
);

/* ================================================================
 * BORDER WIDTH — three horizontal lines of increasing thickness
 * ================================================================ */

const bw_width = icon(
  ef(R(1, 3, 13, 1)),
  ef(R(1, 7, 13, 2)),
  ef(R(1, 11, 13, 3)),
);

/* ================================================================
 * BORDER RADIUS — L-shaped brackets with rounded inner corner
 * ================================================================ */

const br_tl = icon(ef(
  "M4 11v-4a3 3 0 0 1 3-3h4v1h-4a2 2 0 0 0-2 2v4z",
));
const br_tr = icon(ef(
  "M11 11v-4a3 3 0 0 0-3-3h-4v1h4a2 2 0 0 1 2 2v4z",
));
const br_br = icon(ef(
  "M11 4v4a3 3 0 0 1-3 3h-4v-1h4a2 2 0 0 0 2-2v-4z",
));
const br_bl = icon(ef(
  "M4 4v4a3 3 0 0 0 3 3h4v-1h-4a2 2 0 0 1-2-2v-4z",
));

const br_all = icon(ef(
  // top-left
  "M2 6v-1a3 3 0 0 1 3-3h1v1h-1a2 2 0 0 0-2 2v1z" +
  // top-right
  "M13 6v-1a3 3 0 0 0-3-3h-1v1h1a2 2 0 0 1 2 2v1z" +
  // bottom-right
  "M9 13h1a3 3 0 0 0 3-3v-1h-1v1a2 2 0 0 1-2 2h-1z" +
  // bottom-left
  "M6 13h-1a3 3 0 0 1-3-3v-1h1v1a2 2 0 0 0 2 2h1z",
));

/* ── exports ────────────────────────────────────────────── */

export const BORDER_ICONS: Record<string, SlotIconData> = {
  "border-style::style": bs_style,
  "border-width::width": bw_width,

  "border-radius::all": br_all,
  "border-radius::top-left": br_tl,
  "border-radius::top-right": br_tr,
  "border-radius::bottom-right": br_br,
  "border-radius::bottom-left": br_bl,
};
