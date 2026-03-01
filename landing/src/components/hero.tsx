import { motion } from "motion/react";
import { DitherGradient } from "./dither-gradient.js";
import { DitherGlow } from "./dither-glow.js";

export function Hero() {
  return (
    <section className="relative pt-0 text-center overflow-hidden">
      {/* Dark header band that dissolves via Bayer dither */}
      <div className="bg-ink">
        <div className="pt-28 pb-14 max-w-[1100px] mx-auto px-6 relative">
          {/* Dithered glow — static, not inside motion */}
          <div className="relative inline-flex justify-center mb-6">
            <DitherGlow width={360} height={100} pixelSize={4} color="rgba(255,255,255,0.15)" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 text-xs font-medium text-white/70  font-mono relative rounded-full"
            >
              <span className="animate-pulse w-1.5 h-1.5 bg-green-400 rounded-full" />
              v0.1 — open source
            </motion.span>
          </div>

          <motion.h1
            className="text-[clamp(2.75rem,6.5vw,4.5rem)] font-semibold leading-[1.05] tracking-[0.025em] text-white mb-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Visual editing for
            <br />
            production code
          </motion.h1>

          <motion.p
            className="text-lg text-white/80 max-w-[460px] mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            A visual design layer that understands your design system, sits on
            top of your production code, and writes changes back to source
          </motion.p>
        </div>
      </div>

      {/* Bayer dither dissolve edge */}
      <DitherGradient
        direction="down"
        height={160}
        pixelSize={4}
        color="#09090b"
      />

      <div className="max-w-[1100px] mx-auto px-6 relative pt-4 pb-20">
        {/* npx command — pixelated style */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          <code
            className="npx-command inline-flex items-center gap-2.5 px-5 py-3 font-mono text-sm border border-edge bg-page rounded-lg cursor-pointer hover:bg-raised transition-colors relative"
            onClick={() =>
              navigator.clipboard.writeText("npx @designtools/surface")
            }
            title="Copy to clipboard"
          >
            <span className="text-ink3">$</span>
            <span className="text-ink">npx @designtools/surface</span>
            <svg
              className="w-3.5 h-3.5 text-ink3"
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
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <a
            href="https://www.npmjs.com/package/@designtools/surface"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-btn text-white rounded-lg hover:bg-btn/90 transition-colors"
          >
            Get started
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-ink bg-page border border-edge rounded-lg hover:bg-raised transition-colors"
          >
            How it works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
