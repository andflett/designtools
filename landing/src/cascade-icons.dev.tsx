/**
 * Dev mode — imports directly from workspace source via relative paths.
 * Resolved via Vite alias `#cascade` in development.
 */

import {
  DEFAULT_ICONS,
  ICON_NAME_TO_KEY,
  renderPreviewElement,
  solidifyIcon,
  IconSvg,
  PV_BG,
  PV_LABEL_COLOR,
  metadata,
} from "../../packages/cascade/generated/index";

import type { SlotIconData, SvgPathData, IconEntry } from "../../packages/cascade/generated/index";

export type CascadeIcon = SlotIconData;

export { IconSvg, PV_BG, PV_LABEL_COLOR, renderPreviewElement, solidifyIcon, metadata };
export type { IconEntry };

/* ── Lookup by property + value ── */

const _lookup = new Map<string, SlotIconData>();
for (const entry of metadata) {
  const key = entry.value !== null ? `${entry.property}\0${entry.value}` : entry.property;
  const slotKey = ICON_NAME_TO_KEY[entry.icon];
  if (slotKey && DEFAULT_ICONS[slotKey]) _lookup.set(key, DEFAULT_ICONS[slotKey]);
}

/** Look up an icon by CSS property and value. */
export function lookupIcon(property: string, value: string | null): CascadeIcon | undefined {
  return _lookup.get(value !== null ? `${property}\0${value}` : property);
}

/* ── SVG string builder (serializes from path data) ── */

const CAMEL_TO_KEBAB: Record<string, string> = {
  strokeWidth: "stroke-width",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray",
  fillRule: "fill-rule",
  clipRule: "clip-rule",
};

function svgElementString(p: SvgPathData, solid = false): string {
  const attrs: string[] = [];
  const addAttr = (name: string, val: string | number | undefined) => {
    if (val !== undefined && val !== "none" && val !== 0) attrs.push(`${CAMEL_TO_KEBAB[name] ?? name}="${val}"`);
  };

  switch (p.type) {
    case "path": addAttr("d", p.d); break;
    case "circle": addAttr("cx", p.cx); addAttr("cy", p.cy); addAttr("r", p.r); break;
    case "rect": addAttr("x", p.x); addAttr("y", p.y); addAttr("width", p.width); addAttr("height", p.height); addAttr("rx", p.rx); break;
    case "line": addAttr("x1", p.x1); addAttr("y1", p.y1); addAttr("x2", p.x2); addAttr("y2", p.y2); break;
    case "polyline": addAttr("points", p.points); break;
  }

  if (p.fill !== "none") addAttr("fill", p.fill);
  else attrs.push('fill="none"');
  if (p.stroke !== "none") { addAttr("stroke", p.stroke); addAttr("stroke-width", p.strokeWidth); }
  if (p.strokeLinecap) addAttr("strokeLinecap", p.strokeLinecap);
  if (p.strokeLinejoin) addAttr("strokeLinejoin", p.strokeLinejoin);
  if (p.strokeDasharray) addAttr("strokeDasharray", p.strokeDasharray);
  if (p.fillRule) addAttr("fillRule", p.fillRule);
  if (p.clipRule) addAttr("clipRule", p.clipRule);
  if (p.opacity !== undefined && p.opacity !== 1 && !solid) addAttr("opacity", p.opacity);
  if (p.transform) addAttr("transform", p.transform);

  return `  <${p.type} ${attrs.join(" ")} />`;
}

export function iconToSvgString(icon: SlotIconData, solid = false): string {
  const children = icon.paths.map((p) => svgElementString(p, solid)).join("\n");
  return `<svg viewBox="${icon.viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">\n${children}\n</svg>`;
}

/** Generate a React JSX usage string for copying. */
export function iconToReactString(name: string, solid: boolean): string {
  const props: string[] = [];
  if (solid) props.push("solid");
  return props.length > 0 ? `<${name} ${props.join(" ")} />` : `<${name} />`;
}
