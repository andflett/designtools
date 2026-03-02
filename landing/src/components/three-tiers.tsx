import { Reveal } from "./reveal.js";

const tiers = [
  {
    number: "01",
    title: "Tokens",
    description:
      "Edit design tokens visually — colors, spacing, typography. Changes write to CSS custom properties with live preview and contrast checking.",
    screenshotHint: "screenshot: token-editor.png",
  },
  {
    number: "02",
    title: "Components",
    description:
      "Adjust variant definitions and Tailwind classes at the component level. Changes propagate to every instance.",
    screenshotHint: "screenshot: component-editor.png",
  },
  {
    number: "03",
    title: "Instances",
    description:
      "Override specific component usages. Swap variants, add class overrides, or adjust props in place.",
    screenshotHint: "screenshot: instance-editor.png",
  },
];

export function ThreeTiers() {
  return (
    <section className="py-24 relative" id="how-it-works">
      {/* Graph paper grid — full section */}
      <div className="graph-grid absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1100px] mx-auto px-6 relative">
        <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
          Three-tier editing
        </p>
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-normal tracking-[-0.025em] leading-[1.1] mb-3" style={{ fontFamily: "'Jersey 25', sans-serif" }}>
          Every level of your design system
        </h2>
        <p className="text-base text-ink2 max-w-[480px] leading-relaxed mb-14">
          From global tokens down to individual component instances. Each tier
          writes changes back to the appropriate source file.
        </p>

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4">
          {tiers.map((tier, i) => (
            <Reveal key={tier.number} delay={i * 0.08}>
              <div className="rounded-xl border border-edge bg-page h-full flex flex-col overflow-hidden hover:border-edge/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all">
                {/* Screenshot slot */}
                <div className="screenshot-slot aspect-[4/3]">
                  <span>{tier.screenshotHint}</span>
                </div>

                <div className="p-6 pt-5 flex flex-col flex-1 border-t border-edge-subtle">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold font-mono text-ink3 bg-muted border border-edge-subtle">
                      {tier.number}
                    </span>
                    <h3 className="text-base font-semibold tracking-tight">
                      {tier.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-ink2 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
