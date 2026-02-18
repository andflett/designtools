import { useState } from "react";
import { ShadowPreview } from "./shadow-preview.js";

interface ShadowOverviewProps {
  shadows: any[];
}

const BACKGROUNDS = [
  { name: "White", value: "white" },
  { name: "Light", value: "#f5f5f5" },
  { name: "Dark", value: "#1a1a2e" },
  { name: "Blue", value: "#e0f2fe" },
  { name: "Warm", value: "#fef3c7" },
];

export function ShadowOverview({ shadows }: ShadowOverviewProps) {
  const [activeBg, setActiveBg] = useState("white");
  const [previewSize, setPreviewSize] = useState(64);

  return (
    <div>
      {/* Background selector */}
      <div className="px-4 py-2 flex items-center gap-2">
        <span
          className="text-[9px] font-semibold uppercase tracking-wide shrink-0"
          style={{ color: "var(--studio-text-dimmed)" }}
        >
          BG
        </span>
        <div className="flex gap-1">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => setActiveBg(bg.value)}
              className="shrink-0 cursor-pointer"
              title={bg.name}
              style={{
                width: 18,
                height: 18,
                borderRadius: 3,
                background: bg.value,
                border:
                  activeBg === bg.value
                    ? "2px solid var(--studio-accent)"
                    : "1px solid var(--studio-border)",
              }}
            />
          ))}
        </div>
        <div className="flex-1" />
        <select
          value={previewSize}
          onChange={(e) => setPreviewSize(parseInt(e.target.value))}
          className="studio-select"
          style={{ fontSize: 10, width: 50 }}
        >
          <option value={48}>S</option>
          <option value={64}>M</option>
          <option value={96}>L</option>
        </select>
      </div>

      {/* Shadow grid */}
      <div
        className="grid gap-4 px-4 py-3"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${previewSize + 24}px, 1fr))`,
        }}
      >
        {shadows.map((shadow: any) => (
          <div key={shadow.name} className="flex flex-col items-center gap-1.5">
            <div
              className="flex items-center justify-center rounded-lg p-3"
              style={{
                background: activeBg,
                width: previewSize + 24,
                height: previewSize + 24,
              }}
            >
              <ShadowPreview
                value={shadow.value}
                size={previewSize}
                background={activeBg}
              />
            </div>
            <span
              className="text-[9px] font-mono text-center truncate w-full"
              style={{ color: "var(--studio-text-muted)" }}
            >
              {shadow.name}
            </span>
          </div>
        ))}
      </div>

      {shadows.length === 0 && (
        <div
          className="px-4 py-6 text-center text-[11px]"
          style={{ color: "var(--studio-text-dimmed)" }}
        >
          No shadows to display
        </div>
      )}
    </div>
  );
}
