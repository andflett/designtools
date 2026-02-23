/**
 * Color popover components for token selection and OKLCH editing.
 * Combines studio's ColorPopover + TokenPopover with the OklchEditor.
 */
import { useEffect, useRef, useState, useCallback, type RefObject } from "react";
import { createPortal } from "react-dom";
import { RgbaColorPicker } from "react-colorful";
import { converter } from "culori";
import type { RgbaColor } from "react-colorful";
import {
  type InputMode,
  clamp,
  cssToRgba,
  rgbaToCss,
  ModeTabs,
  ColorInputFields,
} from "./color-picker.js";

const toRgb = converter("rgb");
const toOklch = converter("oklch");

// ---------------------------------------------------------------------------
// Color token picker popover (used by computed-property-panel's ColorControl)
// ---------------------------------------------------------------------------

interface ColorPopoverProps {
  anchorRef: RefObject<HTMLElement | null>;
  currentValue: string;
  availableTokens: string[];
  tokenValues: Record<string, string>;
  onSelect: (token: string) => void;
  onClose: () => void;
}

export function ColorPopover({
  anchorRef,
  currentValue,
  availableTokens,
  tokenValues,
  onSelect,
  onClose,
}: ColorPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, above: false });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const popoverHeight = 340;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < popoverHeight && rect.top > popoverHeight;

    setPosition({
      top: above ? rect.top - popoverHeight - 4 : rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - 252),
      above,
    });
  }, [anchorRef]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const baseValue = currentValue.split("/")[0];
  const resolvedPreview = tokenValues[baseValue] || "";

  return createPortal(
    <div
      ref={popoverRef}
      className="studio-popover"
      style={{ top: position.top, left: position.left }}
    >
      {/* Preview swatch */}
      <div
        className="studio-popover-swatch"
        style={{
          "--swatch-color": resolvedPreview,
        } as React.CSSProperties}
      />

      {/* Token list */}
      <div className="studio-popover-list">
        {availableTokens.map((token) => (
          <button
            key={token}
            className={`studio-popover-item ${token === currentValue ? "active" : ""}`}
            onClick={() => onSelect(token)}
          >
            <div
              className="studio-swatch"
              style={{
                "--swatch-color": tokenValues[token.split("/")[0]] || "",
              } as React.CSSProperties}
            />
            <span className="truncate">{token}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// Token editing popover with OKLCH sliders (used by token-editor)
// ---------------------------------------------------------------------------

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

function parseOklch(value: string): OklchColor {
  const match = value.match(
    /oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)/
  );
  if (match) {
    const l = match[2] === "%" ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
    return { l, c: parseFloat(match[3]), h: parseFloat(match[4]) };
  }
  return { l: 0.5, c: 0.1, h: 250 };
}

function formatOklch(color: OklchColor): string {
  return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}

function getContrastRatio(fg: string, bg: string): number | null {
  try {
    const fgL = parseOklch(fg).l;
    const bgL = parseOklch(bg).l;
    const lighter = Math.max(fgL, bgL);
    const darker = Math.min(fgL, bgL);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return null;
  }
}

interface TokenPopoverProps {
  anchorRef: RefObject<HTMLElement | null>;
  token: { name: string; value: string; resolvedValue: string };
  theme: "light" | "dark";
  cssFilePath: string;
  contrastToken?: { name: string; resolvedValue: string } | null;
  onPreview: (token: string, value: string) => void;
  onClose: () => void;
}

export function TokenPopover({
  anchorRef,
  token,
  theme,
  cssFilePath,
  contrastToken,
  onPreview,
  onClose,
}: TokenPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<OklchColor>(() =>
    parseOklch(token.resolvedValue)
  );
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [inputMode, setInputMode] = useState<InputMode>("oklch");

  // Derive RGBA from OKLCH for the visual picker
  const rgba: RgbaColor = (() => {
    const rgb = toRgb({ mode: "oklch" as const, l: color.l, c: color.c, h: color.h });
    if (rgb) {
      return {
        r: clamp(Math.round((rgb.r ?? 0) * 255), 0, 255),
        g: clamp(Math.round((rgb.g ?? 0) * 255), 0, 255),
        b: clamp(Math.round((rgb.b ?? 0) * 255), 0, 255),
        a: 1,
      };
    }
    return { r: 0, g: 0, b: 0, a: 1 };
  })();

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const popoverHeight = 460;
    const spaceBelow = window.innerHeight - rect.bottom;
    const above = spaceBelow < popoverHeight && rect.top > popoverHeight;

    setPosition({
      top: above ? rect.top - popoverHeight - 4 : rect.bottom + 4,
      left: Math.min(rect.left, window.innerWidth - 272),
    });
  }, [anchorRef]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const updateColor = useCallback(
    (update: Partial<OklchColor>) => {
      const newColor = { ...color, ...update };
      setColor(newColor);
      onPreview(token.name, formatOklch(newColor));
    },
    [color, onPreview, token.name]
  );

  // Handle visual picker (RGBA) changes → convert to OKLCH
  const handlePickerChange = useCallback(
    (c: RgbaColor) => {
      const oklch = toOklch({ mode: "rgb" as const, r: c.r / 255, g: c.g / 255, b: c.b / 255 });
      if (oklch) {
        const newColor: OklchColor = {
          l: oklch.l ?? 0.5,
          c: oklch.c ?? 0.1,
          h: oklch.h ?? 0,
        };
        setColor(newColor);
        onPreview(token.name, formatOklch(newColor));
      }
    },
    [onPreview, token.name]
  );

  // Handle ColorInputFields changes (RGBA) → convert to OKLCH
  const handleInputFieldsChange = useCallback(
    (c: RgbaColor) => {
      const oklch = toOklch({ mode: "rgb" as const, r: c.r / 255, g: c.g / 255, b: c.b / 255 });
      if (oklch) {
        const newColor: OklchColor = {
          l: oklch.l ?? 0.5,
          c: oklch.c ?? 0.1,
          h: oklch.h ?? 0,
        };
        setColor(newColor);
        onPreview(token.name, formatOklch(newColor));
      }
    },
    [onPreview, token.name]
  );

  const handleSave = async () => {
    const selector = theme === "dark" ? ".dark" : ":root";
    try {
      const res = await fetch("/api/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: cssFilePath,
          token: token.name,
          value: formatOklch(color),
          selector,
        }),
      });
      const data = await res.json();
      if (!data.ok) console.error("Token save failed:", data.error);
    } catch (err) {
      console.error("Token save error:", err);
    }
    onClose();
  };

  const contrastRatio = contrastToken
    ? getContrastRatio(contrastToken.resolvedValue, formatOklch(color))
    : null;

  return createPortal(
    <div
      ref={popoverRef}
      className="studio-popover"
      style={{ top: position.top, left: position.left, width: 260 }}
    >
      {/* Token name + contrast */}
      <div className="flex items-center justify-between px-1 mb-1.5">
        <span
          className="text-[11px] font-mono truncate"
          style={{ color: "var(--studio-text)" }}
        >
          {token.name.replace(/^--/, "")}
        </span>
        {contrastRatio !== null && (
          <span
            className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{
              color:
                contrastRatio >= 7
                  ? "var(--studio-success)"
                  : contrastRatio >= 4.5
                    ? "var(--studio-warning)"
                    : "var(--studio-danger)",
              background: "var(--studio-input-bg)",
            }}
          >
            {contrastRatio.toFixed(1)}:1
          </span>
        )}
      </div>

      {/* Visual color picker */}
      <style>{`
        .token-color-picker .react-colorful {
          width: 100% !important;
          height: 140px !important;
          gap: 8px !important;
        }
        .token-color-picker .react-colorful__saturation {
          border-radius: 6px !important;
        }
        .token-color-picker .react-colorful__hue,
        .token-color-picker .react-colorful__alpha {
          height: 10px !important;
          border-radius: 5px !important;
        }
        .token-color-picker .react-colorful__pointer {
          width: 14px !important;
          height: 14px !important;
          border-width: 2px !important;
        }
      `}</style>
      <div className="token-color-picker" style={{ marginBottom: 8 }}>
        <RgbaColorPicker color={rgba} onChange={handlePickerChange} />
      </div>

      {/* Mode tabs */}
      <div style={{ marginBottom: 8 }}>
        <ModeTabs mode={inputMode} onChange={setInputMode} />
      </div>

      {/* Channel inputs per mode */}
      <div style={{ marginBottom: 8 }}>
        <ColorInputFields color={rgba} onChange={handleInputFieldsChange} mode={inputMode} />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="w-full py-1.5 rounded text-[11px] font-medium cursor-pointer"
        style={{
          background: "var(--studio-accent)",
          color: "white",
          border: "none",
        }}
      >
        Save
      </button>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// Slider row
// ---------------------------------------------------------------------------

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-[9px] font-mono w-3"
        style={{ color: "var(--studio-text-dimmed)" }}
      >
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1"
      />
      <span
        className="text-[10px] font-mono w-9 text-right"
        style={{ color: "var(--studio-text-muted)" }}
      >
        {displayValue}
      </span>
    </div>
  );
}
