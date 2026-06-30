import { Reveal } from "./reveal.js";
import { ComingSoon } from "./coming-soon-tooltip.js";

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.78M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export function Download() {
  return (
    <>
      {/* Bayer dither bands separate the panel from its neighbours */}
      <div className="dither-band" />
      <section className="relative bg-raised checker-dither pt-24 pb-20 overflow-hidden">
      {/* Corner crop marks — framing ticks, like an artboard */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute top-6 left-6 w-3 h-3 border-l border-t border-ink3/40" />
        <span className="absolute top-6 right-6 w-3 h-3 border-r border-t border-ink3/40" />
        <span className="absolute bottom-6 left-6 w-3 h-3 border-l border-b border-ink3/40" />
        <span className="absolute bottom-6 right-6 w-3 h-3 border-r border-b border-ink3/40" />
      </div>

      <div className="max-w-[1100px] mx-auto px-6 text-center relative">
        <Reveal>
          <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
            Free &amp; open source
          </p>
          <h2
            className="text-[clamp(1.9rem,4vw,3rem)] font-normal tracking-[-0.025em] leading-[1.1] mb-4"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            Download the desktop app
          </h2>
          <p className="text-ink2 max-w-[440px] mx-auto mb-10 text-[15px] leading-relaxed">
            One app, no terminal needed. Open any GitHub repo, edit it visually,
            and ship a Vercel preview — all from here.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <ComingSoon>
              <button
                type="button"
                aria-disabled="true"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2.5 px-6 h-[46px] text-sm font-medium bg-ink text-page rounded-lg opacity-60 cursor-not-allowed select-none"
              >
                <AppleIcon />
                Download for macOS
              </button>
            </ComingSoon>
            <ComingSoon>
              <button
                type="button"
                aria-disabled="true"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 h-[46px] px-5 text-sm text-ink3 cursor-not-allowed select-none font-mono"
              >
                All releases ↗
              </button>
            </ComingSoon>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[11px] text-ink3/60 dark:text-ink3 font-mono">
            macOS 12+ required &middot; Windows &amp; Linux coming soon
          </p>
        </Reveal>
      </div>
      </section>
      <div className="dither-band" />
    </>
  );
}
