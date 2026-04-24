import { useState, useRef, useEffect } from "react";
import { metadata, lookupIcon, IconSvg, type IconEntry } from "#cascade";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SIZE = 1024;
const OG_W = 1200;
const OG_H = 630;
const TITLE = "Cascade Icons";
const TAGLINE = `Icons for CSS properties. Made for design tools that speak code.`;

const CATEGORIES: { label: string; properties: string[] }[] = [
  {
    label: "Layout",
    properties: [
      "position",
      "display",
      "flex-direction",
      "flex-wrap",
      "flex-grow",
      "flex-shrink",
    ],
  },
  {
    label: "Spacing",
    properties: ["gap", "overflow", "padding", "margin", "axis", "size"],
  },
  {
    label: "Borders",
    properties: ["border-radius", "border-style", "border-width"],
  },
  {
    label: "Typography",
    properties: [
      "font-family",
      "font-size",
      "font-weight",
      "line-height",
      "letter-spacing",
      "text-align",
      "text-decoration",
      "text-transform",
    ],
  },
  { label: "Effects", properties: ["opacity", "box-shadow"] },
  {
    label: "Alignment",
    properties: [
      "justify-content",
      "align-items",
      "align-self",
      "align-content",
    ],
  },
];

const HIDDEN_VALUES = new Set([
  "none",
  "auto",
  "static",
  "nowrap",
  "start",
  "end",
]);
const HIDDEN_EXCEPTIONS = new Set(["display::none"]);

function orderedEntries(): IconEntry[] {
  const ordered: IconEntry[] = [];
  for (const cat of CATEGORIES) {
    for (const prop of cat.properties) {
      ordered.push(
        ...metadata.filter((e) => {
          if (e.property !== prop) return false;
          const v = e.value ?? "";
          return (
            !HIDDEN_VALUES.has(v) ||
            HIDDEN_EXCEPTIONS.has(`${e.property}::${v}`)
          );
        }),
      );
    }
  }
  return ordered;
}

const allEntries = orderedEntries();

/* Bayer 8×8 for dither glow */
const BAYER = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
].map((r) => r.map((v) => v / 64));

function DitherGlow({
  width,
  height,
  pixelSize = 3,
  color = "rgba(255,255,255,0.12)",
}: {
  width: number;
  height: number;
  pixelSize?: number;
  color?: string;
}) {
  const cols = Math.ceil(width / pixelSize),
    rows = Math.ceil(height / pixelSize);
  const cx = cols / 2,
    cy = rows / 2,
    rx = cols / 2,
    ry = rows / 2;
  const hash = (x: number, y: number) => {
    let h = (x * 374761393 + y * 668265263) >>> 0;
    h = ((h ^ (h >> 13)) * 1274126177) >>> 0;
    return (h & 0xffff) / 0xffff;
  };
  const rects: string[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const dx = (x - cx) / rx,
        dy = (y - cy) / ry;
      if (
        Math.max(0, 0.55 * (1 - Math.sqrt(dx * dx + dy * dy))) >
        BAYER[y % 8][x % 8] * 0.5 + hash(x, y) * 0.5
      )
        rects.push(
          `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`,
        );
    }
  const uri = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${cols}" height="${rows}" viewBox="0 0 ${cols} ${rows}" shape-rendering="crispEdges">${rects.join("")}</svg>`)}`;
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width,
        height,
        backgroundImage: `url("${uri}")`,
        backgroundSize: `${width}px ${height}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

const jersey = { fontFamily: "'Jersey 25', sans-serif" } as const;

function BannerFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setScale(Math.min(1, e.contentRect.width / SIZE)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">
        {label}
      </h3>
      <div ref={ref} className="w-full max-w-[1024px]">
        <div
          className="relative overflow-hidden rounded-lg border border-white/10 origin-top-left"
          style={{
            width: SIZE,
            height: SIZE,
            transform: `scale(${scale})`,
            marginBottom: SIZE * (scale - 1),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function OgFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setScale(Math.min(1, e.contentRect.width / OG_W)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-sm font-mono text-white/50 uppercase tracking-widest">
        {label}
      </h3>
      <div ref={ref} className="w-full max-w-[1200px]">
        <div
          className="relative overflow-hidden rounded-lg border border-white/10 origin-top-left"
          style={{
            width: OG_W,
            height: OG_H,
            transform: `scale(${scale})`,
            marginBottom: OG_H * (scale - 1),
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Badge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`flex items-center gap-2 text-[13px] font-mono text-white/20 ${className}`}
    >
      <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
      v0.1 — react / svg
    </span>
  );
}

function CascadeIcon({
  prop,
  value,
  size = 15,
  className = "text-white/70",
}: {
  prop: string;
  value: string | null;
  size?: number;
  className?: string;
}) {
  const icon = lookupIcon(prop, value);
  if (!icon) return null;
  return <IconSvg icon={icon} className={className} />;
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
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
            justifyContent: "center",
          }}
        >
          {fill.slice(0, total).map((entry, i) => {
            const icon = lookupIcon(entry.property, entry.value);
            if (!icon) return <div key={i} />;
            return (
              <div
                key={i}
                className="flex items-center justify-center text-white/20 border-r border-b border-white/[0.04]"
                style={{ width: CELL, height: CELL }}
              >
                <IconSvg icon={icon} className="w-[15px] h-[15px]" />
              </div>
            );
          })}
        </div>
        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, #09090b 80%)",
          }}
        />
        {/* Title centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2
            className="text-[126px] font-normal leading-[1] text-white"
            style={jersey}
          >
            {TITLE}
          </h2>
          <p className="text-[30px] text-white/90 font-medium mt-4 max-w-[550px] text-center leading-snug">
            {TAGLINE}
          </p>
          <div className="mt-9 inline-flex items-center gap-3 px-8 py-4 rounded-lg border border-white/10 bg-[#09090b]">
            <span className="text-[22px] font-mono text-white/70">
              npm i @designtools/cascade
            </span>
          </div>
        </div>
      </div>
    </BannerFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  D-OG — OG image version of D (1200×630)                            */
/* ------------------------------------------------------------------ */

function BannerDOg() {
  const CELL = 72;
  const cols = Math.floor(OG_W / CELL);
  const rows = Math.ceil(OG_H / CELL);
  const total = cols * rows;
  const fill: IconEntry[] = [];
  while (fill.length < total) fill.push(...allEntries);

  return (
    <OgFrame label="D — Icon wall (OG 1200×630)">
      <div className="w-full h-full bg-[#09090b] relative">
        {/* Full grid of icons at low opacity */}
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
            justifyContent: "center",
          }}
        >
          {fill.slice(0, total).map((entry, i) => {
            const icon = lookupIcon(entry.property, entry.value);
            if (!icon) return <div key={i} />;
            return (
              <div
                key={i}
                className="flex items-center justify-center text-white/35 border-r border-b border-white/[0.04]"
                style={{ width: CELL, height: CELL }}
              >
                <IconSvg icon={icon} className="w-[15px] h-[15px]" />
              </div>
            );
          })}
        </div>
        {/* Radial vignette — wider ellipse for landscape, fades closer to edge */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at center, transparent 35%, #09090b 60%)",
          }}
        />
        {/* Title centred */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2
            className="text-[100px] font-normal leading-[1] text-white"
            style={jersey}
          >
            {TITLE}
          </h2>
          <p className="text-[34px] text-white/90 font-medium mt-3 max-w-[600px] text-center leading-snug">
            {TAGLINE}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-white/10 bg-[#18181b]">
            <span className="text-[22px] font-mono text-white">
              npm i @designtools/cascade
            </span>
          </div>
        </div>
      </div>
    </OgFrame>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function BannerExploration() {
  const [selected, setSelected] = useState<number | null>(null);
  const [cssScale, setCssScale] = useState(1);
  const banners = [<BannerD key="d" />, <BannerDOg key="d-og" />];
  const chips = ["D — Wall", "D — OG"];

  return (
    <div className="min-h-screen bg-[#18181b] text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-12 pb-8">
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
          Internal
        </p>
        <h1
          className="text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] text-white"
          style={jersey}
        >
          LinkedIn Banner — Cascade Icons
        </h1>
        <p className="text-sm text-white/40 mt-1 font-mono">
          D variants — dark mode
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-8 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelected(null)}
            className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${selected === null ? "border-white/30 text-white bg-white/10" : "border-white/8 text-white/40 hover:text-white/60"}`}
          >
            All
          </button>
          {chips.map((label, i) => (
            <button
              key={label}
              onClick={() => setSelected(i)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-md border transition-colors cursor-pointer ${selected === i ? "border-white/30 text-white bg-white/10" : "border-white/8 text-white/40 hover:text-white/60"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-[11px] font-mono text-white/40">Scale</span>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={cssScale}
            onChange={(e) => setCssScale(Number(e.target.value))}
            className="w-32 accent-white/60"
          />
          <span className="text-[11px] font-mono text-white/50 w-10 text-right">
            {Math.round(cssScale * 100)}%
          </span>
        </div>
      </div>

      <div
        className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-24 space-y-16"
        style={{
          transform: `scale(${cssScale})`,
          transformOrigin: "top center",
        }}
      >
        {selected !== null ? banners[selected] : banners}
      </div>
    </div>
  );
}
