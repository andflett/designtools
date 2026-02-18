import { useState, useRef, useEffect } from "react";
import { Half2Icon } from "@radix-ui/react-icons";

export interface PreviewSettings {
  previewBg: string;
  showBorder: boolean;
  borderColor: string;
}

export const DEFAULT_PREVIEW_SETTINGS: PreviewSettings = {
  previewBg: "rgb(240, 244, 250)",
  showBorder: false,
  borderColor: "#e8e8e8",
};

const BG_SWATCHES = [
  { name: "Soft Blue", value: "rgb(240, 244, 250)" },
  { name: "White", value: "white" },
  { name: "Light Gray", value: "#f0f0f0" },
  { name: "Gray", value: "#e0e0e0" },
  { name: "Mid Gray", value: "#d0d0d0" },
  { name: "Dark Gray", value: "#bbb" },
];

const BORDER_COLORS = [
  { name: "Lightest", value: "#eee" },
  { name: "Light", value: "#e0e0e0" },
  { name: "Medium", value: "#d0d0d0" },
  { name: "Dark", value: "#bbb" },
];

interface ShadowPreviewSettingsProps {
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
}

export function ShadowPreviewSettingsButton({
  settings,
  onChange,
}: ShadowPreviewSettingsProps) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "3px 8px 3px 6px",
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 500,
          color: open ? "var(--studio-accent)" : "var(--studio-text-dimmed)",
          background: open ? "var(--studio-accent-muted)" : "var(--studio-input-bg)",
          border: "1px solid",
          borderColor: open ? "var(--studio-accent)" : "var(--studio-border)",
          transition: "all 0.15s",
        }}
      >
        <Half2Icon style={{ width: 12, height: 12 }} />
        Settings
      </button>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 4,
            background: "var(--studio-surface)",
            border: "1px solid var(--studio-border)",
            borderRadius: 8,
            padding: "12px 14px",
            zIndex: 100,
            width: 248,
            boxShadow: "0 8px 24px rgb(0 0 0 / 0.15)",
          }}
        >
          <div className="flex flex-col gap-3.5">
            {/* Background */}
            <div>
              <div
                className="text-[9px] font-semibold uppercase tracking-wide mb-2"
                style={{ color: "var(--studio-text-dimmed)" }}
              >
                Preview Background
              </div>
              <div className="flex gap-1.5">
                {BG_SWATCHES.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() =>
                      onChange({ ...settings, previewBg: bg.value })
                    }
                    className="shrink-0 cursor-pointer"
                    title={bg.name}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 5,
                      background: bg.value,
                      border:
                        settings.previewBg === bg.value
                          ? "2px solid var(--studio-accent)"
                          : "1px solid var(--studio-border)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Borders */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div
                  className="text-[9px] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--studio-text-dimmed)" }}
                >
                  Show card borders
                </div>
                <button
                  onClick={() =>
                    onChange({
                      ...settings,
                      showBorder: !settings.showBorder,
                    })
                  }
                  className="shrink-0 cursor-pointer"
                  style={{
                    width: 34,
                    height: 20,
                    borderRadius: 10,
                    border: "1px solid var(--studio-border)",
                    background: settings.showBorder
                      ? "var(--studio-accent)"
                      : "var(--studio-input-bg)",
                    position: "relative",
                    transition: "background 0.15s",
                  }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: "white",
                      position: "absolute",
                      top: 2,
                      left: settings.showBorder ? 16 : 2,
                      transition: "left 0.15s",
                      boxShadow: "0 1px 2px rgb(0 0 0 / 0.15)",
                    }}
                  />
                </button>
              </div>
              {settings.showBorder && (
                <div className="flex gap-1.5">
                  {BORDER_COLORS.map((bc) => (
                    <button
                      key={bc.value}
                      onClick={() =>
                        onChange({ ...settings, borderColor: bc.value })
                      }
                      className="shrink-0 cursor-pointer"
                      title={bc.name}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 5,
                        background: bc.value,
                        border:
                          settings.borderColor === bc.value
                            ? "2px solid var(--studio-accent)"
                            : "1px solid var(--studio-border)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
