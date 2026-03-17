/**
 * SVG path element data — describes a single shape in an icon.
 */
export interface SvgPathData {
  id: string;
  /** SVG element type */
  type: "path" | "circle" | "rect" | "line" | "polyline";
  /** Attributes for the SVG element */
  d?: string; // path d attribute
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  width?: number;
  height?: number;
  rx?: number;
  points?: string;
  /** Opacity 0–1, defaults to 1 */
  opacity?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeLinecap?: "round" | "butt" | "square";
  strokeLinejoin?: "round" | "miter" | "bevel";
  strokeDasharray?: string;
  fillRule?: "nonzero" | "evenodd";
  clipRule?: "nonzero" | "evenodd";
  transform?: string;
}

/**
 * A single icon — viewBox plus an array of SVG path elements.
 */
export interface SlotIconData {
  viewBox: string;
  paths: SvgPathData[];
}
