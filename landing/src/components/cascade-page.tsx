import "./cascade.css";
import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import clsx from "clsx";
import { Sun, Moon, Copy, Check } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
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
  solidifyIcon,
  IconSvg,
  iconToSvgString,
  iconToReactString,
  PV_BG as _PV_BG,
  PV_LABEL_COLOR as _PV_LABEL_COLOR,
  type CascadeIcon,
  type IconEntry,
} from "#cascade";

// Override package defaults — stronger control backgrounds, visible labels
const PV_BG = "bg-[color:var(--color-muted)]";
const PV_LABEL_COLOR = "text-[color:var(--color-ink2)]/80";

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
      className="cursor-pointer inline-flex items-center text-white/50 hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function CascadeNav() {
  return (
    <nav className="py-3 bg-[#09090b] border-b border-white/8">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
        <span className="text-[13px] font-mono flex items-center gap-0">
          <span className="text-white/40 hidden sm:inline">@designtools/</span>
          <span className="text-white">cascade</span>
          <span className="text-white/20 mx-1.5">/</span>
          <a href="/" className="text-white/40 hover:text-white/60 transition-colors">surface</a>
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

/* ── Icon style context ── */

type IconStyle = "duo" | "solid";
const IconStyleContext = createContext<IconStyle>("duo");

/* ═══════════════════════════════════════════════════════
   ICON GRID (left column)
   ═══════════════════════════════════════════════════════ */

/** Category grouping — controls icon ordering in the grid. */
const CATEGORIES: { label: string; properties: string[] }[] = [
  { label: "Layout", properties: ["position", "display", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink"] },
  { label: "Spacing", properties: ["gap", "overflow", "padding", "margin", "axis", "size"] },
  { label: "Borders", properties: ["border-radius", "border-style", "border-width"] },
  { label: "Typography", properties: ["font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "text-decoration", "text-transform"] },
  { label: "Effects", properties: ["opacity", "box-shadow"] },
  { label: "Alignment", properties: ["justify-content", "align-items", "align-self", "align-content"] },
];

/** Values to hide from the landing page grid (still in the library). */
const HIDDEN_VALUES = new Set(["none", "auto", "static", "nowrap", "start", "end"]);
/** Property::value combos exempt from hiding (visually unique). */
const HIDDEN_EXCEPTIONS = new Set(["display::none"]);

/** Build flat ordered list of metadata entries for the grid. */
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
  // Add text-decoration "none" at the end
  const tdNone = metadata.find((e) => e.property === "text-decoration" && e.value === "none");
  if (tdNone) ordered.push(tdNone);
  return ordered;
}

/* ── Copy action bar (docked to popover bottom) ── */

type CopyKey = "svg" | "react";

function CopyActions({ texts }: { texts: Record<CopyKey, string> }) {
  const [copied, setCopied] = useState<CopyKey | false>(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleCopy = useCallback((key: CopyKey) => {
    navigator.clipboard.writeText(texts[key]);
    setCopied(key);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1500);
  }, [texts]);

  useEffect(() => () => clearTimeout(timeout.current), []);

  const btn = "flex-1 inline-flex items-center justify-center gap-2 py-3 text-[10px] font-mono transition-all cursor-pointer";
  const idle = "text-ink2 hover:text-ink hover:bg-ink/5 dark:hover:bg-white/8";

  return (
    <div className="flex border-t border-edge">
      <button type="button" onClick={() => handleCopy("svg")} className={clsx(btn, idle)}>
        {copied === "svg" ? (
          <>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-75" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Copied
          </>
        ) : (
          <>
            <Copy size={11} />
            Copy SVG
          </>
        )}
      </button>
      <button type="button" onClick={() => handleCopy("react")} className={clsx(btn, "border-l border-edge", idle)}>
        {copied === "react" ? (
          <>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-green-500 opacity-75" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-green-500" />
            </span>
            Copied
          </>
        ) : (
          <>
            <Copy size={11} />
            React
          </>
        )}
      </button>
    </div>
  );
}

/* ── Icon popover (rendered inside a bordered grid cell) ── */

const CELL = 72; // px — grid cell size

function IconCellContent({ entry }: { entry: IconEntry }) {
  const [open, setOpen] = useState(false);
  const iconStyle = useContext(IconStyleContext);
  const globalSolid = iconStyle === "solid";
  const [localSolid, setLocalSolid] = useState(false);
  const solid = open ? localSolid : globalSolid;
  const icon = lookupIcon(entry.property, entry.value);
  if (!icon) return null;

  const hasValue = entry.value !== null;
  const componentName = entry.icon;

  return (
    <Popover.Root open={open} onOpenChange={(v) => { setOpen(v); if (v) setLocalSolid(globalSolid); }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover.Trigger asChild>
            <button
              type="button"
              className={clsx(
                "flex items-center justify-center w-full h-full transition-colors cursor-pointer",
                open
                  ? "bg-ink text-page"
                  : "text-ink hover:bg-ink/[0.04] dark:hover:bg-white/[0.06]",
              )}
            >
              <IconSvg icon={icon} className="w-[15px] h-[15px]" solid={globalSolid} />
            </button>
          </Popover.Trigger>
        </TooltipTrigger>
        {!open && (
          <TooltipContent side="bottom" className="font-mono">
            {hasValue ? `${entry.property}: ${entry.value}` : entry.property}
            <TooltipArrow />
          </TooltipContent>
        )}
      </Tooltip>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="center"
          sideOffset={8}
          collisionPadding={{ top: 12, bottom: 80, left: 12, right: 12 }}
          className="bg-page border border-edge rounded-xl shadow-xl overflow-hidden w-[240px] animate-in fade-in-0 zoom-in-95"
        >
          {/* Preview with subtle 5px grid */}
          <div
            className={clsx("relative flex items-center justify-center", entry.duotone ? "px-8 pt-7 pb-15" : "p-8")}
            style={{
              backgroundImage: `
                linear-gradient(to right, color-mix(in srgb, var(--color-ink) 4%, transparent) 0.5px, transparent 0.5px),
                linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 4%, transparent) 0.5px, transparent 0.5px)
              `,
              backgroundSize: "5px 5px",
              backgroundPosition: "center center",
            }}
          >
            <IconSvg icon={icon} className="w-16 h-16" solid={localSolid} />
            {/* Duo/Solid toggle for duotone icons */}
            {entry.duotone && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex bg-ink/8 dark:bg-white/10 rounded-full p-0.5 text-[10px] font-medium">
                <button
                  type="button"
                  onClick={() => setLocalSolid(false)}
                  className={clsx(
                    "px-3 py-1 rounded-full transition-colors cursor-pointer",
                    !localSolid ? "bg-page text-ink shadow-sm" : "text-ink3 hover:text-ink",
                  )}
                >
                  Duotone
                </button>
                <button
                  type="button"
                  onClick={() => setLocalSolid(true)}
                  className={clsx(
                    "px-3 py-1 rounded-full transition-colors cursor-pointer",
                    localSolid ? "bg-page text-ink shadow-sm" : "text-ink3 hover:text-ink",
                  )}
                >
                  Solid
                </button>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="px-4 py-4 border-t border-edge">
            <p className="text-[13px] font-semibold font-mono truncate" title={componentName}>{componentName}</p>
            <p className="text-[10px] text-ink3 font-mono mt-0.5">
              {hasValue ? `${entry.property}: ${entry.value}` : entry.property}
            </p>
          </div>
          {/* Copy actions */}
          <CopyActions texts={{
            svg: iconToSvgString(icon, localSolid),
            react: iconToReactString(componentName, localSolid),
          }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/* ── Canvas grid ──
   Full-viewport graph-paper via CSS background gradients. Icons sit in
   an auto-fill grid centered with justify-content; the background aligns
   via mod() and extends beyond the icons in all directions.
   ─────────────────────────────────────────────────────────────────── */

// Graph-paper line color — subtle, auto dark mode via color-mix
const LINE_COLOR = "color-mix(in srgb, var(--color-ink) 3%, transparent)";

function CanvasGrid({ entries }: {
  entries: IconEntry[];
}) {
  return (
    <div
      className="max-sm:[--grid-pt:36px] sm:[--grid-pt:72px]"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        paddingTop: "var(--grid-pt)",
        paddingBottom: CELL,
        backgroundImage: `
          repeating-linear-gradient(to right, ${LINE_COLOR} 0 1px, transparent 1px ${CELL}px),
          repeating-linear-gradient(to bottom, ${LINE_COLOR} 0 1px, transparent 1px ${CELL}px)
        `,
        backgroundPosition: `calc(mod(100vw, ${CELL}px) / 2) var(--grid-pt)`,
      } as React.CSSProperties}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${CELL}px)`,
          justifyContent: "center",
        }}
      >
        {entries.map((entry, i) => (
          <div key={entry.icon + entry.property} style={{ width: CELL, height: CELL }}>
            <IconCellContent entry={entry} />
          </div>
        ))}
      </div>
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
function LayoutPreview({ property, value, width: w = 108, stretch, ctx = DEFAULT_CTX }: { property: string; value: string; width?: number; stretch?: boolean; ctx?: LayoutContext }) {
  const isCol = ctx.direction.startsWith("column");
  const isGrid = ctx.display === "grid" || ctx.display === "inline-grid";
  const isAC = property === "align-content";

  const baseW = stretch ? undefined : (isCol && !isAC ? Math.round(w * 0.5) : w);
  const baseH = isCol && !isAC ? (stretch ? 72 : Math.round(w * 0.9)) : (isAC ? 72 : 48);

  const base: React.CSSProperties = {
    display: isGrid ? "grid" : "flex",
    ...(!isGrid && { flexDirection: isCol ? "column" : "row" }),
    ...(isGrid && { gridTemplateColumns: "repeat(3, auto)", justifyContent: "start" }),
    width: baseW ?? "100%", height: baseH,
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
  const usePct = isCol && stretch;
  const ch = isCol ? (baseW ?? 100) - 6 : baseH - 6;
  const c1 = usePct ? "70%" : Math.round(ch * 0.7);
  const c2 = usePct ? "45%" : Math.round(ch * 0.45);
  const c3 = usePct ? "55%" : Math.round(ch * 0.55);

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
      const cw = Math.round((baseW ?? 200) * 0.25);
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


/** Content for the property explainer popover — cycles through values showing the effect. */
function PropertyExplainerContent({ property, ctx, onClose }: { property: string; ctx: LayoutContext; onClose: () => void }) {
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
    <div className="p-3 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-[12px] font-semibold font-mono">{explainer.title}</h4>
          <p className="text-[10px] text-[color:var(--color-ink3)] leading-relaxed mt-0.5">{explainer.description}</p>
        </div>
        <Popover.Close className="text-[color:var(--color-ink3)] hover:text-[color:var(--color-ink)] shrink-0 mt-0.5 cursor-pointer">
          <svg viewBox="0 0 15 15" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l7 7M11 4l-7 7" /></svg>
        </Popover.Close>
      </div>
      <LayoutPreview property={property} value={value} stretch ctx={ctx} />
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

/** Look up icon by property+value, with fallback to treat value as a property name. */
function resolve(property: string, value: string): CascadeIcon | undefined {
  return lookupIcon(property, value) ?? lookupIcon(value, null);
}

/* ── Segmented control styles ── */
const SEG_ITEM = "flex-1 flex items-center justify-center py-[8px] transition-all focus-visible:outline-none";
const SEG_IDLE = "text-[color:var(--color-ink)]/50 hover:text-[color:var(--color-ink)]/60 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]";
const SEG_ACTIVE = "!text-[color:var(--color-ink)] bg-black/[0.06] dark:bg-white/[0.08] dark:shadow-sm";
const SEG_OVERFLOW_BTN = "flex items-center justify-center py-1 pl-1.5 pr-2 transition-all focus-visible:outline-none";

/** Edge rounding — only first/last items get rounded corners. */
function segRounding(index: number, total: number): string {
  if (total === 1) return "rounded-md";
  if (index === 0) return "rounded-l-md";
  if (index === total - 1) return "rounded-r-md";
  return "";
}
const SEG_DROPDOWN = "absolute right-0 top-full mt-1 bg-[color:var(--color-page)] border border-[color:var(--color-edge)] rounded-lg shadow-lg p-1 min-w-[160px] animate-in fade-in-0 zoom-in-95";
const SEG_DROP_ITEM = "w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] rounded-md transition-colors cursor-pointer text-[color:var(--color-ink)]/70 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]";

/** Dots icon for overflow trigger. */
const OverflowDots = () => (
  <svg viewBox="0 0 15 15" className="w-[15px] h-[15px]" fill="currentColor">
    <circle cx="3" cy="7.5" r="1" />
    <circle cx="7.5" cy="7.5" r="1" />
    <circle cx="12" cy="7.5" r="1" />
  </svg>
);

/** Overflow dropdown — uses Radix Popover so it portals above siblings. */
function SegmentedOverflowPopover({ items, selected, property, open, onOpenChange, onSelect, active, disabled, resolveIcon, className }: {
  items: readonly string[];
  selected: string;
  property: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (v: string) => void;
  active: boolean;
  disabled?: boolean;
  resolveIcon?: (property: string, value: string) => CascadeIcon | undefined;
  className?: string;
}) {
  const getIcon = resolveIcon ?? resolve;
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover.Trigger asChild>
            <button
              type="button"
              disabled={disabled}
              className={clsx(SEG_OVERFLOW_BTN, disabled ? "cursor-default" : "cursor-pointer", SEG_IDLE, active && SEG_ACTIVE, className)}
            >
              <OverflowDots />
            </button>
          </Popover.Trigger>
        </TooltipTrigger>
        {!open && (
          <TooltipContent side="bottom" className="text-xs px-2 py-1 rounded-md">
            More options
            <TooltipArrow />
          </TooltipContent>
        )}
      </Tooltip>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={4}
          className={SEG_DROPDOWN}
        >
          {items.map((v) => {
            const icon = getIcon(property, v);
            return (
              <button
                key={v}
                type="button"
                onClick={() => { onSelect(v); onOpenChange(false); }}
                className={clsx(SEG_DROP_ITEM, selected === v && "bg-black/[0.06] dark:bg-white/[0.08]")}
              >
                {icon && <IconSvg icon={icon} className="w-[15px] h-[15px] shrink-0" />}
                <span className="flex-1 text-left">{v}</span>
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

/** Segmented icon control with optional overflow, layout previews, and controlled/uncontrolled modes. */
function SegmentedControl({ property, values, value: controlledValue, onChange, rotate = 0, maxVisible = 4, disabled, layoutProperty, layoutCtx }: {
  property: string;
  values: readonly string[];
  value?: string;
  onChange?: (v: string) => void;
  rotate?: number;
  maxVisible?: number;
  disabled?: boolean;
  layoutProperty?: string;
  layoutCtx?: LayoutContext;
}) {
  const [internal, setInternal] = useState(values[0]);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const selected = controlledValue ?? internal;
  const onSelect = (v: string) => { onChange ? onChange(v) : setInternal(v); };

  const hasOverflow = values.length > maxVisible;
  const visible = hasOverflow ? values.slice(0, maxVisible) : values;
  const overflow = hasOverflow ? values.slice(maxVisible) : [];
  const hasLayoutTooltip = !!layoutProperty;

  return (
    <div className="relative">
      <div className={clsx("flex w-full rounded-md p-0", PV_BG, disabled && "opacity-60")}>
        {visible.map((v, i) => {
          const icon = resolve(property, v);
          if (!icon) return null;
          const active = selected === v;
          const totalSlots = visible.length + (hasOverflow ? 1 : 0);
          return (
            <Tooltip key={v}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onSelect(v)}
                  disabled={disabled}
                  className={clsx(SEG_ITEM, segRounding(i, totalSlots), disabled ? "cursor-default" : "cursor-pointer", SEG_IDLE, active && SEG_ACTIVE)}
                >
                  <IconSvg icon={icon} rotate={rotate} className="w-[15px] h-[15px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className={hasLayoutTooltip ? "!bg-[color:var(--color-page)] !text-[color:var(--color-ink)] border border-[color:var(--color-edge)] p-0 rounded-xl overflow-hidden w-[140px] shadow-lg" : "text-xs px-2 py-1 rounded-md"}>
                {hasLayoutTooltip ? (
                  <div>
                    <div className="p-2 pb-1.5">
                      <LayoutPreview property={layoutProperty!} value={v} ctx={layoutCtx} />
                    </div>
                    <div className="px-2.5 pb-2 space-y-0.5">
                      <div className="text-[11px] font-medium">{v}</div>
                      {VALUE_HINTS[layoutProperty!]?.[v] && (
                        <div className="text-[10px] text-[color:var(--color-ink3)] leading-tight">{VALUE_HINTS[layoutProperty!][v]}</div>
                      )}
                    </div>
                  </div>
                ) : v}
                <TooltipArrow className={hasLayoutTooltip ? "!fill-[color:var(--color-page)]" : ""} />
              </TooltipContent>
            </Tooltip>
          );
        })}
        {hasOverflow && (
          <SegmentedOverflowPopover
            items={overflow}
            selected={selected}
            property={property}
            open={overflowOpen}
            onOpenChange={(v) => !disabled && setOverflowOpen(v)}
            onSelect={onSelect}
            active={overflow.includes(selected)}
            disabled={disabled}
            className="rounded-r-md"
          />
        )}
      </div>
    </div>
  );
}

/** Consistent label → control wrapper. */
function ControlLabel({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-0.5">
      <div className={clsx("text-[9px] font-medium tracking-[0.25px] capitalize", PV_LABEL_COLOR)}>{children}</div>
      {actions}
    </div>
  );
}

function LabelledControl({ label, actions, children }: { label: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.25">
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
  const [explainerOpen, setExplainerOpen] = useState(false);

  return (
    <div>
      <LabelledControl
        label={label}
        actions={layoutProperty ? (
          <Popover.Root open={explainerOpen} onOpenChange={setExplainerOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                className={clsx("w-4 h-4 flex items-center justify-center rounded hover:text-[color:var(--color-ink3)] transition-colors cursor-pointer text-[9px] font-semibold", PV_LABEL_COLOR)}
              >
                ?
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="bottom"
                align="start"
                sideOffset={8}
                collisionPadding={{ top: 12, bottom: 80, left: 12, right: 12 }}
                className="bg-[color:var(--color-page)] border border-[color:var(--color-edge)] rounded-xl shadow-xl overflow-hidden w-[240px] animate-in fade-in-0 zoom-in-95"
              >
                <PropertyExplainerContent property={layoutProperty} ctx={layoutCtx ?? DEFAULT_CTX} onClose={() => setExplainerOpen(false)} />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ) : undefined}
      >
        <SegmentedControl property={property} values={values} rotate={rotate} layoutProperty={layoutProperty} layoutCtx={layoutCtx} />
      </LabelledControl>
    </div>
  );
}

/** Labelled segmented icon toggle — controlled, for editor panel top-level controls. */
function IconToggle<T extends string>({ label, property, options, value, onChange, disabled, maxVisible }: {
  label: string;
  property: string;
  options: T[];
  value: T;
  onChange?: (v: T) => void;
  disabled?: boolean;
  maxVisible?: number;
}) {
  return (
    <LabelledControl label={label}>
      <SegmentedControl
        property={property}
        values={options}
        value={value}
        onChange={onChange ? (v) => onChange(v as T) : undefined}
        disabled={disabled}
        maxVisible={maxVisible}
      />
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
        className="flex items-center justify-between w-full py-3 px-6 cursor-pointer transition-colors group"
      >
        <span className="text-[11px] font-semibold text-[color:var(--color-ink)]/80 group-hover:text-[color:var(--color-ink)]">{title}</span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          className={clsx("text-[color:var(--color-ink2)] transition-transform", open && "rotate-180")}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="space-y-3.5 pb-5.5 px-5.5">{children}</div>}
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
      <CollapsibleSection title="Placement" first defaultOpen>
        <IconToggle label="Position" property="position" options={["relative", "absolute", "fixed", "sticky"]} value={position} onChange={onChangePosition} disabled={locked} />
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
          <div className="grid grid-cols-2 gap-2">
            <IconToggle label="Wrap" property="flex-wrap" options={["wrap", "wrap-reverse"]} value={wrapMode === "nowrap" ? "wrap" : wrapMode} onChange={onChangeWrap} disabled={locked} />
            <PropertySection label="Grow / Shrink" property="flex-grow" values={["flex-grow", "flex-shrink"]} />
          </div>
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
      <div className="border-l border-edge-subtle dark:border-edge bg-page dark:bg-raised w-full h-full">
        <EditorPanelBody
          position={position} display={display} direction={direction} wrap={wrap} showSelf={false}
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
    <footer className="py-8 bg-[#09090b] border-t border-white/8">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] text-white/50 font-mono">
          <span className="text-white/40">@designtools/</span>cascade{" "}
          <span className="text-white/20 mx-1">/</span>{" "}
          <a href="/" className="text-white/40 hover:text-white/60 transition-colors">
            surface
          </a>
          <span className="text-white/20 mx-1">/</span>{" "}
          <a href="https://flett.cc" target="_blank" rel="noopener" className="text-white/40 hover:text-white/60 transition-colors">
            flett.cc
          </a>
        </span>
        <ul className="flex flex-wrap justify-center gap-5 list-none">
          <li>
            <a href="https://github.com/andflett/cascade" target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
              github
            </a>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/@designtools/cascade" target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
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

/** Duo/Solid segmented toggle. */
function IconStyleToggle({ value, onChange }: { value: IconStyle; onChange: (v: IconStyle) => void }) {
  return (
    <div className="inline-flex rounded-lg p-0.5 gap-0.5 border border-white/10 bg-white/5">
      {(["duo", "solid"] as const).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={clsx(
            "px-3 py-1 text-[11px] font-mono rounded-md transition-all cursor-pointer",
            value === opt
              ? "bg-white/15 text-white/80"
              : "text-white/30 hover:text-white/50",
          )}
        >
          {opt === "duo" ? "Duotone" : "Solid"}
        </button>
      ))}
    </div>
  );
}

/** Mobile example dialog — Radix Dialog for proper portal layering. */
function MobileExampleDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="lg:hidden fixed bottom-5 right-5 h-10 px-4 rounded-full bg-ink text-page shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          aria-label="Open example usage"
        >
          {/* Eye icon */}
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span className="text-xs font-semibold">Example</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in-0" />
        <Dialog.Content className="fixed inset-3 top-6 bottom-6 bg-page dark:bg-raised rounded-2xl border border-edge shadow-2xl flex flex-col overflow-hidden lg:hidden animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-edge shrink-0">
            <div>
              <Dialog.Title className="text-[11px] font-semibold text-ink/80">Example Usage</Dialog.Title>
              <Dialog.Description className="text-[11px] text-ink3 mt-0.5">How cascade icons could look in a properties panel</Dialog.Description>
            </div>
            <Dialog.Close className="w-7 h-7 flex items-center justify-center rounded-lg text-ink3 hover:text-ink hover:bg-ink/5 dark:hover:bg-white/8 transition-colors cursor-pointer">
              <svg viewBox="0 0 15 15" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l7 7M11 4l-7 7" />
              </svg>
            </Dialog.Close>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <ContextPanel />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CascadePage() {
  const entries = orderedEntries();
  const uniqueProperties = new Set(metadata.map((e) => e.property)).size;
  const [iconStyle, setIconStyle] = useState<IconStyle>("duo");

  return (
    <IconStyleContext.Provider value={iconStyle}>
      <div className="min-h-screen bg-page text-ink flex flex-col">
        <CascadeNav />

        {/* Hero */}
        <section className="relative pt-20 pb-8 text-center bg-[#09090b] overflow-hidden dark:border-b dark:border-edge">
          <div className="max-w-[1200px] mx-auto px-6 relative">
            <div className="relative inline-flex justify-center mb-7">
              <DitherGlow
                width={450}
                height={100}
                pixelSize={3}
                color="rgba(255,255,255,0.15)"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
              <span className="inline-flex items-center gap-2.5 px-4 py-1.5 text-xs font-medium text-white/70 font-mono relative rounded-full">
                <span className="animate-pulse w-1.5 h-1.5 bg-green-400 rounded-full" />
                v0.1 - react / svg
              </span>
            </div>
            <h1
              className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-normal leading-[1.0] tracking-[-0.025em] text-white mb-3"
              style={{ fontFamily: "'Jersey 25', sans-serif" }}
            >
              <span className="glitch" data-text="Cascade">
                Cascade
              </span>{" "}
              Icons
            </h1>
            <p className="text-sm md:text-base text-white/70 max-w-[480px] mx-auto leading-relaxed mb-6">
              Hand-crafted icons for {uniqueProperties} CSS properties and their
              values. Made for design tools that speak code.
            </p>
            <InstallCommand />
            <div className="mt-7">
{/* Duo/Solid toggle removed — available per-icon in popovers */}
            </div>
          </div>
        </section>

        {/* Design canvas — full-bleed grid + panel pinned to right edge */}
        <section className="relative overflow-hidden">
          {/* Canvas grid — full viewport width, icons centred */}
          <div className="max-w-[1200px] mx-auto px-6">
            <TooltipProvider delayDuration={200}>
              <CanvasGrid entries={entries} />
            </TooltipProvider>
          </div>

          {/* Panel — absolute to right edge, full height of section (desktop only) */}
          <div
            className="max-lg:hidden absolute top-0 right-0 bottom-0"
            style={{ width: 330 }}
          >
            <div className="sticky top-0 h-screen overflow-y-auto">
              <ContextPanel />
            </div>
          </div>
        </section>

        {/* Mobile floating preview button + modal */}
        <MobileExampleDialog />

        <div className="dither-band" />

        <CascadeFooter />
      </div>
    </IconStyleContext.Provider>
  );
}
