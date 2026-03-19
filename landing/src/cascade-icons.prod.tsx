/**
 * Prod mode — imports from npm package (React components + metadata).
 * Resolved via Vite alias `#cascade` in production builds.
 */

import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Cascade from "@designtools/cascade";
import type { CascadeIconProps, IconEntry } from "@designtools/cascade";

export type { IconEntry };

export type CascadeIcon = {
  Component: React.FC<CascadeIconProps>;
  property: string;
  value: string | null;
};

export const metadata: IconEntry[] = Cascade.metadata;

/* ── Build lookup from metadata + components ── */

const components: Record<string, React.FC<CascadeIconProps>> = Cascade as any;

const _lookup = new Map<string, CascadeIcon>();
for (const entry of metadata) {
  const Component = components[entry.icon] as React.FC<CascadeIconProps> | undefined;
  if (Component != null) {
    const key = entry.value !== null ? `${entry.property}\0${entry.value}` : entry.property;
    _lookup.set(key, { Component, property: entry.property, value: entry.value });
  }
}

/** Look up an icon by CSS property and value. */
export function lookupIcon(property: string, value: string | null): CascadeIcon | undefined {
  return _lookup.get(value !== null ? `${property}\0${value}` : property);
}

/* ── Rendering ── */

export const PV_BG = "bg-black/[0.04] dark:bg-white/[0.06]";
export const PV_LABEL_COLOR = "text-[color:var(--color-ink3)]/50";

export function IconSvg({
  icon,
  className,
  rotate = 0,
  solid = false,
}: {
  icon: CascadeIcon | undefined;
  className?: string;
  rotate?: number;
  solid?: boolean;
}) {
  if (!icon) {
    return React.createElement("div", {
      className: `rounded-sm border border-dashed border-[color:var(--color-ink3)]/30 ${className ?? ""}`,
    });
  }
  const { Component } = icon;
  return React.createElement(Component, {
    className,
    solid,
    style: rotate ? { transform: `rotate(${rotate}deg)` } : undefined,
  });
}

export function iconToSvgString(icon: CascadeIcon, solid = false): string {
  const { Component } = icon;
  return renderToStaticMarkup(React.createElement(Component, { solid }));
}

/** Generate a React JSX usage string for copying. */
export function iconToReactString(name: string, solid: boolean): string {
  const props: string[] = [];
  if (solid) props.push("solid");
  return props.length > 0 ? `<${name} ${props.join(" ")} />` : `<${name} />`;
}
