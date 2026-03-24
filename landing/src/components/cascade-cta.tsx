import { Reveal } from "./reveal.js";
import { DitherGradient } from "./dither-gradient.js";

export function CascadeCta() {
  return (
    <>
      <DitherGradient direction="up" height={120} pixelSize={4} color="#09090b" />
      <section className="bg-[#09090b] py-20">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <Reveal>
            <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3 font-mono">
              Also from @designtools
            </p>
            <h2
              className="text-[clamp(1.9rem,4vw,3rem)] font-normal tracking-[-0.025em] leading-[1.1] text-white mb-4"
              style={{ fontFamily: "'Jersey 25', sans-serif" }}
            >
              Cascade
            </h2>
            <p className="text-white/60 max-w-[420px] mx-auto mb-8 text-[15px] leading-relaxed">
              An open-source icon set where every icon represents a CSS property-value pair.
              Copy as SVG or React. Built for design tools and inspectors.
            </p>
            <a
              href="/cascade"
              className="inline-flex items-center gap-2 px-5 h-[42px] text-sm font-medium bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-mono"
            >
              Browse the icon set
            </a>
          </Reveal>
        </div>
      </section>
      <DitherGradient direction="down" height={80} pixelSize={4} color="#09090b" />
    </>
  );
}
