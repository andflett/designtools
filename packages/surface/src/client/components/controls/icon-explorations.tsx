/**
 * icon-explorations.tsx
 *
 * Gallery page for exploring padding/margin icon options.
 * Three options (A, B, C) shown side by side for comparison.
 *
 * To view: render <IconExplorations /> in the editor or controls gallery.
 */
import {
  PaddingAllA, PaddingTopA, PaddingRightA, PaddingBottomA, PaddingLeftA,
  MarginAllA, MarginTopA, MarginRightA, MarginBottomA, MarginLeftA,
  PaddingAllB, PaddingTopB, PaddingRightB, PaddingBottomB, PaddingLeftB,
  MarginAllB, MarginTopB, MarginRightB, MarginBottomB, MarginLeftB,
  PaddingAllC, PaddingTopC, PaddingRightC, PaddingBottomC, PaddingLeftC,
  MarginAllC, MarginTopC, MarginRightC, MarginBottomC, MarginLeftC,
} from "./spacing-icons.js";

type IconComp = React.ComponentType<{ style?: React.CSSProperties }>;

interface IconSet {
  all: IconComp;
  top: IconComp;
  right: IconComp;
  bottom: IconComp;
  left: IconComp;
}

const OPTIONS: {
  name: string;
  description: string;
  padding: IconSet;
  margin: IconSet;
}[] = [
  {
    name: "A — Nested Boxes",
    description:
      "Padding: solid outer + solid inner box (gap = padding). Margin: dashed outer + solid box (gap = margin). Per-side variants use a directional line.",
    padding: { all: PaddingAllA, top: PaddingTopA, right: PaddingRightA, bottom: PaddingBottomA, left: PaddingLeftA },
    margin: { all: MarginAllA, top: MarginTopA, right: MarginRightA, bottom: MarginBottomA, left: MarginLeftA },
  },
  {
    name: "B — Bracket Lines",
    description:
      "Padding: solid lines inside the element boundary pointing inward. Margin: dashed lines outside the element boundary pointing outward. Inspired by the reference spacing icons.",
    padding: { all: PaddingAllB, top: PaddingTopB, right: PaddingRightB, bottom: PaddingBottomB, left: PaddingLeftB },
    margin: { all: MarginAllB, top: MarginTopB, right: MarginRightB, bottom: MarginBottomB, left: MarginLeftB },
  },
  {
    name: "C — Hatched Regions",
    description:
      "Padding: semi-transparent shaded region between border and content. Margin: semi-transparent shaded region outside the element. Like DevTools box model.",
    padding: { all: PaddingAllC, top: PaddingTopC, right: PaddingRightC, bottom: PaddingBottomC, left: PaddingLeftC },
    margin: { all: MarginAllC, top: MarginTopC, right: MarginRightC, bottom: MarginBottomC, left: MarginLeftC },
  },
];

const SIDES = ["all", "top", "right", "bottom", "left"] as const;

function IconCell({ Icon, label }: { Icon: IconComp; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--studio-surface-hover, rgba(255,255,255,0.04))",
          borderRadius: 6,
          border: "1px solid var(--studio-border-subtle, rgba(255,255,255,0.06))",
        }}
      >
        <Icon style={{ width: 15, height: 15 }} />
      </div>
      <span
        style={{
          fontSize: 8,
          color: "var(--studio-text-dimmed, #666)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function IconRow({ label, icons }: { label: string; icons: IconSet }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 9,
          color: "var(--studio-text-muted, #888)",
          width: 48,
          flexShrink: 0,
          textAlign: "right",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {SIDES.map((side) => (
          <IconCell key={side} Icon={icons[side]} label={side} />
        ))}
      </div>
    </div>
  );
}

function OptionGroup({
  name,
  description,
  padding,
  margin,
}: {
  name: string;
  description: string;
  padding: IconSet;
  margin: IconSet;
}) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--studio-surface, #111)",
        borderRadius: 8,
        border: "1px solid var(--studio-border, rgba(255,255,255,0.08))",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--studio-text, #e8e8e8)",
          marginBottom: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: 9,
          color: "var(--studio-text-dimmed, #666)",
          lineHeight: 1.5,
          marginBottom: 12,
          maxWidth: 360,
        }}
      >
        {description}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <IconRow label="Padding" icons={padding} />
        <IconRow label="Margin" icons={margin} />
      </div>

      {/* Large preview — "all" icons at 2x for easier comparison */}
      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: "1px solid var(--studio-border-subtle, rgba(255,255,255,0.06))",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 8, color: "var(--studio-text-dimmed)", textTransform: "uppercase", width: 48, textAlign: "right" }}>
          2× preview
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <padding.all style={{ width: 30, height: 30 }} />
            <span style={{ fontSize: 8, color: "var(--studio-text-dimmed)" }}>pad</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <margin.all style={{ width: 30, height: 30 }} />
            <span style={{ fontSize: 8, color: "var(--studio-text-dimmed)" }}>margin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IconExplorations() {
  return (
    <div
      style={{
        padding: 20,
        background: "var(--studio-bg, #0a0a0a)",
        color: "var(--studio-text, #e8e8e8)",
        fontFamily: "system-ui, sans-serif",
        maxWidth: 500,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
        Padding & Margin Icon Explorations
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--studio-text-dimmed, #666)",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Three approaches — pick one or mix. Each has "all" + per-side variants.
        Padding = inside spacing, Margin = outside spacing.
        Solid strokes for padding, dashed for margin (in A & B).
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {OPTIONS.map((opt) => (
          <OptionGroup key={opt.name} {...opt} />
        ))}
      </div>
    </div>
  );
}
