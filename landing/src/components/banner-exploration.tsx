import { useState } from "react";
// @ts-ignore
import tokensSrc from "../assets/tokens.png?format=webp&quality=90";
// @ts-ignore
import componentsSrc from "../assets/components.png?format=webp&quality=90";
// @ts-ignore
import instanceSrc from "../assets/instance.png?format=webp&quality=90";
// @ts-ignore
import explorerSrc from "../assets/explorer.png?format=webp&quality=90";

/* ------------------------------------------------------------------ */
/*  Shared constants                                                   */
/* ------------------------------------------------------------------ */

const TITLE = "Visual editing for\nproduction frontends";
const TAGLINE =
  "A multi-framework design tool that understands your design system, sits on top of your production code, and writes changes back to source.";
const SIZE = 1024;

/* Framework logos — inline SVG for the banner (no external deps) */
const frameworkLogos: { name: string; svg: React.ReactNode }[] = [
  {
    name: "React",
    svg: (
      <svg viewBox="-11.5 -10.232 23 20.463" className="h-8 w-auto" fill="currentColor">
        <circle r="2.05" />
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 180" className="h-8 w-auto" fill="currentColor">
        <mask id="nj-b" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="white" />
          <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461A90.34 90.34 0 00149.508 157.52z" fill="black" />
          <rect x="115" y="54" width="12" height="72" fill="black" />
        </mask>
        <circle cx="90" cy="90" r="90" mask="url(#nj-b)" />
      </svg>
    ),
  },
  {
    name: "Astro",
    svg: (
      <svg viewBox="0 0 24 24" className="h-8 w-auto" fill="currentColor">
        <path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z" />
      </svg>
    ),
  },
  {
    name: "Svelte",
    svg: (
      <svg viewBox="0 0 32 32" className="h-8 w-auto" fill="currentColor">
        <path d="M27.573 4.229c-2.927-4.25-8.656-5.479-13.068-2.802l-7.464 4.745c-2.042 1.281-3.443 3.365-3.854 5.734-0.365 1.969-0.047 4.005 0.891 5.776-0.641 0.964-1.073 2.052-1.266 3.198-0.427 2.406 0.13 4.885 1.547 6.88 2.932 4.24 8.646 5.474 13.068 2.828l7.469-4.75c2.031-1.281 3.427-3.365 3.839-5.734 0.359-1.964 0.042-3.995-0.896-5.755 1.984-3.115 1.88-7.12-0.266-10.12z" />
      </svg>
    ),
  },
];

/* Tier pills for variation 3 */
const tiers = [
  { num: "01", label: "Tokens" },
  { num: "02", label: "Components" },
  { num: "03", label: "Instances" },
  { num: "04", label: "Isolate" },
  { num: "05", label: "Usage" },
  { num: "06", label: "Explorer" },
];

/* Bayer 8x8 ordered dither matrix */
const BAYER_8X8 = [
  [0/64, 48/64, 12/64, 60/64,  3/64, 51/64, 15/64, 63/64],
  [32/64, 16/64, 44/64, 28/64, 35/64, 19/64, 47/64, 31/64],
  [8/64, 56/64,  4/64, 52/64, 11/64, 59/64,  7/64, 55/64],
  [40/64, 24/64, 36/64, 20/64, 43/64, 27/64, 39/64, 23/64],
  [2/64, 50/64, 14/64, 62/64,  1/64, 49/64, 13/64, 61/64],
  [34/64, 18/64, 46/64, 30/64, 33/64, 17/64, 45/64, 29/64],
  [10/64, 58/64,  6/64, 54/64,  9/64, 57/64,  5/64, 53/64],
  [42/64, 26/64, 38/64, 22/64, 41/64, 25/64, 37/64, 21/64],
];

function DitherGlowInline({ width, height, pixelSize = 3, color = "rgba(255,255,255,0.12)" }: { width: number; height: number; pixelSize?: number; color?: string }) {
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);
  const cx = cols / 2, cy = rows / 2, rx = cols / 2, ry = rows / 2;
  const hash = (x: number, y: number) => { let h = (x * 374761393 + y * 668265263) >>> 0; h = ((h ^ (h >> 13)) * 1274126177) >>> 0; return (h & 0xffff) / 0xffff; };
  const rects: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      const gv = Math.max(0, 0.55 * (1 - Math.sqrt(dx * dx + dy * dy)));
      const threshold = BAYER_8X8[y % 8][x % 8] * 0.5 + hash(x, y) * 0.5;
      if (gv > threshold) rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`);
    }
  }
  const uri = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols}" height="${rows}" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges">${rects.join("")}</svg>`)}`;
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ width, height, backgroundImage: `url("${uri}")`, backgroundSize: `${width}px ${height}px`, backgroundRepeat: "no-repeat", imageRendering: "pixelated" }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Banner frame — wraps each 1024×1024 variation                      */
/* ------------------------------------------------------------------ */

function BannerFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">{label}</h3>
      <div
        className="relative overflow-hidden rounded-lg border border-white/10"
        style={{ width: SIZE, height: SIZE }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Variation A — Editor panel poking up from bottom                   */
/* ------------------------------------------------------------------ */

function BannerEditorPanel() {
  return (
    <BannerFrame label="A — Editor panel">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center relative">
        {/* Dither glow behind title */}
        <div className="relative mt-[140px] mb-6">
          <DitherGlowInline width={600} height={140} pixelSize={3} color="rgba(255,255,255,0.10)" />
          <h2
            className="text-[64px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center whitespace-pre-line relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>
        <p className="text-[18px] text-white/70 max-w-[600px] text-center leading-relaxed px-8 mb-auto">
          {TAGLINE}
        </p>

        {/* Screenshot panel rising from bottom */}
        <div className="w-[680px] rounded-t-xl border border-b-0 border-white/10 overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.5)] mt-auto">
          <div className="h-8 bg-[#18181b] border-b border-white/8 flex items-center px-3 gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="ml-auto text-[10px] font-mono text-white/30">@designtools/surface</span>
          </div>
          <img src={tokensSrc} alt="Token editor" className="w-full h-[280px] object-cover object-top" />
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Variation B — Large framework icons row                            */
/* ------------------------------------------------------------------ */

function BannerIconsRow() {
  return (
    <BannerFrame label="B — Framework icons">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center relative">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative">
          <DitherGlowInline width={700} height={160} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[68px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center whitespace-pre-line relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>

        <p className="text-[17px] text-white/60 max-w-[560px] text-center leading-relaxed mt-6 mb-16 px-8 relative">
          {TAGLINE}
        </p>

        {/* Large icons row */}
        <div className="flex items-center gap-20 relative">
          {frameworkLogos.map((logo) => (
            <div key={logo.name} className="flex flex-col items-center gap-3">
              <div className="text-white/50 [&_svg]:!h-12 [&_svg]:!w-auto">{logo.svg}</div>
              <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest">{logo.name}</span>
            </div>
          ))}
        </div>

        {/* Version badge at bottom */}
        <div className="absolute bottom-12 flex items-center gap-2 text-[12px] font-mono text-white/25">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          v0.1 — @designtools/surface
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Variation C — Tier grid (6 numbered features)                      */
/* ------------------------------------------------------------------ */

function BannerTierGrid() {
  return (
    <BannerFrame label="C — Feature grid">
      <div className="w-full h-full bg-[#09090b] flex flex-col relative">
        {/* Top section with title */}
        <div className="flex flex-col items-center pt-[100px] pb-10 relative">
          <DitherGlowInline width={600} height={120} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[56px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center whitespace-pre-line relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
          <p className="text-[16px] text-white/50 max-w-[520px] text-center leading-relaxed mt-5 px-8 relative">
            {TAGLINE}
          </p>
        </div>

        {/* 3×2 grid of tier pills */}
        <div className="flex-1 flex items-center justify-center px-16 pb-12">
          <div className="grid grid-cols-3 gap-3 w-full max-w-[700px]">
            {tiers.map((tier) => (
              <div
                key={tier.num}
                className="flex items-center gap-3 px-5 py-4 rounded-lg border border-white/8 bg-white/[0.02]"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold font-mono text-white/40 bg-white/[0.06] border border-white/8 shrink-0">
                  {tier.num}
                </span>
                <span className="text-[15px] font-medium text-white/80 tracking-tight">{tier.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center gap-2 pb-10 text-[12px] font-mono text-white/25">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          v0.1 — @designtools/surface
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Variation D — Screenshot triptych                                  */
/* ------------------------------------------------------------------ */

function BannerTriptych() {
  const shots = [
    { src: tokensSrc, label: "Tokens" },
    { src: componentsSrc, label: "Components" },
    { src: instanceSrc, label: "Instances" },
  ];
  return (
    <BannerFrame label="D — Screenshot triptych">
      <div className="w-full h-full bg-[#09090b] flex flex-col relative">
        {/* Title area */}
        <div className="flex flex-col items-center pt-[80px] pb-8 relative">
          <DitherGlowInline width={600} height={120} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[52px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center whitespace-pre-line relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
          <p className="text-[15px] text-white/50 max-w-[500px] text-center leading-relaxed mt-4 px-8 relative">
            {TAGLINE}
          </p>
        </div>

        {/* Three screenshots in perspective-ish row */}
        <div className="flex-1 flex items-end justify-center gap-4 px-10 pb-0 overflow-hidden">
          {shots.map((shot, i) => (
            <div key={shot.label} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{shot.label}</span>
              <div className="w-full rounded-t-lg border border-b-0 border-white/10 overflow-hidden bg-[#18181b]">
                <div className="h-5 bg-[#18181b] border-b border-white/6 flex items-center px-2 gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
                <img
                  src={shot.src}
                  alt={shot.label}
                  className="w-full object-cover object-top"
                  style={{ height: i === 1 ? 340 : 300 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Variation E — Minimal with compatibility matrix strip              */
/* ------------------------------------------------------------------ */

const stylingPills = ["Tailwind v4", "Tailwind v3", "CSS Variables", "CSS Modules", "Scoped Styles"];
const frameworkPills = ["Next.js", "Vite", "Remix", "Astro", "SvelteKit"];

function BannerMatrix() {
  return (
    <BannerFrame label="E — Compatibility matrix">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center relative">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mb-10">
          <DitherGlowInline width={700} height={180} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[72px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center whitespace-pre-line relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>

        <p className="text-[18px] text-white/60 max-w-[580px] text-center leading-relaxed mb-16 px-8 relative">
          {TAGLINE}
        </p>

        {/* Two rows of pills */}
        <div className="flex flex-col items-center gap-3 relative">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest mr-2 w-16 text-right">Styles</span>
            {stylingPills.map((p) => (
              <span key={p} className="px-3 py-1.5 text-[12px] font-mono text-white/60 bg-white/[0.04] border border-white/8 rounded-md">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest mr-2 w-16 text-right">Frames</span>
            {frameworkPills.map((p) => (
              <span key={p} className="px-3 py-1.5 text-[12px] font-mono text-white/60 bg-white/[0.04] border border-white/8 rounded-md">
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom version */}
        <div className="absolute bottom-12 flex items-center gap-2 text-[12px] font-mono text-white/25">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          v0.1 — @designtools/surface
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Page wrapper                                                       */
/* ------------------------------------------------------------------ */

export function BannerExploration() {
  const [selected, setSelected] = useState<number | null>(null);

  const banners = [
    <BannerEditorPanel key="a" />,
    <BannerIconsRow key="b" />,
    <BannerTierGrid key="c" />,
    <BannerTriptych key="d" />,
    <BannerMatrix key="e" />,
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-8 pt-12 pb-8">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Internal</p>
        <h1
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] text-white"
          style={{ fontFamily: "'Jersey 25', sans-serif" }}
        >
          LinkedIn Banner Exploration
        </h1>
        <p className="text-sm text-white/40 mt-1 font-mono">1024 × 1024 — 5 variations — dark mode</p>
      </div>

      {/* Variation selector chips */}
      <div className="max-w-[1200px] mx-auto px-8 pb-8 flex items-center gap-2">
        <button
          onClick={() => setSelected(null)}
          className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${
            selected === null
              ? "border-white/30 text-white bg-white/10"
              : "border-white/8 text-white/40 hover:text-white/60"
          }`}
        >
          All
        </button>
        {["A — Editor", "B — Icons", "C — Grid", "D — Triptych", "E — Matrix"].map((label, i) => (
          <button
            key={label}
            onClick={() => setSelected(i)}
            className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${
              selected === i
                ? "border-white/30 text-white bg-white/10"
                : "border-white/8 text-white/40 hover:text-white/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Banners */}
      <div className="max-w-[1200px] mx-auto px-8 pb-24 space-y-16">
        {selected !== null ? banners[selected] : banners}
      </div>
    </div>
  );
}
