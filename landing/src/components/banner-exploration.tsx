import { useState, useRef, useEffect } from "react";
import {
  metadata,
  lookupIcon,
  IconSvg,
  type IconEntry,
} from "#cascade";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE = 1024;
const UNIQUE_PROPS = new Set(metadata.map((e) => e.property)).size;
const TITLE = "Cascade Icons";
const TAGLINE = `Hand-crafted icons for ${UNIQUE_PROPS} CSS properties and their values. Made for design tools that speak code.`;

/* Category groupings — mirrors cascade-page.tsx */
const CATEGORIES: { label: string; properties: string[] }[] = [
  { label: "Layout", properties: ["position", "display", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink"] },
  { label: "Spacing", properties: ["gap", "overflow", "padding", "margin", "axis", "size"] },
  { label: "Borders", properties: ["border-radius", "border-style", "border-width"] },
  { label: "Typography", properties: ["font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "text-decoration", "text-transform"] },
  { label: "Effects", properties: ["opacity", "box-shadow"] },
  { label: "Alignment", properties: ["justify-content", "align-items", "align-self", "align-content"] },
];

const HIDDEN_VALUES = new Set(["none", "auto", "static", "nowrap", "start", "end"]);
const HIDDEN_EXCEPTIONS = new Set(["display::none"]);

function orderedEntries(): IconEntry[] {
  const ordered: IconEntry[] = [];
  for (const cat of CATEGORIES) {
    for (const prop of cat.properties) {
      const matches = metadata.filter((e) => {
        if (e.property !== prop) return false;
        const v = e.value ?? "";
        if (HIDDEN_VALUES.has(v) && !HIDDEN_EXCEPTIONS.has(`${e.property}::${v}`)) return false;
        return true;
      });
      ordered.push(...matches);
    }
  }
  return ordered;
}

const allEntries = orderedEntries();

/* Bayer 8×8 for dither glow */
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

function DitherGlow({ width, height, pixelSize = 3, color = "rgba(255,255,255,0.12)" }: { width: number; height: number; pixelSize?: number; color?: string }) {
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

/* Graph-paper line color for icon grid backgrounds */
const LINE = "rgba(255,255,255,0.04)";
const CELL = 64;

/* ------------------------------------------------------------------ */
/*  Render a single cascade icon at a given size                       */
/* ------------------------------------------------------------------ */

function Icon({ entry, size = 15 }: { entry: IconEntry; size?: number }) {
  const icon = lookupIcon(entry.property, entry.value);
  if (!icon) return null;
  return <IconSvg icon={icon} className="text-white/80" style={{ width: size, height: size }} />;
}

/* ------------------------------------------------------------------ */
/*  Banner frame — wraps each 1024×1024 variation with CSS scale       */
/* ------------------------------------------------------------------ */

function BannerFrame({ label, children }: { label: string; children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const parentW = entry.contentRect.width;
      setScale(Math.min(1, parentW / SIZE));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">{label}</h3>
      <div ref={wrapRef} className="w-full flex justify-center" style={{ height: SIZE * scale }}>
        <div
          className="relative overflow-hidden rounded-lg border border-white/10"
          style={{
            width: SIZE,
            height: SIZE,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Version badge                                                      */
/* ------------------------------------------------------------------ */

function VersionBadge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-[12px] font-mono text-white/25 ${className}`}>
      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
      v0.1 - react / svg
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  A — Editor panel rising from bottom with icon grid visible         */
/* ------------------------------------------------------------------ */

function BannerEditorPanel() {
  /* Build a fake editor panel showing icons in segmented controls */
  const alignIcons = ["justify-content", "align-items"].flatMap((prop) =>
    ["flex-start", "center", "flex-end", "space-between", "stretch"].map((v) => ({ prop, value: v }))
  );

  return (
    <BannerFrame label="A — Editor panel from below">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center relative">
        <div className="relative mt-[120px] mb-5">
          <DitherGlow width={600} height={140} pixelSize={3} color="rgba(255,255,255,0.10)" />
          <h2
            className="text-[72px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>
        <p className="text-[18px] text-white/60 max-w-[560px] text-center leading-relaxed px-8 mb-auto relative">
          {TAGLINE}
        </p>

        {/* Fake editor panel rising from bottom */}
        <div className="w-[400px] rounded-t-xl border border-b-0 border-white/10 bg-[#111113] shadow-[0_-12px_60px_rgba(0,0,0,0.6)] mt-auto overflow-hidden">
          {/* Placement section */}
          <div className="px-5 pt-4 pb-1">
            <div className="flex items-center gap-1.5 mb-3">
              <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-white/30"><path d="M3 0L6 6H0z" fill="currentColor" /></svg>
              <span className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Layout</span>
            </div>
            {/* Display row */}
            <div className="mb-3">
              <span className="text-[10px] text-white/30 mb-1.5 block">Display</span>
              <div className="flex rounded-md border border-white/8 overflow-hidden">
                {(["block", "flex", "grid"] as const).map((v, i) => {
                  const icon = lookupIcon("display", v);
                  return (
                    <div
                      key={v}
                      className={`flex-1 flex items-center justify-center py-2 ${v === "flex" ? "bg-white/8 text-white" : "text-white/40"} ${i > 0 ? "border-l border-white/8" : ""}`}
                    >
                      {icon && <IconSvg icon={icon} className="w-[15px] h-[15px]" />}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Direction row */}
            <div className="mb-3">
              <span className="text-[10px] text-white/30 mb-1.5 block">Direction</span>
              <div className="flex rounded-md border border-white/8 overflow-hidden">
                {(["row", "row-reverse", "column", "column-reverse"] as const).map((v, i) => {
                  const icon = lookupIcon("flex-direction", v);
                  return (
                    <div
                      key={v}
                      className={`flex-1 flex items-center justify-center py-2 ${v === "row" ? "bg-white/8 text-white" : "text-white/40"} ${i > 0 ? "border-l border-white/8" : ""}`}
                    >
                      {icon && <IconSvg icon={icon} className="w-[15px] h-[15px]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Alignment section */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <svg viewBox="0 0 6 6" className="w-1.5 h-1.5 text-white/30"><path d="M3 0L6 6H0z" fill="currentColor" /></svg>
              <span className="text-[9px] font-semibold text-white/40 uppercase tracking-widest">Alignment</span>
            </div>
            {/* justify-content */}
            <div className="mb-3">
              <span className="text-[10px] text-white/30 mb-1.5 block">Justify content</span>
              <div className="flex rounded-md border border-white/8 overflow-hidden">
                {(["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly", "stretch"] as const).map((v, i) => {
                  const icon = lookupIcon("justify-content", v);
                  return (
                    <div
                      key={v}
                      className={`flex-1 flex items-center justify-center py-2 ${v === "center" ? "bg-white/8 text-white" : "text-white/40"} ${i > 0 ? "border-l border-white/8" : ""}`}
                    >
                      {icon && <IconSvg icon={icon} className="w-[15px] h-[15px]" />}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* align-items */}
            <div>
              <span className="text-[10px] text-white/30 mb-1.5 block">Align items</span>
              <div className="flex rounded-md border border-white/8 overflow-hidden">
                {(["flex-start", "center", "flex-end", "stretch", "baseline"] as const).map((v, i) => {
                  const icon = lookupIcon("align-items", v);
                  return (
                    <div
                      key={v}
                      className={`flex-1 flex items-center justify-center py-2 ${v === "flex-start" ? "bg-white/8 text-white" : "text-white/40"} ${i > 0 ? "border-l border-white/8" : ""}`}
                    >
                      {icon && <IconSvg icon={icon} className="w-[15px] h-[15px]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  B — Large icon grid filling the space                              */
/* ------------------------------------------------------------------ */

function BannerIconGrid() {
  /* Pick a good set of icons — enough to fill a nice grid */
  const gridEntries = allEntries.slice(0, 80);

  return (
    <BannerFrame label="B — Full icon grid">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center relative">
        {/* Title at top */}
        <div className="relative mt-16 mb-4 z-10">
          <DitherGlow width={600} height={120} pixelSize={3} color="rgba(255,255,255,0.10)" />
          <h2
            className="text-[68px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>
        <p className="text-[16px] text-white/50 max-w-[520px] text-center leading-relaxed px-8 mb-6 relative z-10">
          {TAGLINE}
        </p>

        {/* Grid of icons with graph paper background */}
        <div
          className="flex-1 w-full relative overflow-hidden"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to right, ${LINE} 0 1px, transparent 1px ${CELL}px),
              repeating-linear-gradient(to bottom, ${LINE} 0 1px, transparent 1px ${CELL}px)
            `,
            backgroundPosition: `${(SIZE % CELL) / 2}px 0`,
          }}
        >
          {/* Fade overlay at top */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#09090b] to-transparent z-10 pointer-events-none" />
          <div
            className="pt-2"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, ${CELL}px)`,
              justifyContent: "center",
            }}
          >
            {gridEntries.map((entry) => {
              const icon = lookupIcon(entry.property, entry.value);
              if (!icon) return null;
              return (
                <div
                  key={entry.icon + entry.property}
                  className="flex items-center justify-center text-white/50"
                  style={{ width: CELL, height: CELL }}
                >
                  <IconSvg icon={icon} className="w-[15px] h-[15px]" />
                </div>
              );
            })}
          </div>
        </div>

        <VersionBadge className="absolute bottom-8 z-10" />
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  C — Row of 4 large featured icons with labels                      */
/* ------------------------------------------------------------------ */

function BannerFeaturedIcons() {
  const featured = [
    { prop: "display", value: "flex", label: "display: flex" },
    { prop: "justify-content", value: "space-between", label: "justify-content" },
    { prop: "align-items", value: "center", label: "align-items" },
    { prop: "flex-direction", value: "column", label: "flex-direction" },
  ];

  return (
    <BannerFrame label="C — Four large icons">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center relative">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mb-8">
          <DitherGlow width={600} height={140} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[72px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>

        <p className="text-[17px] text-white/50 max-w-[560px] text-center leading-relaxed mb-20 px-8 relative">
          {TAGLINE}
        </p>

        {/* Four large icons */}
        <div className="flex items-center gap-24 relative">
          {featured.map(({ prop, value, label }) => {
            const icon = lookupIcon(prop, value);
            if (!icon) return null;
            return (
              <div key={label} className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 flex items-center justify-center rounded-xl border border-white/8 bg-white/[0.03]">
                  <IconSvg icon={icon} className="w-10 h-10 text-white/70" />
                </div>
                <span className="text-[11px] font-mono text-white/30">{label}</span>
              </div>
            );
          })}
        </div>

        <VersionBadge className="absolute bottom-10" />
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  D — Category grid (6 labeled sections with sample icons)           */
/* ------------------------------------------------------------------ */

function BannerCategoryGrid() {
  return (
    <BannerFrame label="D — Category grid">
      <div className="w-full h-full bg-[#09090b] flex flex-col relative">
        {/* Title */}
        <div className="flex flex-col items-center pt-[80px] pb-8 relative">
          <DitherGlow width={600} height={120} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[64px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
          <p className="text-[15px] text-white/50 max-w-[500px] text-center leading-relaxed mt-4 px-8 relative">
            {TAGLINE}
          </p>
        </div>

        {/* 3×2 category cards */}
        <div className="flex-1 flex items-center justify-center px-14 pb-14">
          <div className="grid grid-cols-3 gap-3 w-full">
            {CATEGORIES.map((cat) => {
              const catEntries = metadata.filter((e) => cat.properties.includes(e.property)).slice(0, 8);
              return (
                <div
                  key={cat.label}
                  className="rounded-lg border border-white/8 bg-white/[0.02] p-4 flex flex-col gap-3"
                >
                  <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest font-mono">
                    {cat.label}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {catEntries.map((entry) => {
                      const icon = lookupIcon(entry.property, entry.value);
                      if (!icon) return null;
                      return (
                        <div
                          key={entry.icon}
                          className="w-8 h-8 flex items-center justify-center rounded border border-white/6 text-white/50"
                        >
                          <IconSvg icon={icon} className="w-[15px] h-[15px]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <VersionBadge className="absolute bottom-8 left-1/2 -translate-x-1/2" />
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  E — Minimal hero + icon strip + install command                    */
/* ------------------------------------------------------------------ */

function BannerMinimalStrip() {
  /* Three rows of icons, staggered */
  const row1 = allEntries.slice(0, 14);
  const row2 = allEntries.slice(14, 28);
  const row3 = allEntries.slice(28, 42);

  return (
    <BannerFrame label="E — Icon rows + install">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center relative">
        {/* Graph paper */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to right, ${LINE} 0 1px, transparent 1px ${CELL}px),
              repeating-linear-gradient(to bottom, ${LINE} 0 1px, transparent 1px ${CELL}px)
            `,
            backgroundPosition: `${(SIZE % CELL) / 2}px ${(SIZE % CELL) / 2}px`,
          }}
        />

        <div className="relative mb-8">
          <DitherGlow width={700} height={160} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2
            className="text-[80px] font-normal leading-[1.0] tracking-[-0.025em] text-white text-center relative"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            {TITLE}
          </h2>
        </div>

        <p className="text-[17px] text-white/50 max-w-[560px] text-center leading-relaxed mb-12 px-8 relative">
          {TAGLINE}
        </p>

        {/* Three icon rows */}
        <div className="flex flex-col gap-2 mb-14 relative">
          {[row1, row2, row3].map((row, ri) => (
            <div key={ri} className="flex items-center gap-0" style={{ marginLeft: ri % 2 === 1 ? CELL / 2 : 0 }}>
              {row.map((entry) => {
                const icon = lookupIcon(entry.property, entry.value);
                if (!icon) return null;
                return (
                  <div
                    key={entry.icon}
                    className="flex items-center justify-center text-white/40"
                    style={{ width: CELL, height: CELL }}
                  >
                    <IconSvg icon={icon} className="w-[15px] h-[15px]" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Install command */}
        <div className="relative flex items-center gap-3 px-5 py-3 rounded-lg border border-white/8 bg-white/[0.03]">
          <span className="text-[13px] font-mono text-white/60">npm i @designtools/cascade</span>
        </div>

        <VersionBadge className="absolute bottom-8" />
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
    <BannerIconGrid key="b" />,
    <BannerFeaturedIcons key="c" />,
    <BannerCategoryGrid key="d" />,
    <BannerMinimalStrip key="e" />,
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-12 pb-8">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Internal</p>
        <h1
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] text-white"
          style={{ fontFamily: "'Jersey 25', sans-serif" }}
        >
          LinkedIn Banner — Cascade Icons
        </h1>
        <p className="text-sm text-white/40 mt-1 font-mono">1024 × 1024 — 5 variations — dark mode</p>
      </div>

      {/* Filter chips */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-8 flex items-center gap-2 flex-wrap">
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
        {["A — Editor", "B — Grid", "C — Icons", "D — Categories", "E — Rows"].map((label, i) => (
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-24 space-y-16">
        {selected !== null ? banners[selected] : banners}
      </div>
    </div>
  );
}
