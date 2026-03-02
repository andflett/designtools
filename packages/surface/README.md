# @designtools/surface

A CLI-launched visual design layer for React applications. Select elements in your running app and edit styles, tokens, and component variants — changes write back to your source files.

## Requirements

- Node.js >= 18
- **Next.js** >= 14 (via `@designtools/next-plugin`)
- **Vite + React** (via `@designtools/vite-plugin`)
- **Astro** (via `@designtools/astro-plugin`)
- **Remix** (via `@designtools/vite-plugin` — Vite-based)
- **React** >= 18
- A supported styling system: **Tailwind CSS** v3/v4, **CSS Custom Properties**, **Plain CSS**, or **CSS Modules**

## Installation

```bash
npm install -D @designtools/next-plugin
```

## Setup

### 1. Wrap your Next.js config

```ts
// next.config.ts
import { withDesigntools } from "@designtools/next-plugin";

const nextConfig = {
  // your existing config
};

export default withDesigntools(nextConfig);
```

In development, this:

- Adds a Babel pass that injects `data-source="file:line:col"` attributes into every JSX element, mapping each element to its source location. These only exist in the compiled output — your source files are not modified.
- Auto-mounts the `<Surface />` selection overlay component into your root layout (`app/layout.tsx` or `src/app/layout.tsx`).

Neither is included in production builds.

### Vite + React (including Remix)

```bash
npm install -D @designtools/vite-plugin
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import designtools from "@designtools/vite-plugin";

export default defineConfig({
  plugins: [designtools(), react()],
});
```

The plugin must be listed **before** `@vitejs/plugin-react`.

### Astro

```bash
npm install -D @designtools/astro-plugin
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import designtools from "@designtools/astro-plugin";

export default defineConfig({
  integrations: [react(), designtools()],
});
```

### 2. Add `data-slot` to your components

For Surface to recognize reusable components (and distinguish them from plain HTML elements), add a `data-slot` attribute to the root element of each component:

```tsx
// components/ui/button.tsx
export function Button({ children, className, ...props }) {
  return (
    <button data-slot="button" className={cn("...", className)} {...props}>
      {children}
    </button>
  );
}
```

The `data-slot` value should be a kebab-case name matching the component (e.g. `card-title` for `CardTitle`). This enables component-level editing — selecting a Button in the editor will let you modify its base styles in the component file, not just the instance.

Components without `data-slot` can still be selected and edited at the element level.

### 3. Run it

Start your Next.js dev server, then run Surface from your project root:

```bash
# Terminal 1: start your app
npm run dev

# Terminal 2: start the editor
npx @designtools/surface
```

The CLI auto-detects your dev server on port 3000 (also scanning 3001 and 3002 in case Next.js picked a different port). The editor opens at `http://localhost:4400`.

Your app loads inside an iframe — no proxy, no middleware.

### CLI options

| Flag | Default | Description |
|------|---------|-------------|
| `--port` | `3000` | Port your dev server runs on |
| `--tool-port` | `4400` | Port for the editor UI |
| `--components` | auto-detected | Path to your UI components directory |
| `--css` | auto-detected | Path to your CSS tokens file |

Both ports auto-increment if the default is busy. Component and CSS paths are auto-detected but can be overridden when detection fails.

## How it works

1. Click an element in the iframe to select it
2. The editor panel shows its computed styles, Tailwind classes, and source location
3. Edit values — changes are written directly to your source files
4. Your dev server picks up the file change and hot-reloads

For Tailwind projects, changes are written as utility classes (e.g. `text-sm`, `bg-blue-500`). When a project customizes its Tailwind theme (v3 config or v4 `@theme` blocks), Surface resolves the custom scales and uses them for class suggestions. When no matching utility exists, arbitrary value syntax is used (e.g. `text-[14px]`).

## What it can edit

- **Element styles** — layout, spacing, typography, colors, borders, shadows, opacity
- **Design tokens** — CSS custom properties in your stylesheets
- **Component variants** — base classes and variant mappings (works with CVA)
- **Shadows** — shadow token definitions in CSS or Tailwind `@theme` blocks
- **Gradients** — gradient token definitions
- **Spacing** — spacing scale tokens
- **Borders** — border radius and border width tokens

## Support matrix

### Frameworks

| Framework | Plugin | Status |
|-----------|--------|--------|
| Next.js (App Router) | `@designtools/next-plugin` | Stable |
| Vite + React | `@designtools/vite-plugin` | Stable |
| Astro | `@designtools/astro-plugin` | Stable |
| Remix | `@designtools/vite-plugin` | Beta |

### Styling Systems

| System | Write format | Status |
|--------|-------------|--------|
| Tailwind CSS v4 | Utility classes via resolved theme | Stable |
| Tailwind CSS v3 | Utility classes via theme config | Stable |
| CSS Variables | Direct property writes in CSS files | Stable |
| Plain CSS | Direct property writes in CSS files | Stable |
| CSS Modules | Property writes in .module.css files | Stable |
| Sass / SCSS | — | Planned |

## Limitations

- **Remix** — should work via Vite plugin but is not yet fully tested
- **Class writes** — for Tailwind projects, `className` writes produce utility classes. For CSS/CSS Modules/CSS Variables projects, writes go directly to CSS files. Inline style fallback when no CSS rule is found.
- **Development only** — the plugin and overlays are stripped from production builds
- **App Router only** — the auto-mount targets `app/layout.tsx` (or `src/app/layout.tsx`). Pages Router is not supported

## License

CC-BY-NC-4.0
