import "./cascade.css";
import { useState, useEffect, useCallback, useRef } from "react";
import clsx from "clsx";
import { Sun, Moon, Copy, Check } from "lucide-react";
import { useTheme, toggleTheme } from "../theme.js";
import { DitherGlow } from "./dither-glow.js";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
} from "./cascade-tooltip";
import {
  metadata,
  lookupIcon,
  IconSvg,
  iconToSvgString,
  PV_BG as _PV_BG,
  PV_LABEL_COLOR as _PV_LABEL_COLOR,
  type CascadeIcon,
  type IconEntry,
} from "#cascade";

// Override package defaults — stronger control backgrounds, visible labels
const PV_BG = "bg-[color:var(--color-muted)]";
const PV_LABEL_COLOR = "text-[color:var(--color-ink2)]";

/* ═══════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════ */

const GitHubIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const NpmIcon = () => (
  <svg className="w-[18px] h-[18px]" viewBox="0 0 256 256" fill="currentColor">
    <path d="M0 256V0h256v256H0zm41-41h43.7v-131H128v131h87V41H41v174z" />
  </svg>
);

function ThemeToggle() {
  const theme = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center text-white/50 hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function CascadeNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
        <span className="text-[13px] font-mono flex items-center gap-0">
          <span className="text-white/30">@designtools/</span>
          <span className="text-white">cascade</span>
          <span className="text-white/20 mx-1.5">/</span>
          <a href="/" className="text-white/30 hover:text-white/60 transition-colors">surface</a>
        </span>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <a
            href="https://github.com/andflett/cascade"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center text-white/50 hover:text-white transition-colors"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.npmjs.com/package/@designtools/cascade"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center text-white/50 hover:text-white transition-colors"
            title="npm"
          >
            <NpmIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   ICON GRID (left column)
   ═══════════════════════════════════════════════════════ */

/** Category grouping — controls icon ordering in the grid. */
const CATEGORIES: { label: string; properties: string[] }[] = [
  { label: "Layout", properties: ["position", "display", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink", "overflow"] },
  { label: "Alignment", properties: ["justify-content", "align-items", "align-self", "align-content"] },
  { label: "Spacing", properties: ["gap", "size", "padding", "margin", "axis"] },
  { label: "Borders", properties: ["border-radius", "border-style", "border-width"] },
  { label: "Typography", properties: ["font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "text-decoration", "text-transform"] },
  { label: "Effects", properties: ["opacity", "box-shadow"] },
];

/** Build flat ordered list of metadata entries for the grid. */
function orderedEntries(): IconEntry[] {
  const ordered: IconEntry[] = [];
  for (const cat of CATEGORIES) {
    for (const prop of cat.properties) {
      const matches = metadata.filter((e) => e.property === prop);
      ordered.push(...matches);
    }
  }
  return ordered;
}

/* ── Copy button ── */

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  }, [text]);

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium rounded-md transition-all cursor-pointer",
        copied
          ? "bg-green-500/10 text-green-600 dark:text-green-400"
          : "bg-ink/5 dark:bg-white/8 text-ink2 hover:text-ink hover:bg-ink/10 dark:hover:bg-white/15",
        className,
      )}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy SVG"}
    </button>
  );
}

/* ── Icon popover (rendered inside a bordered grid cell) ── */

const CELL = 64; // px — grid cell size
const ICON_COLS = 12; // fixed icon columns per row

function IconCellContent({ entry }: { entry: IconEntry }) {
  const [open, setOpen] = useState(false);
  const icon = lookupIcon(entry.property, entry.value);
  if (!icon) return null;

  const hasValue = entry.value !== null;
  const importStatement = `import { ${entry.icon} } from "@designtools/cascade"`;

  return (
    <div className="relative w-full h-full">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={clsx(
              "flex items-center justify-center w-full h-full transition-colors cursor-pointer",
              open
                ? "bg-ink text-page"
                : "text-ink hover:bg-ink/[0.04] dark:hover:bg-white/[0.06]",
            )}
          >
            <IconSvg icon={icon} className="w-[15px] h-[15px]" />
          </button>
        </TooltipTrigger>
        {!open && (
          <TooltipContent side="bottom" className="font-mono">
            {hasValue ? `${entry.property}: ${entry.value}` : entry.property}
            <TooltipArrow />
          </TooltipContent>
        )}
      </Tooltip>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 bg-page border border-edge rounded-xl shadow-xl overflow-hidden w-[220px] animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-center bg-muted/50 p-6">
              <IconSvg icon={icon} className="w-16 h-16" />
            </div>
            <div className="p-3 space-y-2">
              <div>
                <p className="text-[10px] text-ink3 font-mono">{entry.property}</p>
                <p className="text-[13px] font-semibold font-mono">{hasValue ? entry.value : entry.icon}</p>
              </div>
              <code className="block text-[10px] font-mono text-ink3 bg-muted rounded-md px-2 py-1.5 truncate" title={importStatement}>
                {importStatement}
              </code>
              <CopyButton text={iconToSvgString(icon)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Canvas grid ──
   A real bordered grid that fills the content area. Icons sit in cells;
   empty cells extend the canvas beyond. Three tiers of border weight
   (fine / medium / bold) create the graph-paper effect.
   ─────────────────────────────────────────────────────────────────── */

// 3-tier line colors via color-mix — auto dark mode, kept subtle
const LINE_FINE = "color-mix(in srgb, var(--color-ink) 4%, transparent)";
const LINE_MED  = "color-mix(in srgb, var(--color-ink) 5%, transparent)";
const LINE_BOLD = "color-mix(in srgb, var(--color-ink) 6%, transparent)";

/** Line color based on distance from icon grid origin — bold every 4, medium every 2 */
function lineColor(relIndex: number): string {
  if (relIndex % 4 === 0) return LINE_BOLD;
  if (relIndex % 2 === 0) return LINE_MED;
  return LINE_FINE;
}

function CanvasGrid({ entries, padTop = 1, panelWidth = 0 }: {
  entries: IconEntry[];
  padTop?: number;
  panelWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cols: 20, iconStartCol: 2, totalRows: 20 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const vw = window.innerWidth;
      const totalCols = Math.max(1, Math.ceil(vw / CELL));
      const rect = el.getBoundingClientRect();
      const startCol = Math.max(0, Math.round(rect.left / CELL));
      const iconRows = Math.ceil(entries.length / ICON_COLS);
      const rows = padTop + iconRows + 4;
      setLayout({ cols: totalCols, iconStartCol: startCol, totalRows: rows });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [panelWidth, entries.length, padTop]);

  const { cols, iconStartCol, totalRows } = layout;
  const iconRows = Math.ceil(entries.length / ICON_COLS);
  const totalCells = cols * totalRows;

  return (
    <div ref={containerRef} className="relative">
      {/* Break out to full viewport width */}
      <div
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL}px)`,
          borderTop: `1px solid ${LINE_FINE}`,
          borderLeft: `1px solid ${LINE_FINE}`,
        }}
      >
        {Array.from({ length: totalCells }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);

          // Map cell to icon: icons start at (padTop, iconStartCol)
          let entry: IconEntry | null = null;
          if (
            row >= padTop && row < padTop + iconRows &&
            col >= iconStartCol && col < iconStartCol + ICON_COLS
          ) {
            const iconIdx = (row - padTop) * ICON_COLS + (col - iconStartCol);
            if (iconIdx < entries.length) entry = entries[iconIdx];
          }

          // Line weights relative to icon grid origin
          const relCol = col - iconStartCol + 1;
          const relRow = row - padTop + 1;
          const rightColor = lineColor(relCol);
          const bottomColor = lineColor(relRow);

          return (
            <div
              key={i}
              style={{
                width: CELL,
                height: CELL,
                borderRight: `1px solid ${rightColor}`,
                borderBottom: `1px solid ${bottomColor}`,
              }}
            >
              {entry && <IconCellContent entry={entry} />}
            </div>
          );
        })}
      </div>
      {/* Fade in top of grid — full viewport width */}
      <div
        className="absolute top-0 pointer-events-none"
        style={{
          height: CELL * 2,
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          background: "linear-gradient(to top, transparent, var(--color-page) 160%)",
        }}
      />
      {/* Fade out bottom of grid — full viewport width */}
      <div
        className="absolute bottom-0 pointer-events-none"
        style={{
          height: CELL * 3.5,
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          background: "linear-gradient(to bottom, transparent, var(--color-page) 85%)",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTERACTIVE EDITOR PANEL
   ═══════════════════════════════════════════════════════ */

type Position = "static" | "relative" | "absolute" | "fixed" | "sticky";
type Display = "block" | "inline" | "inline-block" | "flex" | "inline-flex" | "grid" | "inline-grid" | "none";
type Direction = "row" | "row-reverse" | "column" | "column-reverse";
type Wrap = "nowrap" | "wrap" | "wrap-reverse";

const DIST_VALUES = ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly", "stretch"] as const;
const AI_VALUES = ["flex-start", "center", "flex-end", "stretch", "baseline"] as const;
const AS_VALUES = ["auto", "flex-start", "center", "flex-end", "stretch", "baseline"] as const;
const AC_VALUES = ["flex-start", "center", "flex-end", "space-between", "space-around", "stretch"] as const;

const VALUE_HINTS: Record<string, Record<string, string>> = {
  "justify-content": {
    "flex-start": "Pack items toward the start",
    center: "Center items on the main axis",
    "flex-end": "Pack items toward the end",
    "space-between": "Equal space between items, none at edges",
    "space-around": "Equal space around each item",
    "space-evenly": "Equal space everywhere",
    stretch: "Stretch items to fill the axis",
  },
  "align-items": {
    "flex-start": "Align to the start of the cross axis",
    center: "Center on the cross axis",
    "flex-end": "Align to the end of the cross axis",
    stretch: "Stretch to fill the cross axis",
    baseline: "Align along text baselines",
  },
  "align-self": {
    auto: "Use the parent's align-items value",
    "flex-start": "Push this item to the start",
    center: "Center this item on the cross axis",
    "flex-end": "Push this item to the end",
    stretch: "Stretch this item to fill",
    baseline: "Align this item to text baseline",
  },
  "align-content": {
    "flex-start": "Pack rows toward the start",
    center: "Center rows in the container",
    "flex-end": "Pack rows toward the end",
    "space-between": "Equal space between rows",
    "space-around": "Equal space around each row",
    stretch: "Stretch rows to fill the container",
  },
};

type LayoutContext = { display: Display; direction: Direction; wrap: Wrap };
const DEFAULT_CTX: LayoutContext = { display: "flex", direction: "row", wrap: "nowrap" };

/** Tiny live CSS layout preview showing the effect of a value. */
function LayoutPreview({ property, value, width: w = 108, ctx = DEFAULT_CTX }: { property: string; value: string; width?: number; ctx?: LayoutContext }) {
  const isCol = ctx.direction.startsWith("column");
  const isGrid = ctx.display === "grid" || ctx.display === "inline-grid";
  const isAC = property === "align-content";

  const baseW = isCol && !isAC ? Math.round(w * 0.5) : w;
  const baseH = isCol && !isAC ? Math.round(w * 0.9) : (isAC ? 72 : 48);

  const base: React.CSSProperties = {
    display: isGrid ? "grid" : "flex",
    ...(!isGrid && { flexDirection: isCol ? "column" : "row" }),
    ...(isGrid && { gridTemplateColumns: "repeat(3, auto)", justifyContent: "start" }),
    width: baseW, height: baseH,
    borderRadius: 6, border: "1px dashed", borderColor: "var(--color-edge)",
    background: "color-mix(in oklab, var(--color-ink) 4%, transparent)",
    padding: 3, gap: 2, overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const fill = "color-mix(in oklab, var(--color-ink) 15%, transparent)";
  const selfFill = "color-mix(in oklab, var(--color-ink) 30%, transparent)";

  const m = (v: number) => isCol ? { height: v } : { width: v };
  const c = (v: number | string) => isCol ? { width: v as any } : { height: v as any };
  const mFull = isCol ? { width: "100%" as const } : { height: "100%" as const };

  const box = (main: number, cross: number | string, extra?: React.CSSProperties): React.CSSProperties => ({
    ...m(main), ...c(cross), borderRadius: 3, background: fill,
    flexShrink: 0, transition: "all 0.3s ease", ...extra,
  });

  const selfBox = (main: number, cross: number | string, extra?: React.CSSProperties): React.CSSProperties => ({
    ...box(main, cross, extra), background: selfFill,
  });

  let style = { ...base };
  let items: React.CSSProperties[];

  const s1 = 18, s2 = 12, s3 = 22;
  const ch = isCol ? baseW - 6 : baseH - 6;
  const c1 = Math.round(ch * 0.7), c2 = Math.round(ch * 0.45), c3 = Math.round(ch * 0.55);

  switch (property) {
    case "justify-content":
      style.justifyContent = value;
      if (isGrid) { style.justifyContent = value; delete (style as any).gridTemplateColumns; style.gridAutoFlow = "column"; }
      items = value === "stretch"
        ? [box(0, "100%", { flex: 1, ...mFull }), box(0, "100%", { flex: 1, ...mFull }), box(0, "100%", { flex: 1, ...mFull })]
        : [box(s1, "100%", mFull), box(s2, "100%", mFull), box(s3, "100%", mFull)];
      break;
    case "align-items":
      style.alignItems = value;
      items = value === "stretch"
        ? [box(s1, "auto"), box(s2, "auto"), box(s3, "auto")]
        : [box(s1, c1), box(s2, c2), box(s3, c3)];
      break;
    case "align-self":
      style.alignItems = "flex-start";
      items = [
        box(s1, c3),
        value === "stretch"
          ? selfBox(s2, "auto", { alignSelf: "stretch" })
          : selfBox(s2, c2, { alignSelf: value === "auto" ? undefined : value as any }),
        box(s3, c3),
      ];
      break;
    case "align-content": {
      if (isGrid) {
        style.display = "grid";
        style.gridTemplateColumns = "repeat(3, auto)";
        style.alignContent = value;
        delete (style as any).flexWrap;
      } else {
        style.flexWrap = "wrap";
        style.alignContent = value;
      }
      const cw = Math.round(baseW * 0.25);
      items = value === "stretch"
        ? [box(cw, "auto"), box(cw - 4, "auto"), box(cw + 4, "auto"), box(cw - 2, "auto"), box(cw + 2, "auto")]
        : [box(cw, 14), box(cw - 4, 14), box(cw + 4, 14), box(cw - 2, 14), box(cw + 2, 14)];
      break;
    }
    default:
      items = [];
  }

  return (
    <div style={style}>
      {items.map((s, i) => <div key={i} style={s} />)}
    </div>
  );
}

/** Animated property explainer — cycles through values showing the effect. */
function PropertyExplainer({ property, ctx, onClose }: { property: string; ctx: LayoutContext; onClose: () => void }) {
  const explainer = getExplainer(property, ctx);
  if (!explainer) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const values = explainer.values;
  const value = values[activeIndex];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % values.length);
    }, 1500);
    return () => clearInterval(id);
  }, [playing, values.length]);

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[color:var(--color-page)] border border-[color:var(--color-edge)] rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
        <div className="p-3 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-[12px] font-semibold font-mono">{explainer.title}</h4>
              <p className="text-[10px] text-[color:var(--color-ink3)] leading-relaxed mt-0.5">{explainer.description}</p>
            </div>
            <button type="button" onClick={onClose} className="text-[color:var(--color-ink3)] hover:text-[color:var(--color-ink)] shrink-0 mt-0.5 cursor-pointer">
              <svg viewBox="0 0 15 15" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l7 7M11 4l-7 7" /></svg>
            </button>
          </div>
          <div className="flex justify-center">
            <LayoutPreview property={property} value={value} width={200} ctx={ctx} />
          </div>
          <div className="flex flex-wrap gap-1">
            {values.map((v, i) => (
              <button
                key={v}
                type="button"
                onClick={() => { setActiveIndex(i); setPlaying(false); }}
                className={clsx(
                  "px-2 py-0.5 text-[10px] rounded-md transition-all cursor-pointer",
                  i === activeIndex
                    ? "bg-[color:var(--color-ink)] text-[color:var(--color-page)] font-medium"
                    : "bg-[color:var(--color-muted)] text-[color:var(--color-ink3)] hover:text-[color:var(--color-ink)]",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-[color:var(--color-ink3)] leading-relaxed min-h-[28px]">
            {VALUE_HINTS[property]?.[value] ?? ""}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPlaying(!playing)}
              className="text-[10px] text-[color:var(--color-ink3)] hover:text-[color:var(--color-ink)] cursor-pointer flex items-center gap-1"
            >
              {playing ? (
                <><svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor"><rect x="2" y="2" width="3" height="8" rx="0.5" /><rect x="7" y="2" width="3" height="8" rx="0.5" /></svg> Pause</>
              ) : (
                <><svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor"><path d="M3 1.5l7 4.5-7 4.5z" /></svg> Play</>
              )}
            </button>
            <span className="text-[10px] text-[color:var(--color-ink3)]/50">{activeIndex + 1} / {values.length}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function getExplainer(property: string, ctx: LayoutContext): { title: string; description: string; values: readonly string[] } | null {
  const isCol = ctx.direction.startsWith("column");
  const isGrid = ctx.display === "grid" || ctx.display === "inline-grid";
  const mainAxis = isGrid ? "inline (horizontal)" : isCol ? "vertical" : "horizontal";
  const crossAxis = isGrid ? "block (vertical)" : isCol ? "horizontal" : "vertical";

  switch (property) {
    case "justify-content":
      return {
        title: "justify-content",
        description: isGrid
          ? `Distributes columns along the inline axis (${mainAxis}).`
          : `Distributes items along the main axis (${mainAxis}).`,
        values: DIST_VALUES,
      };
    case "align-items":
      return {
        title: "align-items",
        description: isGrid
          ? `Aligns items within their grid cell along the block axis (${crossAxis}).`
          : `Aligns all items along the cross axis (${crossAxis}).`,
        values: AI_VALUES,
      };
    case "align-self":
      return {
        title: "align-self",
        description: isGrid
          ? `Overrides align-items for one child within its grid cell (${crossAxis} axis).`
          : `Overrides align-items for one child on the cross axis (${crossAxis}).`,
        values: AS_VALUES,
      };
    case "align-content":
      return {
        title: "align-content",
        description: isGrid
          ? `Distributes grid rows along the block axis (${crossAxis}).`
          : `Distributes wrapped lines along the cross axis (${crossAxis}).`,
        values: AC_VALUES,
      };
    default:
      return null;
  }
}

/* ── Shared editor panel sub-components ── */

/** Segmented toggle with overflow dropdown. */
/** Look up icon by property+value, with fallback to treat value as a property name. */
function resolve(property: string, value: string): CascadeIcon | undefined {
  return lookupIcon(property, value) ?? lookupIcon(value, null);
}

function SegmentedIcons({ property, values, rotate = 0, maxVisible = 4, layoutProperty, layoutCtx }: {
  property: string;
  values: readonly string[];
  rotate?: number;
  maxVisible?: number;
  layoutProperty?: string;
  layoutCtx?: LayoutContext;
}) {
  const [selected, setSelected] = useState(values[0]);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const hasOverflow = values.length > maxVisible;
  const visible = hasOverflow ? values.slice(0, maxVisible) : values;
  const overflow = hasOverflow ? values.slice(maxVisible) : [];

  return (
    <div className="relative">
      <div className={clsx("flex w-full rounded-lg p-1 gap-1", PV_BG)}>
        {visible.map((v) => {
          const icon = resolve(property, v);
          if (!icon) return null;
          const active = selected === v;
          return (
            <Tooltip key={v}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setSelected(v)}
                  className={clsx(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all cursor-pointer",
                    "text-[color:var(--color-ink)]/30 hover:text-[color:var(--color-ink)]/40 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                    active && "!text-[color:var(--color-ink)] bg-black/[0.06] dark:bg-white/[0.08] dark:shadow-sm",
                    "focus-visible:outline-none",
                  )}
                >
                  <IconSvg icon={icon} rotate={rotate} className="w-[15px] h-[15px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className={layoutProperty ? "!bg-[color:var(--color-page)] !text-[color:var(--color-ink)] border border-[color:var(--color-edge)] p-0 rounded-xl overflow-hidden w-[140px] shadow-lg" : "text-xs px-2 py-1 rounded-md"}>
                {layoutProperty ? (
                  <div>
                    <div className="p-2 pb-1.5">
                      <LayoutPreview property={layoutProperty} value={v} ctx={layoutCtx} />
                    </div>
                    <div className="px-2.5 pb-2 space-y-0.5">
                      <div className="text-[11px] font-medium">{v}</div>
                      {VALUE_HINTS[layoutProperty]?.[v] && (
                        <div className="text-[10px] text-[color:var(--color-ink3)] leading-tight">{VALUE_HINTS[layoutProperty][v]}</div>
                      )}
                    </div>
                  </div>
                ) : v}
                <TooltipArrow className={layoutProperty ? "!fill-[color:var(--color-page)]" : ""} />
              </TooltipContent>
            </Tooltip>
          );
        })}
        {hasOverflow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setOverflowOpen(!overflowOpen)}
                className={clsx(
                  "flex items-center justify-center rounded-md py-1.5 pl-1.5 pr-2 transition-all cursor-pointer",
                  "text-[color:var(--color-ink)]/30 hover:text-[color:var(--color-ink)]/40 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                  overflow.includes(selected) && "!text-[color:var(--color-ink)] bg-black/[0.06] dark:bg-white/[0.08] dark:shadow-sm",
                  "focus-visible:outline-none",
                )}
              >
                <svg viewBox="0 0 15 15" className="w-[15px] h-[15px]" fill="currentColor">
                  <circle cx="3" cy="7.5" r="1" />
                  <circle cx="7.5" cy="7.5" r="1" />
                  <circle cx="12" cy="7.5" r="1" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs px-2 py-1 rounded-md">
              More options
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        )}
        {overflowOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOverflowOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 bg-[color:var(--color-raised)] border border-[color:var(--color-edge)] rounded-lg shadow-lg p-1 min-w-[160px] animate-in fade-in-0 zoom-in-95">
              {overflow.map((v) => {
                const icon = resolve(property, v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setSelected(v); setOverflowOpen(false); }}
                    className={clsx(
                      "w-full flex items-center gap-2.5 px-2 py-1.5 text-[11px] rounded-md transition-colors cursor-pointer",
                      "text-[color:var(--color-ink3)] hover:bg-[color:var(--color-muted)]",
                      selected === v && "bg-[color:var(--color-muted)]",
                    )}
                  >
                    {icon && <IconSvg icon={icon} className="w-[15px] h-[15px] shrink-0" />}
                    <span className="flex-1 text-left">{v}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Consistent label → control wrapper. */
function ControlLabel({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-0.5">
      <div className={clsx("text-[10px] font-medium capitalize", PV_LABEL_COLOR)}>{children}</div>
      {actions}
    </div>
  );
}

function LabelledControl({ label, actions, children }: { label: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <ControlLabel actions={actions}>{label}</ControlLabel>
      {children}
    </div>
  );
}

/** Fake values for the interactive demo — keyed by "property/value". */
const FAKE_VALUES: Record<string, string> = {
  "gap/column": "8px", "gap/row": "8px",
  "size/horizontal": "auto", "size/vertical": "auto",
  "padding/all": "16px", "padding/top": "16px", "padding/right": "16px", "padding/bottom": "16px", "padding/left": "16px",
  "margin/all": "0px", "margin/top": "0px", "margin/right": "auto", "margin/bottom": "0px", "margin/left": "auto",
  "border-radius/all": "8px", "border-radius/top-left": "8px", "border-radius/top-right": "8px", "border-radius/bottom-right": "8px", "border-radius/bottom-left": "8px",
  "border-style": "solid",
  "border-width": "1px",
  "font-family": "Inter", "font-size": "14px", "font-weight": "400", "line-height": "1.5", "letter-spacing": "0em",
  "opacity": "100%",
  "box-shadow": "0 1px 3px",
};

function fakeValue(property: string, value?: string | null): string {
  if (value) return FAKE_VALUES[`${property}/${value}`] ?? FAKE_VALUES[property] ?? "auto";
  return FAKE_VALUES[property] ?? "auto";
}

function FakeInput({ property, value }: { property: string; value?: string | null }) {
  const icon = lookupIcon(property, value || null);
  return (
    <div className={clsx("flex items-center gap-2 rounded-md px-2 py-1.5", PV_BG)}>
      <span className="shrink-0 text-[color:var(--panel-icon-muted)]"><IconSvg icon={icon} className="w-3.5 h-3.5" /></span>
      <span className="flex-1 text-[11px] text-[color:var(--color-ink)] truncate">{fakeValue(property, value)}</span>
      <svg viewBox="0 0 15 15" className="w-3 h-3 shrink-0" style={{ color: "var(--panel-icon-muted)", opacity: 0.5 }} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l3.5 3.5L11 6" /></svg>
    </div>
  );
}

function LabelledFakeInput({ label, property, value }: { label: string; property: string; value?: string | null }) {
  return (
    <LabelledControl label={label}>
      <FakeInput property={property} value={value} />
    </LabelledControl>
  );
}

function InputPairSection({ pairs }: { pairs: { property: string; value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {pairs.map((p) => (
        <LabelledFakeInput key={`${p.property}/${p.value}`} label={p.label} property={p.property} value={p.value} />
      ))}
    </div>
  );
}

function DirectionalSection({ label, property, sides: customSides }: { label: string; property: string; sides?: { value: string; label: string }[] }) {
  const [expanded, setExpanded] = useState(false);
  const allIcon = lookupIcon(property, "all");
  const sides = customSides ?? [
    { value: "top", label: "top" },
    { value: "right", label: "right" },
    { value: "bottom", label: "bottom" },
    { value: "left", label: "left" },
  ];

  const expandAction = (
    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      className={clsx(
        "w-5 h-5 flex items-center justify-center rounded transition-colors cursor-pointer text-[color:var(--panel-icon-muted)]",
        expanded ? "bg-[color:var(--color-muted)]" : "hover:text-[color:var(--color-ink3)]",
      )}
      title={expanded ? "Show single input" : "Show all sides"}
    >
      {allIcon ? (
        <IconSvg icon={allIcon} className="w-3.5 h-3.5" />
      ) : (
        <svg viewBox="0 0 15 15" className="w-3.5 h-3.5" fill="currentColor"><rect x="1" y="1" width="5" height="5" /><rect x="9" y="1" width="5" height="5" /><rect x="1" y="9" width="5" height="5" /><rect x="9" y="9" width="5" height="5" /></svg>
      )}
    </button>
  );

  return (
    <LabelledControl label={label} actions={expandAction}>
      {expanded ? (
        <div className="grid grid-cols-2 gap-2">
          {sides.map((s) => (
            <LabelledFakeInput key={s.value} label={s.label} property={property} value={s.value} />
          ))}
        </div>
      ) : (
        <FakeInput property={property} value="all" />
      )}
    </LabelledControl>
  );
}

function InputSection({ label, property, value }: { label: string; property: string; value?: string | null }) {
  return (
    <LabelledControl label={label}>
      <FakeInput property={property} value={value} />
    </LabelledControl>
  );
}

function PropertySection({ label, property, values, rotate = 0, layoutProperty, layoutCtx }: {
  label: string;
  property: string;
  values: readonly string[];
  rotate?: number;
  layoutProperty?: string;
  layoutCtx?: LayoutContext;
}) {
  const [explainerProp, setExplainerProp] = useState<string | null>(null);

  return (
    <div className="relative">
      <LabelledControl
        label={label}
        actions={layoutProperty ? (
          <button
            type="button"
            onClick={() => setExplainerProp(explainerProp ? null : layoutProperty)}
            className="w-4 h-4 flex items-center justify-center rounded text-[color:var(--color-ink3)]/40 hover:text-[color:var(--color-ink3)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="6" cy="6" r="5" /><path d="M6 5.5V8.5M6 3.5V4" /></svg>
          </button>
        ) : undefined}
      >
        <SegmentedIcons property={property} values={values} rotate={rotate} layoutProperty={layoutProperty} layoutCtx={layoutCtx} />
      </LabelledControl>
      {explainerProp && <PropertyExplainer property={explainerProp} ctx={layoutCtx ?? DEFAULT_CTX} onClose={() => setExplainerProp(null)} />}
    </div>
  );
}

function IconToggle<T extends string>({ label, property, options, value, onChange, disabled, maxVisible }: {
  label: string;
  property: string;
  options: T[];
  value: T;
  onChange?: (v: T) => void;
  disabled?: boolean;
  maxVisible?: number;
}) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const hasOverflow = maxVisible != null && options.length > maxVisible;
  const visible = hasOverflow ? options.slice(0, maxVisible) : options;
  const overflow = hasOverflow ? options.slice(maxVisible) : [];

  return (
    <LabelledControl label={label}>
      <div className={clsx("flex rounded-lg p-1 gap-1 relative", PV_BG, disabled && "opacity-60")}>
        {visible.map((opt) => {
          const icon = lookupIcon(property, opt);
          if (!icon) return null;
          const active = value === opt;
          return (
            <Tooltip key={opt}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange?.(opt)}
                  disabled={disabled}
                  className={clsx(
                    "flex-1 flex items-center justify-center py-1.5 rounded-md transition-all",
                    disabled ? "cursor-default" : "cursor-pointer",
                    "text-[color:var(--color-ink)]/30 hover:text-[color:var(--color-ink)]/40 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                    active && "!text-[color:var(--color-ink)] bg-black/[0.06] dark:bg-white/[0.08] dark:shadow-sm",
                  )}
                >
                  <IconSvg icon={icon} className="w-[15px] h-[15px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs px-2 py-1 rounded-md">
                {opt}
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          );
        })}
        {hasOverflow && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => !disabled && setOverflowOpen(!overflowOpen)}
                disabled={disabled}
                className={clsx(
                  "flex items-center justify-center rounded-md py-1.5 pl-1.5 pr-2 transition-all",
                  disabled ? "cursor-default" : "cursor-pointer",
                  "text-[color:var(--color-ink)]/30 hover:text-[color:var(--color-ink)]/40 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
                  overflow.includes(value) && "!text-[color:var(--color-ink)] bg-black/[0.06] dark:bg-white/[0.08] dark:shadow-sm",
                  "focus-visible:outline-none",
                )}
              >
                <svg viewBox="0 0 15 15" className="w-[15px] h-[15px]" fill="currentColor">
                  <circle cx="3" cy="7.5" r="1" />
                  <circle cx="7.5" cy="7.5" r="1" />
                  <circle cx="12" cy="7.5" r="1" />
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs px-2 py-1 rounded-md">
              More options
              <TooltipArrow />
            </TooltipContent>
          </Tooltip>
        )}
        {overflowOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOverflowOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 bg-[color:var(--color-raised)] border border-[color:var(--color-edge)] rounded-lg shadow-lg p-1 min-w-[160px] animate-in fade-in-0 zoom-in-95">
              {overflow.map((v) => {
                const icon = lookupIcon(property, v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { onChange?.(v); setOverflowOpen(false); }}
                    className={clsx(
                      "w-full flex items-center gap-2.5 px-2 py-1.5 text-[11px] rounded-md transition-colors cursor-pointer",
                      "text-[color:var(--color-ink3)] hover:bg-[color:var(--color-muted)]",
                      value === v && "bg-[color:var(--color-muted)]",
                    )}
                  >
                    {icon && <IconSvg icon={icon} className="w-[15px] h-[15px] shrink-0" />}
                    <span className="flex-1 text-left">{v}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </LabelledControl>
  );
}

/** Collapsible section with chevron toggle. */
function CollapsibleSection({ title, defaultOpen = false, first, children }: { title: string; defaultOpen?: boolean; first?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={first ? "" : "border-t border-[color:var(--color-edge)]"}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 px-3.5 cursor-pointer transition-colors hover:bg-black/[0.05] dark:hover:bg-white/[0.05]"
      >
        <span className="text-[11px] font-semibold text-[color:var(--color-ink)]/80">{title}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={clsx("text-[color:var(--color-ink3)]/50 transition-transform", open && "rotate-180")}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="space-y-3 pb-3 px-3">{children}</div>}
    </div>
  );
}

/** Full editor panel body. */
function EditorPanelBody({ position, display, direction, wrap: wrapMode, showSelf = false, onChangePosition, onChangeDisplay, onChangeDirection, onChangeWrap }: {
  position: Position; display: Display; direction: Direction; wrap: Wrap;
  showSelf?: boolean;
  onChangePosition?: (v: Position) => void;
  onChangeDisplay?: (v: Display) => void;
  onChangeDirection?: (v: Direction) => void;
  onChangeWrap?: (v: Wrap) => void;
}) {
  const isFlex = display === "flex" || display === "inline-flex";
  const isGrid = display === "grid" || display === "inline-grid";
  const isColumn = direction === "column" || direction === "column-reverse";
  const isWrapping = wrapMode === "wrap" || wrapMode === "wrap-reverse";
  const locked = !onChangeDisplay;

  const jcRotate = isFlex && isColumn ? 90 : 0;
  const aiRotate = isFlex && !isColumn ? 90 : 0;
  const acRotate = isFlex ? (isColumn ? 0 : 90) : 0;
  const ctx: LayoutContext = { display, direction, wrap: wrapMode };

  return (
    <div>
      <CollapsibleSection title="Position" first defaultOpen>
        <IconToggle label="Position" property="position" options={["static", "relative", "absolute", "fixed", "sticky"]} value={position} onChange={onChangePosition} disabled={locked} />
        <InputPairSection pairs={[
          { property: "size", value: "horizontal", label: "Width" },
          { property: "size", value: "vertical", label: "Height" },
        ]} />
        <PropertySection label="Overflow" property="overflow" values={["visible", "hidden", "scroll", "auto"]} />
      </CollapsibleSection>

      <CollapsibleSection title="Layout">
        <IconToggle label="Display" property="display" options={["block", "flex", "grid", "inline", "inline-block", "inline-flex", "inline-grid", "none"]} value={display} onChange={onChangeDisplay} disabled={locked} maxVisible={3} />
        {isFlex && (
          <IconToggle label="Direction" property="flex-direction" options={["row", "row-reverse", "column", "column-reverse"]} value={direction} onChange={onChangeDirection} disabled={locked} />
        )}
        {isFlex && (
          <IconToggle label="Wrap" property="flex-wrap" options={["nowrap", "wrap", "wrap-reverse"]} value={wrapMode} onChange={onChangeWrap} disabled={locked} />
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Alignment">
        {display === "block" && (
          <p className="text-[11px] text-[color:var(--color-ink3)]/60 py-2 text-center">
            No alignment properties apply.
          </p>
        )}
        {isFlex && (
          <>
            <PropertySection label="Justify content" property="justify-content" values={DIST_VALUES} rotate={jcRotate} layoutProperty="justify-content" layoutCtx={ctx} />
            {isWrapping && (
              <PropertySection label="Align content" property="align-content" values={AC_VALUES} rotate={acRotate} layoutProperty="align-content" layoutCtx={ctx} />
            )}
            <PropertySection label="Align items" property="align-items" values={AI_VALUES} rotate={aiRotate} layoutProperty="align-items" layoutCtx={ctx} />
            <PropertySection label="Grow/Shrink" property="flex-grow" values={["flex-grow", "flex-shrink"]} />
            {showSelf && (
              <>
                <p className="text-[9px] text-[color:var(--color-ink3)]/50 px-0.5">On selected child</p>
                <PropertySection label="Align self" property="align-self" values={AS_VALUES} rotate={aiRotate} layoutProperty="align-self" layoutCtx={ctx} />
              </>
            )}
          </>
        )}
        {isGrid && (
          <>
            <PropertySection label="Justify content" property="justify-content" values={DIST_VALUES} rotate={0} layoutProperty="justify-content" layoutCtx={ctx} />
            <PropertySection label="Justify items" property="align-items" values={AI_VALUES} rotate={0} layoutProperty="justify-items" layoutCtx={ctx} />
            <PropertySection label="Align content" property="align-content" values={AC_VALUES} rotate={0} layoutProperty="align-content" layoutCtx={ctx} />
            <PropertySection label="Align items" property="align-items" values={AI_VALUES} rotate={0} layoutProperty="align-items" layoutCtx={ctx} />
            {showSelf && (
              <>
                <p className="text-[9px] text-[color:var(--color-ink3)]/50 px-0.5">On selected child</p>
                <PropertySection label="Justify self" property="align-self" values={AS_VALUES} rotate={0} layoutProperty="justify-self" layoutCtx={ctx} />
                <PropertySection label="Align self" property="align-self" values={AS_VALUES} rotate={0} layoutProperty="align-self" layoutCtx={ctx} />
              </>
            )}
          </>
        )}
      </CollapsibleSection>

      <CollapsibleSection title="Spacing">
        {(isFlex || isGrid) && (
          <InputPairSection pairs={[
            { property: "gap", value: "column", label: "Column gap" },
            { property: "gap", value: "row", label: "Row gap" },
          ]} />
        )}
        <DirectionalSection label="Padding" property="padding" />
        <DirectionalSection label="Margin" property="margin" />
      </CollapsibleSection>

      <CollapsibleSection title="Borders">
        <DirectionalSection label="Radius" property="border-radius" sides={[
          { value: "top-left", label: "TL" },
          { value: "top-right", label: "TR" },
          { value: "bottom-right", label: "BR" },
          { value: "bottom-left", label: "BL" },
        ]} />
        <div className="grid grid-cols-2 gap-2">
          <InputSection label="Border style" property="border-style" />
          <InputSection label="Border width" property="border-width" />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Typography">
        <LabelledFakeInput label="Font family" property="font-family" />
        <InputPairSection pairs={[
          { property: "font-weight", value: "", label: "Weight" },
          { property: "font-size", value: "", label: "Size" },
        ]} />
        <InputPairSection pairs={[
          { property: "line-height", value: "", label: "Line height" },
          { property: "letter-spacing", value: "", label: "Spacing" },
        ]} />
        <PropertySection label="Text align" property="text-align" values={["left", "center", "right", "justify"]} />
        <div className="grid grid-cols-2 gap-2">
          <PropertySection label="Decoration" property="text-decoration" values={["underline", "line-through", "none"]} />
          <PropertySection label="Transform" property="text-transform" values={["uppercase", "lowercase", "capitalize"]} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Effects">
        <InputSection label="Opacity" property="opacity" />
        <InputSection label="Shadow" property="box-shadow" />
      </CollapsibleSection>
    </div>
  );
}

/** Interactive panel — elevated fake editor UI. */
function ContextPanel() {
  const [position, setPosition] = useState<Position>("relative");
  const [display, setDisplay] = useState<Display>("flex");
  const [direction, setDirection] = useState<Direction>("row");
  const [wrap, setWrap] = useState<Wrap>("nowrap");

  return (
    <TooltipProvider delayDuration={300}>
      <div className="rounded-xl border border-edge bg-page dark:bg-raised shadow-lg shadow-black/[0.1] dark:shadow-black/20 overflow-clip w-full">
        <EditorPanelBody
          position={position} display={display} direction={direction} wrap={wrap} showSelf
          onChangePosition={setPosition} onChangeDisplay={setDisplay} onChangeDirection={setDirection} onChangeWrap={setWrap}
        />
      </div>
    </TooltipProvider>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */

function CascadeFooter() {
  return (
    <footer className="py-8 border-t border-edge-subtle">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] text-ink3 font-mono">
          <span className="text-ink3/50">@designtools/</span>cascade{" "}
          <span className="text-ink3/30 mx-1">/</span>{" "}
          <a href="/" className="text-ink3/50 hover:text-ink2 transition-colors">
            surface
          </a>
          <span className="text-ink3/30 mx-1">/</span>{" "}
          <a href="https://flett.cc" target="_blank" rel="noopener" className="text-ink3/50 hover:text-ink2 transition-colors">
            flett.cc
          </a>
        </span>
        <ul className="flex flex-wrap justify-center gap-5 list-none">
          <li>
            <a href="https://github.com/andflett/cascade" target="_blank" rel="noopener" className="text-[12px] text-ink3 hover:text-ink2 transition-colors font-mono">
              github
            </a>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/@designtools/cascade" target="_blank" rel="noopener" className="text-[12px] text-ink3 hover:text-ink2 transition-colors font-mono">
              npm
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */

/** Install command with copy. */
function InstallCommand() {
  const cmd = "npm i @designtools/cascade";
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  }, [cmd]);

  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group relative inline-flex items-center gap-3 px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/8 transition-all cursor-pointer npx-command"
    >
      <span className="text-[13px] font-mono text-white/80 group-hover:text-white transition-colors">{cmd}</span>
      <span className="text-white/30 group-hover:text-white/60 transition-colors">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
    </button>
  );
}

export function CascadePage() {
  const entries = orderedEntries();
  const uniqueIcons = new Set(metadata.map((e) => e.icon)).size;
  const uniqueProperties = new Set(metadata.map((e) => e.property)).size;

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col">
      <CascadeNav />

      {/* Hero */}
      <section className="relative pt-28 pb-16 text-center bg-[#09090b] overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="relative inline-flex justify-center mb-6">
            <DitherGlow
              width={450}
              height={100}
              pixelSize={3}
              color="rgba(255,255,255,0.15)"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 text-xs font-medium text-white/70 font-mono relative rounded-full">
              <span className="animate-pulse w-1.5 h-1.5 bg-green-400 rounded-full" />
              v0.1 — @designtools/cascade
            </span>
          </div>
          <h1
            className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-normal leading-[1.0] tracking-[-0.025em] text-white mb-5"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            <span className="glitch" data-text="CSS">CSS</span> property icons
          </h1>
          <p className="text-sm md:text-base text-white/60 max-w-[480px] mx-auto leading-relaxed mb-8">
            {uniqueIcons} hand-crafted icons across {uniqueProperties} CSS
            property groups. Designed for visual editors that speak code.
          </p>
          <InstallCommand />
        </div>
      </section>

      {/* Design canvas — full-bleed grid, panel overlays right */}
      <section className="relative -mt-px overflow-hidden">
        <div
          className="max-w-[1200px] mx-auto px-6"
          style={{ display: "grid", gridTemplateColumns: "1fr 320px" }}
        >
          {/* CanvasGrid spans both columns — its container is full content width,
              so the 100vw breakout inside centers correctly */}
          <div style={{ gridColumn: "1 / -1", gridRow: 1, alignSelf: "start" }}>
            <TooltipProvider delayDuration={200}>
              <CanvasGrid entries={entries} padTop={1} panelWidth={320 + CELL} />
            </TooltipProvider>
          </div>

          {/* Panel overlays right column, on top of the grid */}
          <div
            className="max-lg:hidden relative z-20"
            style={{ gridColumn: 2, gridRow: 1, paddingTop: 76 }}
          >
            <ContextPanel />
          </div>
        </div>
      </section>

      {/* Mobile-only editor panel */}
      <section className="lg:hidden py-12 px-6">
        <ContextPanel />
      </section>

      <div className="dither-band" />

      <CascadeFooter />
    </div>
  );
}
