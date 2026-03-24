import { Reveal } from "./reveal.js";

const features = [
  {
    title: "Deterministic mode",
    description:
      "Click a property, change a value, the exact edit is written to your file. Targeted AST edits to your existing source. Fast, precise, no surprises.",
  },
  {
    title: "AI mode",
    description:
      "Pass edits and codebase context to your local model CLI for open-ended exploration. When you're not sure what you want yet, AI mode helps you get there.",
  },
  {
    title: "Live preview, real app",
    description:
      "You're editing your actual running application in both modes. The iframe loads your dev server directly. No canvas, no export cycle.",
  },
];

const rows = [
  { label: "Edits existing code", us: true, them: false },
  { label: "Uses your dev server", us: true, them: false },
  { label: "Design system aware", us: true, them: false },
  { label: "Deterministic mode", us: true, them: false },
  { label: "AI mode", us: true, them: false },
  { label: "Framework lock-in", us: false, them: true },
];

export function Differentiators() {
  return (
    <>
      {/* Dither band transition into section */}
      <div className="dither-band" />

      <section className="py-24 bg-raised checker-dither">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col gap-16">
            <Reveal>
              <div>
                <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
                  Why codesurface
                </p>
                <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-normal tracking-[-0.025em] leading-[1.1] mb-3" style={{ fontFamily: "'Jersey 25', sans-serif" }}>
                  A layer on your app, not a replacement
                </h2>
                <p className="text-base text-ink2 leading-relaxed mb-10">
                  Canvas tools generate code from scratch. Codesurface works with
                  what you already have.
                </p>

                <ul className="grid grid-cols-3 max-md:grid-cols-1 gap-6 list-none">
                  {features.map((f) => (
                    <li key={f.title} className="pl-4 border-l-2 border-edge">
                      <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                      <p className="text-[13px] text-ink2 leading-relaxed">
                        {f.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-xl border border-edge overflow-hidden bg-page text-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                {/* Header */}
                <div className="grid grid-cols-[1fr_80px_80px] border-b border-edge">
                  <div className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-ink3" />
                  <div className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-center text-ink font-mono bg-raised">
                    cs
                  </div>
                  <div className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-center text-ink3 font-mono">
                    others
                  </div>
                </div>

                {rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1fr_80px_80px] ${i < rows.length - 1 ? "border-b border-edge-subtle" : ""}`}
                  >
                    <div className="px-4 py-2.5 font-medium text-ink">
                      {row.label}
                    </div>
                    <div className="px-4 py-2.5 text-center bg-raised/50">
                      {row.us ? (
                        <span className="inline-block w-3.5 h-3.5 text-ink">
                          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                            <polyline points="2.5 7.5 5.5 10.5 11.5 4.5" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-block w-2 h-[2px] bg-ink3/40" />
                      )}
                    </div>
                    <div className="px-4 py-2.5 text-center">
                      {row.them ? (
                        <span className="inline-block w-3.5 h-3.5 text-ink3/50">
                          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                            <polyline points="2.5 7.5 5.5 10.5 11.5 4.5" />
                          </svg>
                        </span>
                      ) : (
                        <span className="inline-block w-2 h-[2px] bg-ink3/40" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Dither band transition out of section */}
      <div className="dither-band" />
    </>
  );
}
