import { useState } from "react";
import { ShadowPreview } from "./shadow-preview.js";
import type { PreviewSettings } from "./shadow-preview-settings.js";

interface ShadowOverviewProps {
  shadows: any[];
  previewSettings: PreviewSettings;
}

type OverviewSize = "small" | "large";

export function ShadowOverview({ shadows, previewSettings }: ShadowOverviewProps) {
  const [size, setSize] = useState<OverviewSize>("small");

  return (
    <div>
      {/* Size toggle tabs */}
      <div
        className="px-4 py-2 shrink-0"
      >
        <div className="studio-segmented" style={{ width: "100%" }}>
          <button
            onClick={() => setSize("small")}
            className={size === "small" ? "active" : ""}
            style={{ flex: 1 }}
          >
            Small
          </button>
          <button
            onClick={() => setSize("large")}
            className={size === "large" ? "active" : ""}
            style={{ flex: 1 }}
          >
            Large
          </button>
        </div>
      </div>

      {/* Shadow grid */}
      {size === "small" ? (
        <div
          className="grid gap-3 px-4 py-3"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          {shadows.map((shadow: any) => (
            <div key={shadow.name} className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-xl w-full"
                style={{
                  background: previewSettings.previewBg,
                  height: 100,
                }}
              >
                <ShadowPreview
                  value={shadow.value}
                  size={56}
                  background="white"
                  showBorder={previewSettings.showBorder}
                  borderColor={previewSettings.borderColor}
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
      ) : (
        <div className="flex flex-col gap-3 px-4 py-3">
          {shadows.map((shadow: any) => (
            <div key={shadow.name} className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-xl w-full"
                style={{
                  background: previewSettings.previewBg,
                  height: 200,
                }}
              >
                <ShadowPreview
                  value={shadow.value}
                  size={96}
                  background="white"
                  showBorder={previewSettings.showBorder}
                  borderColor={previewSettings.borderColor}
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
      )}

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
