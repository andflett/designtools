# CSS Layout Icons — Technical Guide

Rules, patterns, and hard-won lessons for designing and maintaining the 15x15 SVG icons used in the CSS layout property picker.

## Core principle: multi-path, no strokes

Icons use a **multi-path** approach: outlined shapes are `<path>` elements with `fill-rule="evenodd"`, and dot indicators are `<circle>` elements. All elements use `fill="currentColor"`. There are **zero strokes** anywhere. This eliminates sub-pixel gaps caused by stroke-centre maths and ensures every edge lands on an exact pixel boundary.

Outlined shapes (like a box border) are achieved by drawing two nested rect sub-paths -- an outer clockwise rect and an inner counter-clockwise rect. The evenodd rule fills the ring between them and punches out the interior.

## ViewBox and coordinate grid

- **ViewBox**: `0 0 15 15` (always)
- **All coordinates are integers** in the range 0-15
- Never use fractional values (no 0.5, 2.25, 10.75, etc.)
- The usable content area is columns/rows 1-14 (leaving a 1px quiet zone at each edge)
- Centre of canvas: column 7 (for odd-width elements) or columns 7-8 (for even-width)

### Why integers only

SVG filled rects at integer coordinates produce edges on exact pixel boundaries. This means:
- No anti-aliasing fuzz
- No sub-pixel gaps between adjacent shapes
- Consistent rendering at any scale

## File structure

Icons are split across focused files by logical group. `default-icons.ts` is a barrel file that imports and spreads all sub-files:

| File | Contents |
|------|----------|
| `default-icons.ts` | Barrel file. Imports all sub-files, exports merged `DEFAULT_ICONS` map. |
| `display-icons.ts` | display |
| `flex-icons.ts` | flex-direction, flex-wrap, flex-grow/shrink, gap |
| `alignment-icons.ts` | justify-content, align-items, align-self, align-content |
| `position-icons.ts` | position |
| `overflow-icons.ts` | overflow |
| `text-icons.ts` | text-align, typography, text-decoration, text-transform |
| `border-icons.ts` | border-width, border-radius, border-style |
| `spacing-icons.ts` | padding, margin, gap, size |
| `visual-icons.ts` | opacity, box-shadow |

When adding a new property group, create a dedicated file and spread it into `DEFAULT_ICONS`.

## Path-builder primitives

These functions compose SVG path `d` strings:

| Function | Purpose | Example |
|----------|---------|---------|
| `R(x, y, w, h)` | Filled rect sub-path (clockwise) | `R(1, 1, 13, 13)` |
| `C(x, y, w, h)` | Cutout rect sub-path (counter-clockwise) | For evenodd holes |
| `O(x, y, w, h, t?)` | Outlined rect (R + C, border thickness `t`, default 1) | `O(1, 1, 13, 13)` |
| `HL(x, y, len)` | Horizontal line (1px tall filled rect) | `HL(1, 7, 13)` |
| `VL(x, y, len)` | Vertical line (1px wide filled rect) | `VL(7, 1, 13)` |

These return **strings**, not SVG elements. They are composed into a single path via `ef()`.

### Circle dot helper

Dots use `<circle>` elements, not path sub-paths. The `cd()` helper creates a circle that fits a 1×1 bounding box on the integer grid:

```ts
/** 1×1 circle dot. Grid coord (x,y) → centre at (x+0.5, y+0.5). */
function cd(x: number, y: number): SvgPathData {
  return {
    id: nid(), type: "circle",
    cx: x + 0.5, cy: y + 0.5, r: 0.5,
    fill: "currentColor", stroke: "none", strokeWidth: 0,
  };
}
```

Circles are passed as separate elements to `icon()`, not concatenated into path strings:

```ts
// Outlined rect + circle dots
const myIcon = icon(ef(O(1, 1, 13, 13)), cd(3, 7), cd(5, 7), cd(7, 7));
```

## Element composers

| Function | Purpose |
|----------|---------|
| `ef(...parts)` | Primary evenodd path (`fill="currentColor"`) |
| `sef(...parts)` | Secondary/duotone evenodd path (`fill=SEC`, `opacity=0.2`) |
| `sfr(x, y, w, h, opacity?)` | Secondary filled rect (simple, no evenodd) |

## Design rules

### 1. Visual weight: keep it light

At 15x15, every pixel matters. The icons must feel light and open, not heavy or claustrophobic.

**All lines and borders are 1px thick.** This is non-negotiable. `O()` defaults to `t=1` — never increase it unless there is a specific, justified reason.

- **1px outlined boxes** for containers, elements, content blocks
- **1×1 circle dots** (`cd()`) for indicators — never larger
- **1px lines** (`HL()`, `VL()`) for rules and axes

A 2px border on a 13px-wide box consumes 30% of the available width and looks chunky. At icon scale, 1px lines read clearly and leave room for the actual content of the icon.

### 2. Dot rings, not dot grids

When dots indicate a spatial zone (padding inside a box, margin outside a box), they should trace the **perimeter** of that zone as a rectangular ring — not fill it as a solid grid.

```
GOOD: ring of dots tracing edges     BAD: filled grid of dots
·  ·  ·  ·  ·                         ·  ·  ·  ·  ·
·           ·                         ·  ·  ·  ·  ·
·           ·                         ·  ·  ·  ·  ·
·           ·                         ·  ·  ·  ·  ·
·  ·  ·  ·  ·                         ·  ·  ·  ·  ·
```

A ring reads as "boundary" or "zone edge". A filled grid reads as "texture" or "fill" — wrong semantic for spacing indicators.

### 3. Study the reference, then count pixels

**The single biggest source of errors is not carefully mapping a reference image onto the 15x15 grid.** Before writing any coordinates:

1. Identify each distinct visual element in the reference (box, dots, arrows, etc.)
2. Count its approximate pixel proportions relative to the total icon size
3. Map those proportions onto the 0-14 coordinate range
4. Write out the coordinates on paper/in a comment BEFORE coding
5. Cross-check: does the box take up roughly the same fraction of the viewBox as in the reference?

Common failure modes:
- **Inventing coordinates from memory** instead of analysing the reference
- **Reusing coordinates from previous/deleted icons** that had different proportions
- **Assuming a visual element's structure** (e.g. "dots inside = 3x3 grid") without checking
- **Getting border thickness wrong** because you didn't zoom into the reference

### 4. Outlined over filled

Prefer `O()` (outlined rects) to `R()` (solid fills) for containers and content blocks. Solid fills should be used only for:
- Thin lines (`HL()`, `VL()`)
- Filled triangles in arrows
- Items in layout demonstrations (flex items, grid cells) where the fill represents a content block

Dot indicators always use `cd()` circles, not filled rects.

### 5. Consistent spatial zones — the cardinal rule

**Icons within a property group MUST share the exact same base geometry.** Only the indicator (dots, arrows, highlights) changes between variants. This is the single most important rule.

What this means in practice:

- Define a `BASE` constant that contains all shared geometry (container + content)
- Define directional indicator groups (`TOP`, `RIGHT`, `BOTTOM`, `LEFT`)
- Compose variants by concatenating: `BASE + TOP`, `BASE + LEFT + RIGHT`, etc.

```ts
// GOOD: shared base, only dots change
const BOX = ef(O(1, 1, 13, 13));
const TOP = [cd(5, 4), cd(7, 4), cd(9, 4)];
const icon_top    = icon(BOX, ...TOP);
const icon_bottom = icon(BOX, ...BOTTOM);
const icon_all    = icon(BOX, ...TOP, ...BOTTOM, ...LEFT, ...RIGHT);
```

```ts
// BAD: container/content shift position between variants
const pad_top    = icon(ef(O(1, 1, 13, 13), O(2, 4, 11, 9)));   // content pushed down
const pad_bottom = icon(ef(O(1, 1, 13, 13), O(2, 2, 11, 9)));   // content pushed up
```

**Why this matters**: when icons appear side-by-side in a property picker, shifting geometry between variants is visually jarring.

### 6. Arrow construction

Arrows are built from filled geometry (no strokes):
- Shaft: a 1px rect (`HL` or `VL`)
- Head: a filled triangle using three-point path (`M6 3L8 1L9 3Z`)

### 7. Dot indicators

Use `cd(x, y)` for 1×1 circle dots. Space dots at **2px intervals** on integer coordinates for even distribution:

```ts
// 3 dots spaced 2px apart along a row
cd(5, 4), cd(7, 4), cd(9, 4)
```

Circle dots are separate `SvgPathData` elements (type `"circle"`), not path sub-paths. This means duplicate dots in composed variants (e.g. corner dots shared by TOP and RIGHT) harmlessly overdraw rather than cancelling under evenodd. Define directional dot arrays and spread them freely:

```ts
const TOP   = [cd(4, 4), cd(7, 4), cd(10, 4)];
const RIGHT = [cd(10, 4), cd(10, 7), cd(10, 10)];
// (10, 4) appears in both — no problem, it just draws twice
const icon_top_right = icon(BOX, ...TOP, ...RIGHT);
```

### 8. Duotone elements

Context/ghost elements use `sef()` or `sfr()` which render with `var(--icon-secondary, currentColor)` at low opacity. This provides a two-tone effect without requiring a second colour by default.

## Multi-path architecture

Icons use a multi-path approach: structural shapes (outlined boxes, lines) are `<path>` elements built with `ef()`, and dot indicators are `<circle>` elements built with `cd()`.

```ts
const myIcon = icon(
  ef(O(1, 1, 13, 13)),   // outlined box (path, needs evenodd for cutout)
  cd(5, 7),               // circle dot
  cd(7, 7),
  cd(9, 7),
);
```

**Why multi-path over single-path**: circle dots are separate elements, so duplicate dots in composed variants (shared corners between TOP and RIGHT arrays) harmlessly overdraw. In a single-path approach, duplicate sub-paths cancel under evenodd, preventing naive composition of directional constants.

For duotone effects, mix `ef()` (primary) and `sef()` (secondary) paths in the same icon.

## Winding direction matters

This is the most common source of rendering bugs. SVG `fill-rule="evenodd"` counts path crossings to decide what is filled vs hollow:

- **Outer shape**: must wind **clockwise** (CW) -- `M x y h w v h h -w z`
- **Inner cutout**: must wind **counter-clockwise** (CCW) -- `M x y v h h w v -h z`

If both wind the same direction, evenodd will still create a visual hole, but it can produce unexpected results with nested shapes. The `O()` helpers handle this automatically.

When writing raw path strings for complex shapes (arrows, letterforms), keep sub-paths simple and avoid self-intersecting paths. Evenodd + self-intersection = unpredictable fills.

## SVG gotchas for AI-generated paths

These are specific failure modes to watch for:

### 1. Coordinates are positions, not sizes (for M/L commands)

`M5 4` means "move to x=5, y=4". `h3` means "draw 3 units right". Do not confuse absolute coords (M, L) with relative deltas (h, v). The helpers use a mix: `M` for absolute positioning, then `h`/`v` for relative drawing.

### 2. Compound paths share a single `d` attribute

Multiple shapes in one `<path>` are just concatenated sub-paths in the `d` string. Each sub-path starts with `M` and ends with `z`. They do not need separators -- `z` closes the current sub-path and `M` starts a new one.

```ts
// This is ONE path element with THREE sub-paths
ef(R(1,1,3,3) + R(6,1,3,3) + R(11,1,3,3))
```

### 3. Use circles for dots, not rects

Dot indicators use `cd()` which creates `<circle>` elements with `r=0.5` centred at half-pixel coordinates. At 15×15, the slight softness of circle anti-aliasing is a feature — it gives dots a rounder, more polished appearance compared to square rects.

### 4. Do not use strokes, ever

Strokes are rendered centred on the path. A 1px stroke on an integer coordinate produces 0.5px on each side, which anti-aliases. Instead, draw a 1px filled rect to get an equivalent "stroke" with crisp edges.

### 5. Test with the design board

The `icon-design-board` component renders icons at multiple sizes. Always verify new icons there -- problems that are invisible at 15x15 become obvious at 60x60 or 120x120.

## Packaging as an npm library

Notes for shipping these icons as a standalone package. Reference points: Lucide (stroke-based, 24x24) and Radix Icons (fill-based, 15x15 -- same grid as ours).

### Distribution format

Both Lucide and Radix ship:
- **ESM + CJS** dual builds (`module` and `main` in package.json)
- **`"sideEffects": false`** so bundlers can tree-shake unused icons
- **TypeScript declarations** alongside compiled output
- Each icon as a **named export** from a barrel index, plus per-icon entry points for deep imports

Our icons are currently data (`Record<string, SlotIconData>`), not components. For a package we would need:
1. A **data-only export** (the current `DEFAULT_ICONS` map) for consumers who render their own SVG
2. A **React component export** per icon, wrapping each in a `forwardRef` SVG component (the Radix pattern)
3. Optionally, raw `.svg` files for non-JS consumers

### React component wrapper pattern

Radix's pattern (and what we should follow):

```tsx
import { forwardRef } from "react";

interface IconProps extends React.SVGAttributes<SVGElement> {
  children?: never;    // icons have no children
  color?: string;
}

const PaddingAllIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill={color}
      {...props}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="..." />
    </svg>
  ),
);
PaddingAllIcon.displayName = "PaddingAllIcon";
```

Key points:
- **`forwardRef`** so consumers can attach refs to the underlying `<svg>`
- **`children?: never`** prevents misuse
- **`color` prop** defaults to `currentColor`, maps to `fill`
- **Spread `...props`** after our defaults so consumers can override `width`, `height`, `className`, `aria-label`, etc.
- **`displayName`** for React DevTools

### Accessibility

SVG icons are **decorative by default** -- they sit next to text labels and convey no independent meaning. The standard pattern:

- **Decorative** (default): add `aria-hidden="true"` to the `<svg>`. The consumer adds this, or we add it as a default that can be overridden.
- **Standalone** (no adjacent text): consumer passes `aria-label="Description"` and optionally `role="img"`.

Neither Lucide nor Radix bake in `aria-hidden` by default -- they let the spread props handle it. We should do the same: no opinion on accessibility attributes, let the consumer decide. Document the two patterns in the README.

### Sizing and optical alignment

- Our icons are 15x15, same as Radix. Lucide is 24x24. Both are fine.
- **Default `width` and `height`** should match the viewBox (15). Consumers resize via CSS or by passing `width`/`height` props.
- **Optical weight**: icons in a set should have roughly equal visual density. A thin outline icon next to a heavy filled icon looks wrong. Our outlined-container + dot-indicator style is naturally consistent, but watch for outliers (e.g. `display::none` with its heavy X vs lighter icons).

### Rendering across environments

#### Why our approach (filled paths, integer coords) is already robust

Most SVG rendering issues come from strokes and fractional coordinates. Our filled-path, integer-coordinate approach sidesteps the worst of these:

- **No stroke-centre maths**: strokes render 0.5px either side of the path, which anti-aliases on integer coords. We have zero strokes.
- **No sub-pixel boundaries**: all edges land on exact pixel boundaries at 1:1 scale. At other scales, the browser's rasteriser handles scaling uniformly.
- **No hairline gaps**: compound paths with shared edges can produce 1-device-pixel gaps in some renderers. We avoid this by using single compound paths (`ef()` concatenates sub-paths into one `d` string).

#### `shape-rendering` property

SVG's `shape-rendering` attribute hints at the rendering engine:

| Value | Effect | Use case |
|-------|--------|----------|
| `auto` (default) | Browser chooses, usually anti-aliased | Fine for us |
| `crispEdges` | Disables anti-aliasing, snaps to device pixels | Could make integer-coord icons even sharper at 1:1, but can look jagged at non-integer scales |
| `geometricPrecision` | Prioritises shape accuracy over pixel-snapping | Best for curves and diagonal lines |
| `optimizeSpeed` | Fastest, lowest quality | Not useful |

**Recommendation**: do NOT set `shape-rendering` in the shipped icons. Our integer-coordinate approach already gets crisp edges with `auto`. Setting `crispEdges` would help at exactly 15px but could make scaled icons (which is most real usage) look worse. Let consumers opt in via CSS if they need it.

#### HiDPI / Retina displays

On 2x/3x displays, the browser renders at the higher device pixel ratio. Our integer coordinates map to 2x2 or 3x3 device-pixel blocks, which remain perfectly crisp. No special handling needed.

The only risk is icons rendered at **non-integer CSS sizes** (e.g. `width: 14px` for a 15-unit viewBox). This forces the browser to anti-alias because the grid doesn't map cleanly to device pixels. Document that consumers should use sizes that are multiples of 15 (15, 30, 45, 60) for maximum crispness, though any size will look fine in practice.

#### Browser differences

Browsers differ slightly in:
- **Anti-aliasing algorithms**: Chromium and Firefox handle sub-pixel rendering differently, but this only matters for strokes and fractional coords (which we avoid)
- **Evenodd edge cases**: all modern browsers handle evenodd correctly for simple non-self-intersecting paths. Our paths are simple.
- **CSS `transform` rendering**: rotating or skewing SVG icons introduces anti-aliasing regardless of coord precision. Not much we can do about this, and consumers rarely rotate property icons.

No browser-specific workarounds are needed for our icon style.

#### Dark mode

Our icons use `fill="currentColor"` and `fill="var(--icon-secondary, currentColor)"`, so they automatically adapt to any text colour. No dark-mode-specific handling needed in the icons themselves.

### Naming convention for package exports

Follow Radix's pattern: PascalCase component name = property + variant + "Icon":
- `padding::all` -> `PaddingAllIcon`
- `flex-direction::row-reverse` -> `FlexDirectionRowReverseIcon`
- `display::inline-block` -> `DisplayInlineBlockIcon`

The key mapping (`"padding::all"`) stays as the data-layer identifier. The PascalCase name is only for the React component export.

### What to include in the package

```
package/
  dist/
    esm/          # ES modules (tree-shakeable)
    cjs/          # CommonJS
    index.d.ts    # TypeScript declarations
  icons/          # Raw .svg files (optional, for non-JS consumers)
  package.json
  README.md
```

`package.json` essentials:
```json
{
  "sideEffects": false,
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/esm/index.js", "require": "./dist/cjs/index.js" },
    "./*": { "import": "./dist/esm/*.js", "require": "./dist/cjs/*.js" }
  },
  "peerDependencies": { "react": ">=16.8" }
}
```

### Checklist before publishing

- [ ] Every icon renders identically at 15px, 30px, and 60px (use the design board)
- [ ] Every icon uses `fill="currentColor"` (no hardcoded colours)
- [ ] Every icon group has consistent base geometry (the cardinal rule)
- [ ] `sideEffects: false` in package.json
- [ ] Dual ESM/CJS build
- [ ] TypeScript declarations included
- [ ] `forwardRef` on every React component
- [ ] README documents: accessibility patterns, sizing recommendations, dark mode behaviour
- [ ] No `shape-rendering` attribute set (let consumers choose)

## Common mistakes to avoid

1. **Using fractional coordinates** -- causes anti-aliasing. Always integer.
2. **Using stroke-based shapes** -- causes stroke-centre offset maths. Always filled paths.
3. **Border thickness > 1px** -- makes icons look heavy and claustrophobic at 15x15. Always use 1px borders unless there is a specific reason.
4. **Dot grids instead of dot rings** -- dots indicating a spatial zone should trace the perimeter, not fill the area.
5. **Not analysing the reference image** -- the #1 source of errors. Count pixels, map proportions, write coordinates in a comment before coding.
6. **Reusing coordinates from old/deleted icons** -- each icon should be designed from the reference, not adapted from previous attempts.
7. **Multiple separate elements that share an edge** -- can create gaps. Use a single compound path instead.
8. **Inconsistent container sizes within a group** -- breaks visual coherence between variants. Use a shared `BASE` constant.
9. **Square rects for dots** -- use `cd()` circles instead. They look rounder and more polished.
10. **Shifting content position to "show" spacing** -- the container and content must stay fixed; only dots/arrows/indicators move.
11. **Wrong winding direction** -- outer CW, inner CCW, always. The helpers handle this but raw paths need care.
12. **Forgetting `z` to close sub-paths** -- an unclosed sub-path before another `M` will produce a connecting line in some renderers.