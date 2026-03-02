# @designtools/astro-plugin

Astro integration for [designtools](https://github.com/andflett/designtools). Adds source annotation attributes to `.astro` templates and React/Preact islands, and auto-mounts the `<Surface />` selection overlay in development.

## Install

```bash
npm install @designtools/astro-plugin
```

## Usage

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import designtools from "@designtools/astro-plugin";

export default defineConfig({
  integrations: [react(), designtools()],
});
```

## What it does

In development (`astro dev`):

1. **`.astro` template annotation** — Parses `.astro` files with `@astrojs/compiler` and injects `data-source="file:line:col"` on native HTML elements and `data-instance-source` on component instances via string splicing (preserves exact formatting)
2. **React/Preact island annotation** — Uses the Vite plugin's Babel transform to add `data-source` attributes to `.tsx`/`.jsx` files
3. **Surface auto-mount** — Injects `<Surface />` on every page via Astro's `injectScript`
4. **Component registry** — Generates a component registry for isolation preview

In production builds, the plugin is a no-op.

## Options

```ts
designtools({
  componentDir: "src/components/ui", // Override component scan directory
});
```

## Running with Surface

```bash
# Terminal 1: Start your Astro app
npm run dev

# Terminal 2: Start the Surface editor
npx @designtools/surface
```

The Surface editor opens at `localhost:4400` and loads your Astro app in an iframe.

## How annotation works

### `.astro` files

The plugin runs as a Vite `enforce: "pre"` transform before Astro's own compiler. It parses the `.astro` source with `@astrojs/compiler`, walks the AST to find element and component nodes, then splices `data-source` / `data-instance-source` attributes at the reported offsets. This preserves your exact formatting — no AST serialization or reformatting.

- Native HTML elements (`<div>`, `<p>`, `<section>`) get `data-source`
- Astro/framework components (`<Card>`, `<Counter>`) get `data-instance-source`
- `<style>`, `<script>`, `<slot>`, and `<Fragment>` tags are skipped

### React/Preact islands

`.tsx` and `.jsx` files are handled by the Vite plugin's Babel transform — the same one used in standalone Vite projects. If `@astrojs/react` or `@astrojs/preact` is installed, island components get full source annotation automatically.

## Supported styling systems

All styling systems supported by Surface work with the Astro plugin:

| System | Status |
|--------|--------|
| Tailwind CSS v3 / v4 | Stable |
| CSS Variables | Stable |
| Plain CSS | Stable |
| CSS Modules | Stable |
| Sass / SCSS | Planned |

See the [Surface README](../surface/README.md) for the full support matrix.

## License

CC-BY-NC-4.0
