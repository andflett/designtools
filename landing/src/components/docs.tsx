import { useState } from "react";

type Framework = "nextjs" | "vite" | "remix" | "astro" | "sveltekit";

const frameworkTabs: { id: Framework; label: string }[] = [
  { id: "nextjs", label: "Next.js" },
  { id: "vite", label: "Vite + React" },
  { id: "remix", label: "Remix" },
  { id: "astro", label: "Astro" },
  { id: "sveltekit", label: "SvelteKit" },
];

function CodeBlock({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <pre className="bg-ink text-white/90 text-[13px] font-mono p-4 rounded-lg overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

function FrameworkInstructions({ framework }: { framework: Framework }) {
  switch (framework) {
    case "nextjs":
      return (
        <div className="space-y-4">
          <CodeBlock>npm install -D @designtools/next-plugin</CodeBlock>
          <CodeBlock lang="ts">{`// next.config.ts
import { withDesigntools } from "@designtools/next-plugin";

export default withDesigntools({
  /* your existing config */
});`}</CodeBlock>
          <CodeBlock>{`# Terminal 1 — start your app
npm run dev

# Terminal 2 — start surface
npx @designtools/surface`}</CodeBlock>
        </div>
      );
    case "vite":
      return (
        <div className="space-y-4">
          <CodeBlock>npm install -D @designtools/vite-plugin</CodeBlock>
          <CodeBlock lang="ts">{`// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import designtools from "@designtools/vite-plugin";

export default defineConfig({
  plugins: [designtools(), react()],
});`}</CodeBlock>
          <p className="text-sm text-ink2">
            The plugin must be listed <strong className="text-ink">before</strong> <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">@vitejs/plugin-react</code>.
          </p>
          <CodeBlock>{`# Terminal 1 — start your app
npm run dev

# Terminal 2 — start surface
npx @designtools/surface`}</CodeBlock>
        </div>
      );
    case "remix":
      return (
        <div className="space-y-4">
          <p className="text-sm text-ink2">
            Remix uses Vite under the hood, so the setup is the same as Vite + React.
          </p>
          <CodeBlock>npm install -D @designtools/vite-plugin</CodeBlock>
          <CodeBlock lang="ts">{`// vite.config.ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import designtools from "@designtools/vite-plugin";

export default defineConfig({
  plugins: [designtools(), reactRouter()],
});`}</CodeBlock>
          <CodeBlock>npx @designtools/surface</CodeBlock>
        </div>
      );
    case "astro":
      return (
        <div className="space-y-4">
          <CodeBlock>npm install -D @designtools/astro-plugin</CodeBlock>
          <CodeBlock lang="js">{`// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import designtools from "@designtools/astro-plugin";

export default defineConfig({
  integrations: [react(), designtools()],
});`}</CodeBlock>
          <CodeBlock>npx @designtools/surface</CodeBlock>
        </div>
      );
    case "sveltekit":
      return (
        <div className="space-y-4">
          <CodeBlock>npm install -D @designtools/svelte-plugin</CodeBlock>
          <CodeBlock lang="ts">{`// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import designtools from "@designtools/svelte-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit(), designtools()],
});`}</CodeBlock>
          <CodeBlock>npx @designtools/surface</CodeBlock>
        </div>
      );
  }
}

export function Docs() {
  const [activeFramework, setActiveFramework] = useState<Framework>("nextjs");

  return (
    <main className="max-w-[720px] mx-auto px-6 pt-32 pb-24">
      <a
        href="#"
        className="inline-flex items-center gap-1.5 text-xs text-ink3 hover:text-ink2 transition-colors font-mono mb-8"
      >
        &larr; Back
      </a>

      <h1 className="text-2xl font-semibold tracking-tight mb-2">
        Getting Started
      </h1>
      <p className="text-[15px] text-ink2 leading-relaxed mb-10">
        Pick your framework and follow the setup below. Each one takes under a minute.
      </p>

      {/* Prerequisites */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">Prerequisites</h2>
        <ul className="list-disc list-inside space-y-1.5 text-[15px] text-ink2">
          <li>Node.js 18+</li>
          <li>A running dev server for your app</li>
          <li>
            A supported styling system:{" "}
            <strong className="text-ink">Tailwind CSS</strong> v3/v4,{" "}
            <strong className="text-ink">CSS Custom Properties</strong>,{" "}
            <strong className="text-ink">Plain CSS</strong>, or{" "}
            <strong className="text-ink">CSS Modules</strong>
          </li>
        </ul>
      </section>

      {/* Framework Tabs */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {frameworkTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFramework(tab.id)}
              className={`px-3 py-1.5 text-[13px] font-mono rounded-md transition-colors ${
                activeFramework === tab.id
                  ? "bg-ink text-white"
                  : "bg-muted text-ink2 hover:bg-edge hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <FrameworkInstructions framework={activeFramework} />
      </section>

      {/* What the plugins do */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">What the plugins do</h2>
        <p className="text-[15px] text-ink2 leading-relaxed mb-3">
          In development, each framework plugin:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-[15px] text-ink2 mb-3">
          <li>
            Injects <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">data-source="file:line:col"</code> attributes into every element, mapping each element to its source location. These only exist in the compiled output — your source files are not modified.
          </li>
          <li>
            Auto-mounts the selection overlay component into your app.
          </li>
        </ul>
        <p className="text-[15px] text-ink2 leading-relaxed">
          Neither is included in production builds.
        </p>
      </section>

      {/* Component editing */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">
          Component editing with <code className="text-[14px] bg-muted px-1.5 py-0.5 rounded">data-slot</code>
        </h2>
        <p className="text-[15px] text-ink2 leading-relaxed mb-4">
          For Surface to recognize reusable components (and distinguish them from plain HTML elements), add a <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">data-slot</code> attribute to the root element of each component:
        </p>
        <CodeBlock lang="tsx">{`// components/ui/button.tsx
export function Button({ children, className, ...props }) {
  return (
    <button data-slot="button" className={cn("...", className)} {...props}>
      {children}
    </button>
  );
}`}</CodeBlock>
        <p className="text-[15px] text-ink2 leading-relaxed mt-4">
          The <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">data-slot</code> value should be a kebab-case name matching the component (e.g. <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">card-title</code> for <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">CardTitle</code>). This enables component-level editing — selecting a Button in the editor will let you modify its base styles in the component file, not just the instance.
        </p>
        <p className="text-[15px] text-ink2 leading-relaxed mt-3">
          Components without <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">data-slot</code> can still be selected and edited at the element level.
        </p>
      </section>

      {/* CLI options */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">CLI options</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-edge">
                <th className="text-left py-2 pr-4 font-semibold text-ink">Flag</th>
                <th className="text-left py-2 pr-4 font-semibold text-ink">Default</th>
                <th className="text-left py-2 font-semibold text-ink">Description</th>
              </tr>
            </thead>
            <tbody className="text-ink2">
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4 font-mono text-[13px]">--port</td>
                <td className="py-2 pr-4">3000</td>
                <td className="py-2">Port your dev server runs on</td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4 font-mono text-[13px]">--tool-port</td>
                <td className="py-2 pr-4">4400</td>
                <td className="py-2">Port for the editor UI</td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4 font-mono text-[13px]">--components</td>
                <td className="py-2 pr-4">auto-detected</td>
                <td className="py-2">Path to your UI components directory</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-[13px]">--css</td>
                <td className="py-2 pr-4">auto-detected</td>
                <td className="py-2">Path to your CSS tokens file</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[15px] text-ink2 leading-relaxed mt-4">
          Both ports auto-increment if the default is busy. Component and CSS paths are auto-detected but can be overridden when detection fails.
        </p>
      </section>

      {/* How it works */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">How it works</h2>
        <ol className="list-decimal list-inside space-y-1.5 text-[15px] text-ink2">
          <li>Click an element in the iframe to select it</li>
          <li>The editor panel shows its computed styles, Tailwind classes, and source location</li>
          <li>Edit values — changes are written directly to your source files</li>
          <li>Your dev server picks up the file change and hot-reloads</li>
        </ol>
        <p className="text-[15px] text-ink2 leading-relaxed mt-4">
          For Tailwind projects, changes are written as utility classes. When a project customizes its Tailwind theme (v3 config or v4 <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">@theme</code> blocks), Surface resolves the custom scales and uses them for class suggestions. When no matching utility exists, arbitrary value syntax is used (e.g. <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">text-[14px]</code>).
        </p>
        <p className="text-[15px] text-ink2 leading-relaxed mt-3">
          For CSS/CSS Modules/CSS Variables projects, writes go directly to the relevant CSS files. Inline style fallback when no matching CSS rule is found.
        </p>
      </section>

      {/* What it can edit */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">What it can edit</h2>
        <ul className="list-disc list-inside space-y-1.5 text-[15px] text-ink2">
          <li><strong className="text-ink">Element styles</strong> — layout, spacing, typography, colors, borders, shadows, opacity</li>
          <li><strong className="text-ink">Design tokens</strong> — CSS custom properties in your stylesheets</li>
          <li><strong className="text-ink">Component variants</strong> — base classes and variant mappings (works with CVA)</li>
          <li><strong className="text-ink">Shadows</strong> — shadow token definitions in CSS or Tailwind <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">@theme</code> blocks</li>
          <li><strong className="text-ink">Gradients</strong> — gradient token definitions</li>
          <li><strong className="text-ink">Spacing</strong> — spacing scale tokens</li>
          <li><strong className="text-ink">Borders</strong> — border radius and border width tokens</li>
        </ul>
      </section>

      {/* Support matrix */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">Support matrix</h2>
        
        <h3 className="text-sm font-semibold text-ink mb-2 mt-6">Frameworks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-edge">
                <th className="text-left py-2 pr-4 font-semibold text-ink">Framework</th>
                <th className="text-left py-2 pr-4 font-semibold text-ink">Plugin</th>
                <th className="text-left py-2 font-semibold text-ink">Status</th>
              </tr>
            </thead>
            <tbody className="text-ink2">
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Next.js (App Router)</td>
                <td className="py-2 pr-4 font-mono text-[13px]">@designtools/next-plugin</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Vite + React</td>
                <td className="py-2 pr-4 font-mono text-[13px]">@designtools/vite-plugin</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Astro</td>
                <td className="py-2 pr-4 font-mono text-[13px]">@designtools/astro-plugin</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">SvelteKit</td>
                <td className="py-2 pr-4 font-mono text-[13px]">@designtools/svelte-plugin</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Remix</td>
                <td className="py-2 pr-4 font-mono text-[13px]">@designtools/vite-plugin</td>
                <td className="py-2"><span className="text-amber-600">Beta</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-sm font-semibold text-ink mb-2 mt-6">Styling systems</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-edge">
                <th className="text-left py-2 pr-4 font-semibold text-ink">System</th>
                <th className="text-left py-2 pr-4 font-semibold text-ink">Write format</th>
                <th className="text-left py-2 font-semibold text-ink">Status</th>
              </tr>
            </thead>
            <tbody className="text-ink2">
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Tailwind CSS v4</td>
                <td className="py-2 pr-4">Utility classes via resolved theme</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Tailwind CSS v3</td>
                <td className="py-2 pr-4">Utility classes via theme config</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">CSS Variables</td>
                <td className="py-2 pr-4">Direct property writes in CSS files</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">Plain CSS</td>
                <td className="py-2 pr-4">Direct property writes in CSS files</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr className="border-b border-edge-subtle">
                <td className="py-2 pr-4">CSS Modules</td>
                <td className="py-2 pr-4">Property writes in .module.css files</td>
                <td className="py-2"><span className="text-green-600">Stable</span></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Sass / SCSS</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2"><span className="text-ink3">Planned</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-ink mb-3">Limitations</h2>
        <ul className="list-disc list-inside space-y-1.5 text-[15px] text-ink2">
          <li><strong className="text-ink">Development only</strong> — the plugin and overlays are stripped from production builds</li>
          <li><strong className="text-ink">Next.js App Router only</strong> — the auto-mount targets <code className="text-[13px] bg-muted px-1.5 py-0.5 rounded">app/layout.tsx</code>. Pages Router is not supported.</li>
          <li><strong className="text-ink">Remix</strong> — should work via Vite plugin but is not yet fully tested</li>
        </ul>
      </section>

      {/* License */}
      <section>
        <h2 className="text-base font-semibold text-ink mb-3">License</h2>
        <p className="text-[15px] text-ink2 leading-relaxed">
          CC-BY-NC-4.0
        </p>
      </section>
    </main>
  );
}
