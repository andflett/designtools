# Plan: Page Explorer & Component Isolation

Two new features for codesurface. Core rule: no custom parsers, regex, or hacks — use robust, industry-standard libraries and APIs.

---

## Feature 1: Component Tree Explorer

### What it does

A left-hand panel showing a **component-level hierarchy** of the current page. Not a raw DOM tree — a filtered view showing named React components and semantic HTML landmarks. Designers see "HeroSection > Card > Button", not `<div> <div> <div>`.

Clicking a node selects it (same as visual click-to-select). Hovering highlights it in the viewport. The tree updates live on navigation and HMR.

### Why not a DOM tree?

A full DOM tree is noise for designers — hundreds of anonymous `<div>`s and `<span>`s. The tree should reflect the **component vocabulary** they work with: design system components (Button, Card) and page-level compositions (HeroSection, Sidebar).

### Architecture: framework plugin extracts, editor renders

The editor stays framework-agnostic. All React-specific tree extraction happens in `@designtools/next-plugin` (where React code already lives). The editor receives a clean typed tree over postMessage.

```
next-plugin/codesurface.tsx          shared/protocol.ts          codesurface/client/
(React-specific)                     (framework-agnostic)        (framework-agnostic)

┌──────────────────────┐             ┌───────────────────┐       ┌──────────────────┐
│ Walk React fiber tree│────────────>│ ComponentTreeNode[]│──────>│ PageExplorer     │
│ Filter to components │  postMessage│                   │       │ component        │
│ Map to protocol type │             │ id, name, type,   │       │ renders any tree │
└──────────────────────┘             │ dataSlot, source, │       └──────────────────┘
                                     │ textContent,      │
A future Vue plugin would            │ children          │
populate the same shape              └───────────────────┘
using Vue's own internals.
```

### How the tree is extracted (in next-plugin)

**API: React Fiber internals** — React attaches fiber nodes to every DOM element in dev mode via `__reactFiber$<randomKey>` properties. This is how React DevTools works. The prefix has been stable since React 17 through React 19. The `__REACT_DEVTOOLS_GLOBAL_HOOK__` integration point is confirmed not being removed (React team, GitHub issue #27112).

From any DOM element:
```typescript
const fiberKey = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
const fiber = el[fiberKey]; // fiber.type.name === "Button"
```

Walk the fiber tree from the root using `fiber.child` / `fiber.sibling` / `fiber.return` to build the component hierarchy.

**Filtering rules** (the key UX decision):

| Show | Why |
|------|-----|
| Components with `data-slot` | Design system components — always relevant |
| User-defined components (name starts uppercase, source is in project files via `data-source`) | Page composition — HeroSection, Sidebar, etc. |
| Semantic HTML landmarks: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>` | Structural context without noise |

| Hide | Why |
|------|-----|
| Anonymous/arrow components (no `displayName` or `name`) | Noise — HOCs, wrappers |
| Framework internals: providers, contexts, Suspense, ErrorBoundary, forwardRef | React plumbing, not design |
| All other native HTML elements (`<div>`, `<span>`, `<p>`, etc.) | The noise we're eliminating |
| Components from `node_modules` (no `data-source` attribute on rendered elements) | Library internals |

**Collapse rule**: If a component has a single child that is also a component, and the parent has no meaningful content of its own, collapse them into `Parent > Child` to reduce depth.

**Safety/fallback**: All fiber access isolated behind a single `getFiber(el): Fiber | null` utility. If fiber access fails (future React version changes the key), degrade to a **data-slot-only tree** — walks the DOM, only shows elements with `data-slot`. Less rich but still functional. One function to update if React changes the prefix.

### Protocol additions (`shared/protocol.ts`)

```typescript
export interface ComponentTreeNode {
  /** Stable identifier for selection/highlight (CSS selector path) */
  id: string;
  /** Display name: "Button", "HeroSection", "<header>" */
  name: string;
  /** Named component vs semantic HTML element */
  type: "component" | "element";
  /** data-slot value if present — marks design system components */
  dataSlot: string | null;
  /** data-source file:line:col if available */
  source: string | null;
  /** First ~40 chars of direct text content */
  textContent: string;
  /** Nested children */
  children: ComponentTreeNode[];
}

// New messages — Editor -> Target
| { type: "tool:requestComponentTree" }
| { type: "tool:highlightByTreeId"; id: string }
| { type: "tool:clearHighlight" }
| { type: "tool:selectByTreeId"; id: string }

// New messages — Target -> Editor
| { type: "tool:componentTree"; tree: ComponentTreeNode[] }
```

### When the tree is requested/refreshed

| Trigger | Mechanism |
|---------|-----------|
| Initial load | Editor sends `tool:requestComponentTree` after receiving `tool:injectedReady` |
| Route navigation | Editor sends `tool:requestComponentTree` after receiving `tool:pathChanged` |
| DOM changes (HMR, dynamic content) | `MutationObserver` in target app, debounced 300ms, auto-sends updated tree |

`MutationObserver` is a standard DOM API — no library needed. Debounce is an inline 5-line helper.

### Editor-side: `PageExplorer` component

**Location**: `packages/codesurface/src/client/components/page-explorer.tsx`

**No tree library needed.** After filtering, the tree is typically 15-50 nodes. A recursive React component with disclosure state is sufficient. HTML `<details>/<summary>` gives accessible expand/collapse for free, or `@radix-ui/react-collapsible` (already in the project's Radix ecosystem) if we want more control.

**Features:**
- Recursive tree rendering with indent guides
- Each node shows: component icon (filled for data-slot, outline for app components) + name + text preview
- `data-slot` components styled distinctly — they're the editable design system pieces
- Click → sends `tool:selectByTreeId`, element becomes selected in viewport + editor panel
- Hover → sends `tool:highlightByTreeId`, blue overlay appears in viewport
- Currently-selected element highlighted in tree (match by id)
- Search/filter input at top — filters by component name or text content
- Auto-expand path to selected element when selection happens via visual click
- Auto-scroll to keep selected node visible (`scrollIntoView`)

**Future (only if needed):** If tree grows beyond ~200 visible nodes, add `@tanstack/react-virtual` for virtualized rendering.

### Integration in `app.tsx`

The left panel gets a tab bar: **Elements** (tree explorer) | **Usages** (existing usage panel). Elements is open by default as the primary navigation tool. Usages shows when a data-slot component is selected.

```
┌─ Left Panel ──────────────┐
│ [Elements] [Usages]       │
├───────────────────────────┤
│ 🔍 Filter...              │
├───────────────────────────┤
│ ▼ Page                    │
│   ▼ Header                │
│     Logo                  │
│     ▼ Nav                 │
│       NavLink "Home"      │
│       NavLink "About"     │
│     ◆ Button "Sign In"    │
│   ▼ HeroSection           │
│     ◆ Badge "New"         │
│     ◆ Button "Get Started"│
│   ▼ ◆ Card                │
│     ▼ ◆ CardHeader        │
│       ◆ CardTitle "Featu… │
│     ▼ ◆ CardContent       │
│       ◆ Button "Learn Mo… │
│   <footer>                │
│     FooterNav             │
└───────────────────────────┘
  ◆ = data-slot (design system)
```

### Files to create/modify

| File | Action |
|------|--------|
| `packages/codesurface/src/shared/protocol.ts` | Add `ComponentTreeNode` type, new message types |
| `packages/next-plugin/src/codesurface.tsx` | Add fiber walking, tree extraction, MutationObserver, highlight/select-by-id handlers |
| `packages/codesurface/src/client/components/page-explorer.tsx` | **New** — tree UI component |
| `packages/codesurface/src/client/app.tsx` | Add tree state, request flow, left panel with tabs |

### New dependencies

**None.** Everything uses browser APIs (fiber access, MutationObserver, TreeWalker for fallback), React built-ins, and existing Radix packages.

---

## Feature 2: Component Isolation & Props Preview

### What it does

For any `data-slot` component, open an isolation view that renders it on a dedicated preview page showing different prop/variant combinations side by side. Auto-generated from CVA variant definitions we already scan. Like Storybook stories, but zero-config.

### Core constraint

Components must render **inside the target app's runtime** — they depend on its Tailwind config, providers, fonts, theme. We can't render them in the editor's Vite app.

### Approach: generated preview route in the target Next.js app

The `withDesigntools()` plugin already modifies the Next.js config (Webpack loader, component mounting). Extend it to inject a **preview route** that can render any component with arbitrary props.

### Step 1: Preview route generation (in next-plugin)

At dev startup, `withDesigntools()` writes a catch-all preview page into the app directory:

```
app/__designtools/preview/page.tsx    (generated, gitignored)
app/__designtools/preview/layout.tsx  (generated, minimal shell)
```

**Library: Next.js file-system routing.** No custom server, no Express route — just a generated page that Next.js picks up automatically.

The generated layout provides a minimal shell (no app chrome — just providers and styles):

```tsx
// Generated layout.tsx
export default function PreviewLayout({ children }) {
  return <div className="p-8 bg-background">{children}</div>;
}
```

The generated page is a client component that:
1. Listens for postMessage instructions from the editor
2. Dynamically imports the requested component
3. Renders a grid of variant combinations

```tsx
// Generated page.tsx (simplified)
"use client";
// Dynamic import map — generated from ComponentRegistry scan results
const components = {
  "button": () => import("@/components/ui/button").then(m => m.Button),
  "card": () => import("@/components/ui/card").then(m => m.Card),
  // ... auto-generated from scan-components
};
```

**Communication is via postMessage** (not query params) — avoids URL length limits, supports live updates, and matches the existing codesurface communication pattern.

### Step 2: Migrate scan-components from regex to AST

The current `scan-components.ts` uses regex to parse CVA definitions. Per the no-regex-parsers rule, migrate to **Babel AST parsing** using `recast` + `ast-types` + `babel-ts` parser — all already in codesurface's dependencies.

The AST approach:
1. Parse component file with existing `parseSource()` from `ast-helpers.ts`
2. Find `cva()` call expression in the AST
3. Extract base classes from the first argument (StringLiteral or TemplateLiteral)
4. Extract variant dimensions from the `variants` property of the config object
5. Extract default variants from `defaultVariants`

This handles edge cases regex misses: multi-line strings, template literals, nested expressions, comments.

### Step 3: Preview matrix generation

Add a function that generates the variant combinations to preview:

```typescript
interface PreviewMatrix {
  /** One variant dimension varied at a time (not full cartesian product) */
  combinations: {
    label: string;              // e.g. "variant: destructive"
    props: Record<string, string>;  // e.g. { variant: "destructive", size: "default" }
  }[];
}
```

**Strategy**: Vary one dimension at a time with others at defaults (not full cartesian product — that explodes combinatorially). A component with 4 variants x 3 sizes = 7 preview cells (4 + 3), not 12.

### Step 4: Protocol additions

```typescript
// Editor -> Target (preview page)
| { type: "tool:renderPreview"; dataSlot: string; importPath: string; exportName: string;
    combinations: { label: string; props: Record<string, string> }[];
    defaultChildren: string }
| { type: "tool:updatePreviewProps"; index: number; props: Record<string, string> }

// Target (preview page) -> Editor
| { type: "tool:previewReady"; cellCount: number }
| { type: "tool:previewCellClicked"; index: number; props: Record<string, string> }
```

### Step 5: Editor integration

**Trigger**: When a `data-slot` component is selected, the editor panel shows an **"Isolate"** button next to the component name.

Clicking it:
1. Fetches the component's preview info from `/scan/components/{dataSlot}`
2. Navigates the iframe to `/__designtools/preview`
3. Sends `tool:renderPreview` with variant combinations
4. Switches the editor toolbar to "isolation mode" — shows component name + a breadcrumb back to the original page

**Preview grid layout:**

```
┌──────────────────────────────────────────────────────┐
│  ← Back to /            Button — Isolation View      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  variant: default          variant: destructive      │
│  ┌──────────────┐          ┌──────────────┐          │
│  │   Button     │          │   Button     │          │
│  └──────────────┘          └──────────────┘          │
│                                                      │
│  variant: outline          variant: secondary        │
│  ┌──────────────┐          ┌──────────────┐          │
│  │   Button     │          │   Button     │          │
│  └──────────────┘          └──────────────┘          │
│                                                      │
│  size: sm                  size: lg                  │
│  ┌──────────────┐          ┌──────────────┐          │
│  │  Button      │          │    Button    │          │
│  └──────────────┘          └──────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**User controls** (in the right panel during isolation):
- Toggle dimensions on/off to filter the grid
- Click a specific cell to select that combination for style editing
- Edit children text (for components that accept children, like Button)

### Step 6: File generation lifecycle

| Event | Action |
|-------|--------|
| `withDesigntools()` config init | Write preview route files, add `app/__designtools` to `.gitignore` |
| Component registry changes (file watcher) | Regenerate the import map in the preview page |
| Dev server shutdown | Clean up generated files (optional — gitignored anyway) |

### Files to create/modify

| File | Action |
|------|--------|
| `packages/next-plugin/src/index.ts` | Generate preview route at dev startup, gitignore management |
| `packages/next-plugin/src/preview-template.ts` | **New** — template strings for generated page/layout |
| `packages/codesurface/src/shared/protocol.ts` | Add preview message types |
| `packages/codesurface/src/server/lib/scan-components.ts` | Migrate from regex to AST-based CVA parsing |
| `packages/codesurface/src/server/index.ts` | Add `/scan/components/:dataSlot` endpoint |
| `packages/codesurface/src/client/components/isolation-view.tsx` | **New** — isolation mode toolbar + controls |
| `packages/codesurface/src/client/components/editor-panel.tsx` | Add "Isolate" button for data-slot components |
| `packages/codesurface/src/client/app.tsx` | Add isolation mode state, iframe navigation |

### New dependencies

**None.** Uses Next.js file-system routing, existing recast/ast-types for AST parsing, Node `fs` for file generation, React `lazy()` + `import()` for dynamic components.

---

## Summary: dependencies

| Need | Solution | New dep? |
|------|----------|----------|
| Component tree extraction | React Fiber internals (`__reactFiber$`) | No |
| Fiber fallback | DOM walk + data-slot filtering | No |
| DOM change detection | `MutationObserver` (standard DOM API) | No |
| Tree UI expand/collapse | `<details>/<summary>` or `@radix-ui/react-collapsible` | No (Radix already used) |
| CVA parsing | `recast` + `ast-types` + `babel-ts` parser | No (already deps) |
| Component preview rendering | Next.js file-system routing + `React.lazy()` | No |
| Preview route generation | Node `fs` module | No |
| Virtualized tree (future, if needed) | `@tanstack/react-virtual` | Future only |

**Zero new dependencies for both features.**

---

## Implementation order

### Phase 1: Component Tree Explorer
1. Add `ComponentTreeNode` type and new messages to protocol
2. Implement fiber walking + tree extraction in `next-plugin/codesurface.tsx`
3. Implement data-slot-only fallback
4. Build `PageExplorer` component in editor
5. Integrate into `app.tsx` with left panel tabs
6. Add MutationObserver for live updates
7. Add highlight-on-hover and select-on-click

### Phase 2: Component Isolation
1. Migrate `scan-components.ts` from regex to AST
2. Add preview matrix generation
3. Implement preview route generation in `withDesigntools()`
4. Add preview protocol messages
5. Build `IsolationView` component in editor
6. Wire up isolation mode in `app.tsx`
7. Add variant controls in the right panel during isolation
