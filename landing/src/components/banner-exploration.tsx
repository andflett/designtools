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
      ordered.push(
        ...metadata.filter((e) => {
          if (e.property !== prop) return false;
          const v = e.value ?? "";
          return !HIDDEN_VALUES.has(v) || HIDDEN_EXCEPTIONS.has(`${e.property}::${v}`);
        }),
      );
    }
  }
  return ordered;
}

const allEntries = orderedEntries();

/* Bayer 8×8 for dither glow */
const BAYER = [
  [0, 48, 12, 60, 3, 51, 15, 63], [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55], [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61], [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53], [42, 26, 38, 22, 41, 25, 37, 21],
].map((r) => r.map((v) => v / 64));

function DitherGlow({ width, height, pixelSize = 3, color = "rgba(255,255,255,0.12)" }: { width: number; height: number; pixelSize?: number; color?: string }) {
  const cols = Math.ceil(width / pixelSize), rows = Math.ceil(height / pixelSize);
  const cx = cols / 2, cy = rows / 2, rx = cols / 2, ry = rows / 2;
  const hash = (x: number, y: number) => { let h = (x * 374761393 + y * 668265263) >>> 0; h = ((h ^ (h >> 13)) * 1274126177) >>> 0; return (h & 0xffff) / 0xffff; };
  const rects: string[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      if (Math.max(0, 0.55 * (1 - Math.sqrt(dx * dx + dy * dy))) > BAYER[y % 8][x % 8] * 0.5 + hash(x, y) * 0.5)
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`);
    }
  const uri = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols}" height="${rows}" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges">${rects.join("")}</svg>`)}`;
  return <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width, height, backgroundImage: `url("${uri}")`, backgroundSize: `${width}px ${height}px`, backgroundRepeat: "no-repeat", imageRendering: "pixelated" }} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

const jersey = { fontFamily: "'Jersey 25', sans-serif" } as const;

function BannerFrame({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / SIZE)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">{label}</h3>
      <div ref={ref} className="w-full max-w-[1024px]">
        <div className="relative overflow-hidden rounded-lg border border-white/10 origin-top-left" style={{ width: SIZE, height: SIZE, transform: `scale(${scale})`, marginBottom: SIZE * (scale - 1) }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Badge({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-[13px] font-mono text-white/20 ${className}`}>
      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
      v0.1 — react / svg
    </span>
  );
}

function CascadeIcon({ prop, value, size = 15, className = "text-white/70" }: { prop: string; value: string | null; size?: number; className?: string }) {
  const icon = lookupIcon(prop, value);
  if (!icon) return null;
  return <IconSvg icon={icon} className={className} style={{ width: size, height: size }} />;
}

/* ------------------------------------------------------------------ */
/*  A — Centered title + single row of icons below                     */
/* ------------------------------------------------------------------ */

function BannerA() {
  const picks = [
    ["display", "flex"], ["display", "grid"], ["flex-direction", "column"],
    ["justify-content", "center"], ["align-items", "center"], ["padding", "all"],
    ["border-radius", "all"], ["text-align", "center"],
  ] as const;

  return (
    <BannerFrame label="A — Centered + icon row">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <DitherGlow width={500} height={120} pixelSize={3} color="rgba(255,255,255,0.08)" />
          <h2 className="text-[88px] font-normal leading-[1.0] tracking-[-0.03em] text-white relative" style={jersey}>{TITLE}</h2>
        </div>
        <p className="text-[18px] text-white/40 max-w-[520px] text-center leading-relaxed mb-20">{TAGLINE}</p>
        <div className="flex items-center gap-6">
          {picks.map(([p, v]) => (
            <div key={`${p}-${v}`} className="w-12 h-12 flex items-center justify-center rounded-lg border border-white/6">
              <CascadeIcon prop={p} value={v} size={20} className="text-white/40" />
            </div>
          ))}
        </div>
        <Badge className="mt-auto mb-10" />
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  B — Big single icon hero                                           */
/* ------------------------------------------------------------------ */

function BannerB() {
  return (
    <BannerFrame label="B — Big single icon">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center">
        <Badge className="mb-auto mt-10" />
        <div className="relative mb-10">
          <DitherGlow width={300} height={300} pixelSize={3} color="rgba(255,255,255,0.06)" />
          <div className="w-40 h-40 flex items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02] relative">
            <CascadeIcon prop="display" value="flex" size={72} className="text-white/60" />
          </div>
        </div>
        <h2 className="text-[88px] font-normal leading-[1.0] tracking-[-0.03em] text-white mb-5" style={jersey}>{TITLE}</h2>
        <p className="text-[18px] text-white/40 max-w-[480px] text-center leading-relaxed mb-auto">{TAGLINE}</p>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  C — Editor panel fragment                                          */
/* ------------------------------------------------------------------ */

function SegRow({ label, prop, values, active }: { label: string; prop: string; values: string[]; active: string }) {
  return (
    <div>
      <span className="text-[11px] text-white/25 mb-1.5 block">{label}</span>
      <div className="flex rounded-md border border-white/8 overflow-hidden">
        {values.map((v, i) => (
          <div key={v} className={`flex-1 flex items-center justify-center py-2.5 ${v === active ? "bg-white/8 text-white" : "text-white/30"} ${i > 0 ? "border-l border-white/8" : ""}`}>
            <CascadeIcon prop={prop} value={v} size={15} className="text-current" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerC() {
  return (
    <BannerFrame label="C — Editor panel">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center gap-16">
        <div className="text-center">
          <h2 className="text-[88px] font-normal leading-[1.0] tracking-[-0.03em] text-white mb-5" style={jersey}>{TITLE}</h2>
          <p className="text-[18px] text-white/40 max-w-[480px] mx-auto leading-relaxed">{TAGLINE}</p>
        </div>

        {/* Compact panel fragment — just 3 segmented controls */}
        <div className="w-[440px] rounded-xl border border-white/8 bg-white/[0.02] p-6 space-y-4">
          <SegRow label="Display" prop="display" values={["block", "flex", "grid", "none"]} active="flex" />
          <SegRow label="Justify content" prop="justify-content" values={["flex-start", "center", "flex-end", "space-between"]} active="center" />
          <SegRow label="Align items" prop="align-items" values={["flex-start", "center", "flex-end", "stretch", "baseline"]} active="center" />
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  D — Grid of icons, title overlaid                                  */
/* ------------------------------------------------------------------ */

function BannerD() {
  const CELL = 72;
  const cols = Math.floor(SIZE / CELL);
  const rows = Math.floor(SIZE / CELL);
  const total = cols * rows;
  /* Repeat entries to fill grid */
  const fill: IconEntry[] = [];
  while (fill.length < total) fill.push(...allEntries);

  return (
    <BannerFrame label="D — Icon wall">
      <div className="w-full h-full bg-[#09090b] relative">
        {/* Full grid of icons at low opacity */}
        <div className="absolute inset-0" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${CELL}px)`, justifyContent: "center" }}>
          {fill.slice(0, total).map((entry, i) => {
            const icon = lookupIcon(entry.property, entry.value);
            if (!icon) return <div key={i} />;
            return (
              <div key={i} className="flex items-center justify-center text-white/15 border-r border-b border-white/[0.03]" style={{ width: CELL, height: CELL }}>
                <IconSvg icon={icon} className="w-[15px] h-[15px]" />
              </div>
            );
          })}
        </div>
        {/* Radial vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, transparent 20%, #09090b 70%)" }} />
        {/* Title centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-[96px] font-normal leading-[1.0] tracking-[-0.03em] text-white" style={jersey}>{TITLE}</h2>
          <p className="text-[18px] text-white/50 mt-5 max-w-[480px] text-center leading-relaxed">{TAGLINE}</p>
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  E — Three large icons in a row, title below                        */
/* ------------------------------------------------------------------ */

function BannerE() {
  const trio = [
    { prop: "justify-content", value: "space-between", label: "justify-content" },
    { prop: "display", value: "flex", label: "display" },
    { prop: "align-items", value: "center", label: "align-items" },
  ] as const;

  return (
    <BannerFrame label="E — Three icons">
      <div className="w-full h-full bg-[#09090b] flex flex-col items-center justify-center">
        {/* Three icons */}
        <div className="flex items-center gap-16 mb-20">
          {trio.map(({ prop, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-4">
              <div className="w-28 h-28 flex items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02]">
                <CascadeIcon prop={prop} value={value} size={48} className="text-white/60" />
              </div>
              <span className="text-[12px] font-mono text-white/20">{label}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <DitherGlow width={500} height={120} pixelSize={3} color="rgba(255,255,255,0.06)" />
          <h2 className="text-[88px] font-normal leading-[1.0] tracking-[-0.03em] text-white relative" style={jersey}>{TITLE}</h2>
        </div>
        <p className="text-[18px] text-white/40 max-w-[480px] text-center leading-relaxed mt-5">{TAGLINE}</p>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function BannerExploration() {
  const [selected, setSelected] = useState<number | null>(null);
  const banners = [<BannerA key="a" />, <BannerB key="b" />, <BannerC key="c" />, <BannerD key="d" />, <BannerE key="e" />];
  const chips = ["A — Row", "B — Hero", "C — Panel", "D — Wall", "E — Trio"];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-12 pb-8">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">Internal</p>
        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] text-white" style={jersey}>
          LinkedIn Banner — Cascade Icons
        </h1>
        <p className="text-sm text-white/40 mt-1 font-mono">1024 × 1024 — 5 variations — dark mode</p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-8 flex items-center gap-2 flex-wrap">
        <button onClick={() => setSelected(null)} className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${selected === null ? "border-white/30 text-white bg-white/10" : "border-white/8 text-white/40 hover:text-white/60"}`}>All</button>
        {chips.map((label, i) => (
          <button key={label} onClick={() => setSelected(i)} className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${selected === i ? "border-white/30 text-white bg-white/10" : "border-white/8 text-white/40 hover:text-white/60"}`}>{label}</button>
        ))}
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-24 space-y-16">
        {selected !== null ? banners[selected] : banners}
      </div>
    </div>
  );
}
