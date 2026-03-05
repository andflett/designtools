/**
 * Astro integration for designtools.
 * Provides source annotation for .astro templates (via @astrojs/compiler)
 * and React/Preact islands (via the Vite plugin's Babel transform).
 * Auto-mounts Surface on every page via Astro's injectScript.
 */

import type { AstroIntegration } from "astro";
import designtoolsVite, {
  type DesigntoolsOptions,
} from "@designtools/vite-plugin";
import { createAstroSourcePlugin } from "./astro-source-transform.js";

export type { DesigntoolsOptions };

export default function designtools(
  options?: DesigntoolsOptions
): AstroIntegration {
  return {
    name: "@designtools/astro",
    hooks: {
      "astro:config:setup": ({ updateConfig, injectScript, command }) => {
        if (command !== "dev") return;

        // Vite plugin handles: .tsx/.jsx source annotation, registry generation
        // Astro source plugin handles: .astro file source annotation
        updateConfig({
          vite: {
            plugins: [
              designtoolsVite(options),
              createAstroSourcePlugin(),
            ],
          },
        });

        // Mount Surface on every page via Astro's page script injection.
        // Uses dynamic import() so the React refresh preamble stubs are set
        // BEFORE the Surface module is loaded. Static imports are hoisted in
        // ES modules, so they'd run before the preamble assignment.
        // Without these stubs, full page reloads (e.g. after .astro file edits)
        // crash with "@vitejs/plugin-react can't detect preamble".
        injectScript(
          "page",
          `
if (!window.$RefreshReg$) {
  window.$RefreshReg$ = () => {};
  window.$RefreshSig$ = () => (type) => type;
}
const [{ Surface }, { createElement }, { createRoot }] = await Promise.all([
  import("@designtools/vite-plugin/surface"),
  import("react"),
  import("react-dom/client"),
]);
const el = document.createElement("div");
el.id = "__designtools_surface";
document.body.appendChild(el);
createRoot(el).render(createElement(Surface));
`
        );
      },
    },
  };
}
