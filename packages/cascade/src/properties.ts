/**
 * CSS layout property groups and their values.
 * Each value becomes a slot on the icon design board.
 */

export interface LayoutValue {
  /** Machine-friendly key, e.g. "flex-start" */
  key: string;
  /** Display label shown below the slot */
  label: string;
}

export type PreviewType =
  | "segmented"      // icon-only toggle group with tooltips
  | "input"          // single fake input (icon + placeholder text + chevron)
  | "input-pair"     // two side-by-side inputs (e.g. size: width/height)
  | "directional";   // toggleable: single input ↔ 4-input grid

export interface LayoutPropertyGroup {
  /** CSS property name used as the section heading */
  property: string;
  /** Unique slug for localStorage keying */
  slug: string;
  values: LayoutValue[];
  /** How this group renders in preview mode. Defaults to "segmented". */
  preview?: PreviewType;
}

export const LAYOUT_PROPERTIES: LayoutPropertyGroup[] = [
  // ── Position ─────────────────────────────────────────
  {
    property: "position",
    slug: "position",
    values: [
      { key: "static", label: "static" },
      { key: "relative", label: "relative" },
      { key: "absolute", label: "absolute" },
      { key: "fixed", label: "fixed" },
      { key: "sticky", label: "sticky" },
    ],
  },

  // ── Display ──────────────────────────────────────────
  {
    property: "display",
    slug: "display",
    values: [
      { key: "block", label: "block" },
      { key: "inline", label: "inline" },
      { key: "inline-block", label: "inline-block" },
      { key: "flex", label: "flex" },
      { key: "inline-flex", label: "inline-flex" },
      { key: "grid", label: "grid" },
      { key: "inline-grid", label: "inline-grid" },
      { key: "none", label: "none" },
    ],
  },

  // ── Flex direction ───────────────────────────────────
  {
    property: "flex-direction",
    slug: "flex-direction",
    values: [
      { key: "row", label: "row" },
      { key: "row-reverse", label: "row-reverse" },
      { key: "column", label: "column" },
      { key: "column-reverse", label: "column-reverse" },
    ],
  },

  // ── Justify content ──────────────────────────────────
  {
    property: "justify-content",
    slug: "justify-content",
    values: [
      { key: "flex-start", label: "flex-start" },
      { key: "center", label: "center" },
      { key: "flex-end", label: "flex-end" },
      { key: "space-between", label: "space-between" },
      { key: "space-around", label: "space-around" },
      { key: "space-evenly", label: "space-evenly" },
    ],
  },

  // ── Align items ──────────────────────────────────────
  {
    property: "align-items",
    slug: "align-items",
    values: [
      { key: "flex-start", label: "flex-start" },
      { key: "center", label: "center" },
      { key: "flex-end", label: "flex-end" },
      { key: "stretch", label: "stretch" },
      { key: "baseline", label: "baseline" },
    ],
  },

  // ── Align self ───────────────────────────────────────
  {
    property: "align-self",
    slug: "align-self",
    values: [
      { key: "flex-start", label: "flex-start" },
      { key: "center", label: "center" },
      { key: "flex-end", label: "flex-end" },
      { key: "stretch", label: "stretch" },
      { key: "baseline", label: "baseline" },
    ],
  },

  // ── Align content ────────────────────────────────────
  {
    property: "align-content",
    slug: "align-content",
    values: [
      { key: "flex-start", label: "flex-start" },
      { key: "center", label: "center" },
      { key: "flex-end", label: "flex-end" },
      { key: "space-between", label: "space-between" },
      { key: "space-around", label: "space-around" },
      { key: "stretch", label: "stretch" },
    ],
  },

  // ── Flex wrap ────────────────────────────────────────
  {
    property: "flex-wrap",
    slug: "flex-wrap",
    values: [
      { key: "nowrap", label: "nowrap" },
      { key: "wrap", label: "wrap" },
      { key: "wrap-reverse", label: "wrap-reverse" },
    ],
  },

  // ── Flex grow / shrink ─────────────────────────────────
  {
    property: "flex-grow / shrink",
    slug: "flex-grow-shrink",
    values: [
      { key: "flex-grow", label: "flex-grow" },
      { key: "flex-shrink", label: "flex-shrink" },
    ],
  },

  // ── Gap ──────────────────────────────────────────────
  {
    property: "gap",
    slug: "gap",
    preview: "input-pair",
    values: [
      { key: "column", label: "column-gap" },
      { key: "row", label: "row-gap" },
    ],
  },

  // ── Size ───────────────────────────────────────────────
  {
    property: "size",
    slug: "size",
    preview: "input-pair",
    values: [
      { key: "horizontal", label: "horizontal" },
      { key: "vertical", label: "vertical" },
    ],
  },

  // ── Padding ───────────────────────────────────────────
  {
    property: "padding",
    slug: "padding",
    preview: "directional",
    values: [
      { key: "all", label: "all" },
      { key: "top", label: "top" },
      { key: "right", label: "right" },
      { key: "bottom", label: "bottom" },
      { key: "left", label: "left" },
    ],
  },

  // ── Margin ────────────────────────────────────────────
  {
    property: "margin",
    slug: "margin",
    preview: "directional",
    values: [
      { key: "all", label: "all" },
      { key: "top", label: "top" },
      { key: "right", label: "right" },
      { key: "bottom", label: "bottom" },
      { key: "left", label: "left" },
    ],
  },

  // ── Axis ───────────────────────────────────────────────
  {
    property: "axis",
    slug: "axis",
    values: [
      { key: "x", label: "x-axis" },
      { key: "y", label: "y-axis" },
    ],
  },

  // ── Overflow ─────────────────────────────────────────
  {
    property: "overflow",
    slug: "overflow",
    values: [
      { key: "visible", label: "visible" },
      { key: "hidden", label: "hidden" },
      { key: "scroll", label: "scroll" },
      { key: "auto", label: "auto" },
    ],
  },

  // ── Border radius ────────────────────────────────────
  {
    property: "border-radius",
    slug: "border-radius",
    preview: "directional",
    values: [
      { key: "all", label: "all" },
      { key: "top-left", label: "top-left" },
      { key: "top-right", label: "top-right" },
      { key: "bottom-right", label: "bottom-right" },
      { key: "bottom-left", label: "bottom-left" },
    ],
  },

  // ── Border style ─────────────────────────────────────
  {
    property: "border-style",
    slug: "border-style",
    preview: "input",
    values: [{ key: "style", label: "style" }],
  },

  // ── Typography ───────────────────────────────────────
  {
    property: "typography",
    slug: "typography",
    preview: "input",
    values: [
      { key: "font-family", label: "font-family" },
      { key: "font-size", label: "font-size" },
      { key: "font-weight", label: "font-weight" },
      { key: "line-height", label: "line-height" },
      { key: "letter-spacing", label: "letter-spacing" },
    ],
  },

  // ── Text align ───────────────────────────────────────
  {
    property: "text-align",
    slug: "text-align",
    values: [
      { key: "left", label: "left" },
      { key: "center", label: "center" },
      { key: "right", label: "right" },
      { key: "justify", label: "justify" },
    ],
  },

  // ── Text decoration ──────────────────────────────────
  {
    property: "text-decoration",
    slug: "text-decoration",
    values: [
      { key: "underline", label: "underline" },
      { key: "line-through", label: "line-through" },
      { key: "none", label: "none" },
    ],
  },

  // ── Text transform ───────────────────────────────────
  {
    property: "text-transform",
    slug: "text-transform",
    values: [
      { key: "uppercase", label: "uppercase" },
      { key: "lowercase", label: "lowercase" },
      { key: "capitalize", label: "capitalize" },
    ],
  },

  // ── Opacity ──────────────────────────────────────────
  {
    property: "opacity",
    slug: "opacity",
    preview: "input",
    values: [{ key: "opacity", label: "opacity" }],
  },

  // ── Box shadow ───────────────────────────────────────
  {
    property: "box-shadow",
    slug: "box-shadow",
    preview: "input",
    values: [{ key: "shadow", label: "shadow" }],
  },
];

/** Build a unique key for a slot (used for localStorage). */
export function slotKey(groupSlug: string, valueKey: string): string {
  return `${groupSlug}::${valueKey}`;
}

/** Total number of icon slots across all groups. */
export const TOTAL_SLOTS = LAYOUT_PROPERTIES.reduce(
  (sum, g) => sum + g.values.length,
  0,
);
