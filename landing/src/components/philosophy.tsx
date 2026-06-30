import { BracesContent } from "pixelarticons/react/BracesContent";
import { Target } from "pixelarticons/react/Target";
import { Grid3x3 } from "pixelarticons/react/Grid3x3";
import { DitherGradient } from "./dither-gradient.js";
import { Reveal } from "./reveal.js";

const cards = [
  {
    icon: <Target width={20} height={20} />,
    title: "Direct edits or AI — your call",
    description:
      "Figma-grade controls for hands-on work: scrub spacing, pick colours, tune type. Or describe the change and let AI explore it for you. Both write to the same source files.",
  },
  {
    icon: <Grid3x3 width={20} height={20} />,
    title: "Fluent in your design system",
    description:
      "Surface reads your tokens, components and variants, then offers choices in your system's own language — your scales, your names. Need an exception? Drop to arbitrary values anytime.",
  },
  {
    icon: <BracesContent width={20} height={20} />,
    title: "Live on production code",
    description:
      "Edit your real running app, writing straight back to source — across Next, Vite, Remix, Astro and SvelteKit, Tailwind or plain CSS. Not a React-only toy. Not a throwaway canvas.",
  },
];

export function Philosophy() {
  return (
    <>
      <section className="relative pt-24 md:pt-36 pb-24 md:pb-16 bg-raised checker-dither overflow-hidden">
        {/* Bayer dither dissolves the dark hero straight into the
            checkerboard — sits over the section bg, no separator line.
            -mt-px overlaps the solid top row onto the hero above. */}
        <DitherGradient
          direction="down"
          height={64}
          pixelSize={4}
          color="#09090b"
          className="absolute inset-x-0 top-0 -mt-px pointer-events-none"
        />
        <div className="max-w-[1100px] mx-auto px-6 relative">
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px bg-edge-subtle rounded-xl overflow-hidden border border-edge-subtle">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <div className="bg-page p-8 h-full">
                <div className="text-ink3 mb-4">{card.icon}</div>
                <h3 className="text-[15px] font-semibold mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[13px] text-ink2 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
          <Reveal delay={0.25}>
            <p className="mt-8 text-center text-[13px] text-ink3">
              Read the full story and follow along with development on{" "}
              <a
                href="https://www.flett.cc/projects/design-engineer-studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink2 underline underline-offset-2 hover:text-ink transition-colors font-mono"
              >
                flett.cc
              </a>
            </p>
          </Reveal>
        </div>
      </section>
      <div className="dither-band" />
    </>
  );
}
