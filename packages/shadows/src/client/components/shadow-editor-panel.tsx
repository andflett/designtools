import { useState } from "react";
import {
  Cross2Icon,
  ShadowIcon,
  MixerHorizontalIcon,
  GridIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import type { ShadowsScanData } from "../app.js";
import type { ElementData } from "@designtools/core/client/lib/iframe-bridge";
import { ShadowList } from "./shadow-list.js";
import { ShadowOverview } from "./shadow-overview.js";

type ViewMode = "list" | "overview";

interface ShadowEditorPanelProps {
  scanData: ShadowsScanData | null;
  selectedElement: ElementData | null;
  onPreviewShadow: (variableName: string, value: string) => void;
}

export function ShadowEditorPanel({
  scanData,
  selectedElement,
  onPreviewShadow,
}: ShadowEditorPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  if (!scanData) {
    return (
      <div
        className="flex flex-col border-l studio-scrollbar"
        style={{
          width: 340,
          minWidth: 340,
          background: "var(--studio-surface)",
          borderColor: "var(--studio-border)",
        }}
      >
        <div
          className="px-4 py-3 text-[11px]"
          style={{ color: "var(--studio-text-dimmed)" }}
        >
          Scanning project...
        </div>
      </div>
    );
  }

  const modeConfig: Record<ViewMode, { icon: any; label: string }> = {
    list: { icon: MixerHorizontalIcon, label: "Edit" },
    overview: { icon: GridIcon, label: "Overview" },
  };

  return (
    <div
      className="flex flex-col border-l studio-scrollbar overflow-y-auto"
      style={{
        width: 340,
        minWidth: 340,
        background: "var(--studio-surface)",
        borderColor: "var(--studio-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
        style={{ borderColor: "var(--studio-border)" }}
      >
        <div
          className="w-5 h-5 rounded flex items-center justify-center shrink-0"
          style={{ background: "var(--studio-accent-muted)" }}
        >
          <ShadowIcon
            style={{ width: 12, height: 12, color: "var(--studio-accent)" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="text-[12px] font-semibold"
            style={{ color: "var(--studio-text)" }}
          >
            Shadows
          </span>
          <div
            className="text-[10px]"
            style={{ color: "var(--studio-text-dimmed)" }}
          >
            {scanData.shadows.shadows.length} shadow
            {scanData.shadows.shadows.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* View mode switcher */}
      <div
        className="px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: "var(--studio-border)" }}
      >
        <div className="studio-segmented" style={{ width: "100%" }}>
          {(Object.keys(modeConfig) as ViewMode[]).map((mode) => {
            const cfg = modeConfig[mode];
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={viewMode === mode ? "active" : ""}
                style={{ flex: 1 }}
              >
                <cfg.icon style={{ width: 12, height: 12 }} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto studio-scrollbar">
        {viewMode === "list" && (
          <ShadowList
            shadows={scanData.shadows.shadows}
            cssFilePath={scanData.shadows.cssFilePath}
            stylingType={scanData.shadows.stylingType}
            onPreviewShadow={onPreviewShadow}
          />
        )}
        {viewMode === "overview" && (
          <ShadowOverview
            shadows={scanData.shadows.shadows}
          />
        )}
      </div>
    </div>
  );
}
