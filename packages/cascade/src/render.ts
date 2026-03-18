/**
 * SVG rendering utilities for cascade icons.
 */

import * as React from "react";
import type { SvgPathData, SlotIconData } from "./types";

/* ---------- solidify utility ---------- */

/** Clone an icon with all path opacity values set to 1 (full opacity). */
export function solidifyIcon(icon: SlotIconData): SlotIconData {
  return {
    viewBox: icon.viewBox,
    paths: icon.paths.map((p) =>
      p.opacity !== undefined && p.opacity !== 1
        ? { ...p, opacity: 1 }
        : p,
    ),
  };
}

/* ---------- render a single SVG element for the preview ---------- */

export function renderPreviewElement(p: SvgPathData, solid?: boolean) {
  const common = {
    key: p.id,
    fill: p.fill,
    stroke: p.stroke,
    strokeWidth: p.strokeWidth,
    strokeLinecap: p.strokeLinecap,
    strokeLinejoin: p.strokeLinejoin,
    strokeDasharray: p.strokeDasharray,
    opacity: solid ? 1 : (p.opacity ?? 1),
    fillRule: p.fillRule,
    clipRule: p.clipRule,
    transform: p.transform,
  };

  switch (p.type) {
    case "path":
      return React.createElement("path", { ...common, d: p.d });
    case "circle":
      return React.createElement("circle", { ...common, cx: p.cx, cy: p.cy, r: p.r });
    case "rect":
      return React.createElement("rect", { ...common, x: p.x, y: p.y, width: p.width, height: p.height, rx: p.rx });
    case "line":
      return React.createElement("line", { ...common, x1: p.x1, y1: p.y1, x2: p.x2, y2: p.y2 });
    case "polyline":
      return React.createElement("polyline", { ...common, points: p.points });
    default:
      return null;
  }
}

/* ---------- small icon renderer ---------- */

export const PV_BG = "bg-black/[0.04] dark:bg-white/[0.06]";
export const PV_LABEL_COLOR = "text-[color:var(--color-ink3)]/50";

export function IconSvg({ icon, className, rotate = 0, solid = false }: { icon: SlotIconData | undefined; className?: string; rotate?: number; solid?: boolean }) {
  if (!icon) {
    return React.createElement("div", {
      className: `rounded-sm border border-dashed border-[color:var(--color-ink3)]/30 ${className ?? ""}`,
    });
  }
  return React.createElement("svg", {
    viewBox: icon.viewBox,
    className,
    fill: "none",
    style: rotate ? { transform: `rotate(${rotate}deg)` } : undefined,
  }, icon.paths.map((p) => renderPreviewElement(p, solid)));
}
