/**
 * Boot screen — fake loading/scanning animation shown on first load.
 * Purely cosmetic. To disable before publishing, just set SHOW_BOOT_SCREEN = false
 * in app.tsx or remove the <BootScreen /> mount entirely.
 */

import { useState, useEffect, useCallback } from "react";
import type { ScanData } from "../app.js";

interface BootStep {
  label: string;
  duration: number; // ms to "complete" this step
}

function useBootSequence(scanData: ScanData | null) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<
    { label: string; detail: string; elapsed: number }[]
  >([]);
  const [done, setDone] = useState(false);

  const steps: BootStep[] = [
    { label: "Connecting to dev server", duration: 600 },
    { label: "Detecting framework", duration: 900 },
    { label: "Detecting styling system", duration: 700 },
    { label: "Parsing components via AST", duration: 1200 },
    { label: "Scanning design tokens", duration: 900 },
    { label: "Injecting data-source attributes", duration: 800 },
    { label: "Resolving routes", duration: 500 },
    { label: "Ready", duration: 400 },
  ];

  function getDetail(stepIndex: number, scan: ScanData | null): string {
    if (!scan) return "";
    switch (stepIndex) {
      case 0:
        return "localhost:3000";
      case 1:
        return scan.framework?.name
          ? `→ ${scan.framework.name}`
          : "→ Next.js + React";
      case 2: {
        const t = scan.styling?.type || "tailwind-v4";
        const labels: Record<string, string> = {
          "tailwind-v4": "Tailwind CSS v4",
          "tailwind-v3": "Tailwind CSS v3",
          bootstrap: "Bootstrap 5",
          "css-variables": "CSS Custom Properties",
          "plain-css": "Plain CSS",
        };
        return `→ ${labels[t] || t}`;
      }
      case 3: {
        const count = scan.components?.components?.length ?? 0;
        const totalVariants = scan.components?.components?.reduce(
          (sum, c) => sum + (c.variants?.length ?? 0),
          0
        ) ?? 0;
        return `→ ${count} component${count !== 1 ? "s" : ""}, ${totalVariants} variant prop${totalVariants !== 1 ? "s" : ""} extracted`;
      }
      case 4: {
        const tokens = scan.tokens?.tokens?.length ?? 0;
        const shadows = scan.shadows?.shadows?.length ?? 0;
        const borders = scan.borders?.borders?.length ?? 0;
        const gradients = scan.gradients?.gradients?.length ?? 0;
        const total = tokens + shadows + borders + gradients;
        const groups = scan.tokens?.groups
          ? Object.keys(scan.tokens.groups).length
          : 0;
        return `→ ${total} token${total !== 1 ? "s" : ""} across ${groups} group${groups !== 1 ? "s" : ""} (colors, shadows, borders, gradients)`;
      }
      case 5: {
        const cssFiles = scan.styling?.cssFiles?.length ?? 0;
        return `→ Babel transform · file:line:col on every JSX element · ${cssFiles} source file${cssFiles !== 1 ? "s" : ""}`;
      }
      case 6: {
        const appDir = scan.framework?.appDir || "app";
        return `→ mapped /${appDir} routes to source files`;
      }
      case 7:
        return "all systems go";
      default:
        return "";
    }
  }

  useEffect(() => {
    if (done || currentStep >= steps.length) return;

    const step = steps[currentStep];
    const tick = 50;
    const ticks = Math.ceil(step.duration / tick);
    let t = 0;

    const iv = setInterval(() => {
      t++;
      setStepProgress(Math.min(t / ticks, 1));

      if (t >= ticks) {
        clearInterval(iv);
        const detail = getDetail(currentStep, scanData);
        setCompletedSteps((prev) => [
          ...prev,
          { label: step.label, detail, elapsed: step.duration },
        ]);
        setStepProgress(0);

        if (currentStep + 1 >= steps.length) {
          setDone(true);
        } else {
          setCurrentStep((s) => s + 1);
        }
      }
    }, tick);

    return () => clearInterval(iv);
  }, [currentStep, done, scanData]);

  const activeStep = !done && currentStep < steps.length ? steps[currentStep] : null;

  return { completedSteps, activeStep, stepProgress, done, totalSteps: steps.length };
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function Spinner() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setFrame((f) => (f + 1) % SPINNER_FRAMES.length), 80);
    return () => clearInterval(iv);
  }, []);
  return <span style={{ color: "var(--studio-accent)" }}>{SPINNER_FRAMES[frame]}</span>;
}

function ProgressBar({ progress, width = 24 }: { progress: number; width?: number }) {
  const filled = Math.round(progress * width);
  const empty = width - filled;
  return (
    <span style={{ color: "var(--studio-text-dimmed)" }}>
      [
      <span style={{ color: "var(--studio-accent)" }}>{"█".repeat(filled)}</span>
      <span style={{ opacity: 0.3 }}>{"░".repeat(empty)}</span>
      ]
    </span>
  );
}

const ASCII_LOGO = `
 ┌─────────────────────────────────┐
 │   ╔═╗╔═╗╔╦╗╔═╗  ╔═╗╔═╗╔╗╔╦  ╦ │
 │   ║  ║ ║ ║║║╣   ║  ╠═╣║║║╚╗╔╝ │
 │   ╚═╝╚═╝═╩╝╚═╝  ╚═╝╩ ╩╝╚╝ ╚╝  │
 └─────────────────────────────────┘`;

export function BootScreen({
  scanData,
  onContinue,
}: {
  scanData: ScanData | null;
  onContinue: () => void;
}) {
  const { completedSteps, activeStep, stepProgress, done, totalSteps } =
    useBootSequence(scanData);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(iv);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (done && (e.key === "Enter" || e.key === " ")) {
        onContinue();
      }
    },
    [done, onContinue]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--studio-bg)",
        color: "var(--studio-text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace',
        fontSize: 13,
        lineHeight: 1.7,
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          border: "1px solid var(--studio-border)",
          borderRadius: 8,
          background: "var(--studio-surface)",
          padding: "32px 40px",
          maxWidth: 560,
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        {/* ASCII logo */}
        <pre
          style={{
            color: "var(--studio-accent)",
            fontSize: 11,
            lineHeight: 1.3,
            textAlign: "center",
            margin: "0 0 8px 0",
            userSelect: "none",
          }}
        >
          {ASCII_LOGO}
        </pre>

        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: "var(--studio-text-dimmed)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          visual design tooling · v0.1.0
        </div>

        {/* Separator */}
        <div
          style={{
            borderTop: "1px solid var(--studio-border-subtle)",
            margin: "0 -40px 20px -40px",
          }}
        />

        {/* Completed steps */}
        <div style={{ minHeight: 180 }}>
          {completedSteps.map((step, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "baseline",
                  opacity: i < completedSteps.length - 4 ? 0.4 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <span style={{ color: "var(--studio-success)", flexShrink: 0 }}>✓</span>
                <span style={{ color: "var(--studio-text-muted)" }}>{step.label}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: "var(--studio-text-dimmed)",
                    fontSize: 10,
                    flexShrink: 0,
                  }}
                >
                  {step.elapsed}ms
                </span>
              </div>
              {step.detail && (
                <div
                  style={{
                    color: "var(--studio-text-dimmed)",
                    fontSize: 11,
                    paddingLeft: 22,
                    marginTop: -2,
                    opacity: i < completedSteps.length - 4 ? 0.4 : 0.7,
                    transition: "opacity 0.3s",
                  }}
                >
                  {step.detail}
                </div>
              )}
            </div>
          ))}

          {/* Active step */}
          {activeStep && (
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <Spinner />
              <span>{activeStep.label}</span>
              <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                <ProgressBar progress={stepProgress} width={16} />
              </span>
            </div>
          )}
        </div>

        {/* Separator */}
        <div
          style={{
            borderTop: "1px solid var(--studio-border-subtle)",
            margin: "20px -40px 20px -40px",
          }}
        />

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          {done ? (
            <button
              onClick={onContinue}
              style={{
                background: "var(--studio-accent)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 28px",
                fontFamily: "inherit",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                letterSpacing: "0.02em",
                transition: "background 0.15s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "var(--studio-accent-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "var(--studio-accent)")
              }
            >
              Enter Editor{" "}
              <span style={{ opacity: 0.6, fontSize: 11 }}>↵</span>
            </button>
          ) : (
            <span style={{ color: "var(--studio-text-dimmed)", fontSize: 11 }}>
              scanning project
              <span style={{ opacity: showCursor ? 1 : 0 }}>▌</span>
            </span>
          )}
        </div>

        {/* Step counter */}
        <div
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 10,
            color: "var(--studio-text-dimmed)",
            opacity: 0.5,
          }}
        >
          {completedSteps.length}/{totalSteps} checks
        </div>
      </div>
    </div>
  );
}
