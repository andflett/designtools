import { Reveal } from "./reveal.js";

const items = [
  { name: "Next.js", detail: "App or Pages router", version: "v14+" },
  { name: "React", detail: "Components + JSX", version: "v18+" },
  { name: "Tailwind CSS", detail: "Utility-first CSS", version: "v3 / v4" },
  { name: "Node.js", detail: "Runtime", version: "v18+" },
];

export function Stack() {
  return (
    <section className="py-24 border-t border-edge-subtle">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
            Compatibility
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] leading-tight">
            Get started in seconds
          </h2>
        </div>

        <Reveal>
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-px bg-edge-subtle rounded-xl overflow-hidden border border-edge-subtle">
            {items.map((item) => (
              <div
                key={item.name}
                className="bg-page p-8 max-md:p-6 text-center"
              >
                <div className="text-base font-semibold mb-1 tracking-tight">
                  {item.name}
                </div>
                <div className="text-[11px] text-ink3 mb-3">{item.detail}</div>
                <span className="inline-block font-mono text-[10px] text-ink3 px-2 py-0.5 bg-raised rounded border border-edge-subtle">
                  {item.version}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 flex justify-center">
          <code
            className="npx-command inline-flex items-center gap-2.5 px-5 py-3 font-mono text-sm text-ink2 bg-page border border-edge rounded-lg cursor-pointer hover:bg-raised transition-colors relative"
            onClick={() =>
              navigator.clipboard.writeText("npx @designtools/surface")
            }
            title="Copy to clipboard"
          >
            <span className="text-ink3">$</span>
            <span className="text-ink">npx @designtools/surface</span>
            <svg
              className="w-3 h-3 text-ink3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </code>
        </div>
      </div>
    </section>
  );
}
