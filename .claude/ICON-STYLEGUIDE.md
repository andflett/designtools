# Icon Style Guide

Rules for all custom SVG icons across the project.

## Reference Standard

**Radix Icons** — the gold standard for crisp, small-viewport icons.
Key techniques: precise coordinate placement on a 15×15 grid, clean geometry,
fill-rule: evenodd for complex shapes, pixel-boundary alignment.

## Grid & ViewBox

- ViewBox: `0 0 15 15` (matches Radix Icons)
- Design on whole/half-pixel boundaries for crispness at 1× rendering

## Stroke Rules

| Property | Value | Rationale |
|----------|-------|-----------|
| `stroke-width` | `1` | Thin, crisp lines — never filled blocks |
| `stroke-linecap` | `butt` (SVG default) | No round caps — sharper endpoints |
| `stroke-linejoin` | `miter` (SVG default) | No round joins — sharper corners |
| `fill` | `none` | Stroke-only icons; use `currentColor` for stroke |

Do **not** set `strokeLinecap` or `strokeLinejoin` — SVG defaults to butt/miter.

## Shape Rules

- **Rounded corners** on rectangles: `rx="1"` (1px radius, subtle)
- **Circles**: use `<circle>` element, not `<path>`
- **Minimum gap**: 2px between parallel strokes for legibility at small sizes

## Color

- Always `stroke="currentColor"` (inherits from parent)
- Never hardcode colors

## Padding / Margin Icon Conventions

Padding and margin icons must be visually related but clearly distinguishable:
- Both use a centered content rectangle as the "element"
- **Padding** = spacing inside the element boundary (between border and content)
- **Margin** = spacing outside the element boundary (between border and surroundings)
- Per-side variants highlight only the relevant side's spacing
- "All" variants show uniform spacing on every side

## File Organization

- Custom icon components: `packages/surface/src/client/components/controls/spacing-icons.tsx`
- Exploration gallery: `packages/surface/src/client/components/controls/icon-explorations.tsx`
