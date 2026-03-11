/**
 * spacing-icons.tsx
 *
 * Custom SVG icons for padding and margin properties.
 * Three exploration options (A, B, C) — each with "all" + per-side variants.
 *
 * Style rules (see .claude/ICON-STYLEGUIDE.md):
 *   - 15×15 viewBox, 1px strokes, butt linecap, miter linejoin
 *   - rx=1 for rounded rect corners
 *   - stroke="currentColor", fill="none"
 */

// ─── Shared constants ────────────────────────────────────────────────
const V = "0 0 15 15"; // viewBox
const S: React.SVGAttributes<SVGElement> = {
  stroke: "currentColor",
  fill: "none",
  strokeWidth: 1,
};
// Dashed stroke for margin (or hatching differentiation)
const DASH: React.SVGAttributes<SVGElement> = {
  ...S,
  strokeDasharray: "2 2",
};

type IconProps = { style?: React.CSSProperties };

// ─────────────────────────────────────────────────────────────────────
// OPTION A: "Nested Boxes"
//
// Padding: solid outer box + solid inner content box, spacing between = padding
// Margin:  dashed outer box + solid inner box, spacing between = margin
//
// Per-side: only the relevant side's spacing gap is shown
// ─────────────────────────────────────────────────────────────────────

// --- Padding A ---

export function PaddingAllA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Outer border */}
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      {/* Inner content */}
      <rect x="4.5" y="4.5" width="6" height="6" rx="1" {...S} />
    </svg>
  );
}

export function PaddingTopA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      {/* Content box pushed down — top padding visible */}
      <rect x="4.5" y="5.5" width="6" height="5" rx="1" {...S} />
      {/* Indicator line for top padding region */}
      <line x1="7.5" y1="2.5" x2="7.5" y2="4.5" {...S} />
    </svg>
  );
}

export function PaddingRightA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="4.5" y="4.5" width="5" height="6" rx="1" {...S} />
      <line x1="10.5" y1="7.5" x2="12.5" y2="7.5" {...S} />
    </svg>
  );
}

export function PaddingBottomA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="4.5" y="4.5" width="6" height="5" rx="1" {...S} />
      <line x1="7.5" y1="10.5" x2="7.5" y2="12.5" {...S} />
    </svg>
  );
}

export function PaddingLeftA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="5.5" y="4.5" width="5" height="6" rx="1" {...S} />
      <line x1="2.5" y1="7.5" x2="4.5" y2="7.5" {...S} />
    </svg>
  );
}

// --- Margin A ---

export function MarginAllA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Outer margin boundary (dashed) */}
      <rect x="0.5" y="0.5" width="14" height="14" rx="1" {...DASH} />
      {/* Element box (solid) */}
      <rect x="3.5" y="3.5" width="8" height="8" rx="1" {...S} />
    </svg>
  );
}

export function MarginTopA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...DASH} />
      <rect x="3.5" y="5.5" width="8" height="7" rx="1" {...S} />
      <line x1="7.5" y1="2.5" x2="7.5" y2="4.5" {...DASH} />
    </svg>
  );
}

export function MarginRightA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...DASH} />
      <rect x="3.5" y="3.5" width="7" height="8" rx="1" {...S} />
      <line x1="11.5" y1="7.5" x2="12.5" y2="7.5" {...DASH} />
    </svg>
  );
}

export function MarginBottomA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...DASH} />
      <rect x="3.5" y="3.5" width="8" height="7" rx="1" {...S} />
      <line x1="7.5" y1="11.5" x2="7.5" y2="12.5" {...DASH} />
    </svg>
  );
}

export function MarginLeftA({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...DASH} />
      <rect x="5.5" y="3.5" width="7" height="8" rx="1" {...S} />
      <line x1="2.5" y1="7.5" x2="4.5" y2="7.5" {...DASH} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
// OPTION B: "Bracket Lines"
//
// Inspired by the reference image (second image): lines/brackets extending
// from a central element to show spacing direction.
//
// Padding: bracket lines INSIDE the box
// Margin:  bracket lines OUTSIDE the box
//
// Per-side: only the relevant side's bracket is drawn
// ─────────────────────────────────────────────────────────────────────

// --- Padding B ---

export function PaddingAllB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Outer element box */}
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      {/* Inner spacing indicators — lines inset from each edge */}
      <line x1="4" y1="1.5" x2="4" y2="13.5" {...S} opacity="0.4" />
      <line x1="11" y1="1.5" x2="11" y2="13.5" {...S} opacity="0.4" />
      <line x1="1.5" y1="4" x2="13.5" y2="4" {...S} opacity="0.4" />
      <line x1="1.5" y1="11" x2="13.5" y2="11" {...S} opacity="0.4" />
      {/* Content area */}
      <rect x="4.5" y="4.5" width="6" height="6" rx="1" {...S} />
    </svg>
  );
}

export function PaddingTopB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="2.5" y="1.5" width="10" height="12" rx="1" {...S} />
      {/* Top padding bracket: horizontal line + vertical ticks */}
      <line x1="4.5" y1="4" x2="10.5" y2="4" {...S} />
      <line x1="7.5" y1="1.5" x2="7.5" y2="4" {...S} />
    </svg>
  );
}

export function PaddingRightB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="2.5" width="12" height="10" rx="1" {...S} />
      <line x1="11" y1="4.5" x2="11" y2="10.5" {...S} />
      <line x1="11" y1="7.5" x2="13.5" y2="7.5" {...S} />
    </svg>
  );
}

export function PaddingBottomB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="2.5" y="1.5" width="10" height="12" rx="1" {...S} />
      <line x1="4.5" y1="11" x2="10.5" y2="11" {...S} />
      <line x1="7.5" y1="11" x2="7.5" y2="13.5" {...S} />
    </svg>
  );
}

export function PaddingLeftB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="2.5" width="12" height="10" rx="1" {...S} />
      <line x1="4" y1="4.5" x2="4" y2="10.5" {...S} />
      <line x1="1.5" y1="7.5" x2="4" y2="7.5" {...S} />
    </svg>
  );
}

// --- Margin B ---

export function MarginAllB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Element box */}
      <rect x="3.5" y="3.5" width="8" height="8" rx="1" {...S} />
      {/* Margin indicators — lines extending outward from each edge */}
      <line x1="4" y1="3.5" x2="4" y2="0.5" {...S} strokeDasharray="2 2" />
      <line x1="11" y1="3.5" x2="11" y2="0.5" {...S} strokeDasharray="2 2" />
      <line x1="4" y1="11.5" x2="4" y2="14.5" {...S} strokeDasharray="2 2" />
      <line x1="11" y1="11.5" x2="11" y2="14.5" {...S} strokeDasharray="2 2" />
      <line x1="3.5" y1="4" x2="0.5" y2="4" {...S} strokeDasharray="2 2" />
      <line x1="3.5" y1="11" x2="0.5" y2="11" {...S} strokeDasharray="2 2" />
      <line x1="11.5" y1="4" x2="14.5" y2="4" {...S} strokeDasharray="2 2" />
      <line x1="11.5" y1="11" x2="14.5" y2="11" {...S} strokeDasharray="2 2" />
    </svg>
  );
}

export function MarginTopB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="2.5" y="5.5" width="10" height="8" rx="1" {...S} />
      {/* Top margin: dashed lines extending upward */}
      <line x1="7.5" y1="5.5" x2="7.5" y2="1.5" {...DASH} />
      <line x1="4.5" y1="1.5" x2="10.5" y2="1.5" {...DASH} />
    </svg>
  );
}

export function MarginRightB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="2.5" width="8" height="10" rx="1" {...S} />
      <line x1="9.5" y1="7.5" x2="13.5" y2="7.5" {...DASH} />
      <line x1="13.5" y1="4.5" x2="13.5" y2="10.5" {...DASH} />
    </svg>
  );
}

export function MarginBottomB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="2.5" y="1.5" width="10" height="8" rx="1" {...S} />
      <line x1="7.5" y1="9.5" x2="7.5" y2="13.5" {...DASH} />
      <line x1="4.5" y1="13.5" x2="10.5" y2="13.5" {...DASH} />
    </svg>
  );
}

export function MarginLeftB({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="5.5" y="2.5" width="8" height="10" rx="1" {...S} />
      <line x1="5.5" y1="7.5" x2="1.5" y2="7.5" {...DASH} />
      <line x1="1.5" y1="4.5" x2="1.5" y2="10.5" {...DASH} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
// OPTION C: "Hatched Regions"
//
// Inspired by DevTools box model: the spacing region itself is indicated
// with hatching (diagonal lines) or a fill pattern.
//
// Padding: hatched area between outer box and inner content box
// Margin:  hatched area outside the element box
//
// For simplicity at 15px, we use semi-transparent filled rects
// rather than actual SVG patterns (which get muddy at small sizes).
// ─────────────────────────────────────────────────────────────────────

// --- Padding C ---

export function PaddingAllC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Padding region (semi-transparent fill) */}
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" fill="currentColor" opacity="0.12" {...S} />
      {/* Content cutout (solid stroke, filled with background) */}
      <rect x="4.5" y="4.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="var(--studio-surface, #0d0d0d)" />
    </svg>
  );
}

export function PaddingTopC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      {/* Top padding region */}
      <rect x="2" y="2" width="11" height="3" fill="currentColor" opacity="0.15" />
      <rect x="4.5" y="5.5" width="6" height="5" rx="1" {...S} />
    </svg>
  );
}

export function PaddingRightC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="10" y="2" width="3" height="11" fill="currentColor" opacity="0.15" />
      <rect x="4.5" y="4.5" width="5" height="6" rx="1" {...S} />
    </svg>
  );
}

export function PaddingBottomC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="2" y="10" width="11" height="3" fill="currentColor" opacity="0.15" />
      <rect x="4.5" y="4.5" width="6" height="5" rx="1" {...S} />
    </svg>
  );
}

export function PaddingLeftC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1.5" y="1.5" width="12" height="12" rx="1" {...S} />
      <rect x="2" y="2" width="3" height="11" fill="currentColor" opacity="0.15" />
      <rect x="5.5" y="4.5" width="5" height="6" rx="1" {...S} />
    </svg>
  );
}

// --- Margin C ---

export function MarginAllC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Full margin region */}
      <rect x="0.5" y="0.5" width="14" height="14" rx="1" fill="currentColor" opacity="0.1" stroke="none" />
      {/* Element box (punches through margin region) */}
      <rect x="3.5" y="3.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1" fill="var(--studio-surface, #0d0d0d)" />
    </svg>
  );
}

export function MarginTopC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      {/* Top margin region */}
      <rect x="1" y="0.5" width="13" height="4" fill="currentColor" opacity="0.12" stroke="none" />
      <rect x="2.5" y="4.5" width="10" height="9" rx="1" {...S} />
    </svg>
  );
}

export function MarginRightC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="10.5" y="1" width="4" height="13" fill="currentColor" opacity="0.12" stroke="none" />
      <rect x="1.5" y="2.5" width="9" height="10" rx="1" {...S} />
    </svg>
  );
}

export function MarginBottomC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="1" y="10.5" width="13" height="4" fill="currentColor" opacity="0.12" stroke="none" />
      <rect x="2.5" y="1.5" width="10" height="9" rx="1" {...S} />
    </svg>
  );
}

export function MarginLeftC({ style }: IconProps) {
  return (
    <svg width="15" height="15" viewBox={V} style={style}>
      <rect x="0.5" y="1" width="4" height="13" fill="currentColor" opacity="0.12" stroke="none" />
      <rect x="4.5" y="2.5" width="9" height="10" rx="1" {...S} />
    </svg>
  );
}
