import { useState, useEffect, useRef } from "react";
import { commands } from "../lib/invoke.js";
import { listen } from "@tauri-apps/api/event";
import type { LaunchProgress } from "../lib/types.js";

interface Props {
  repoUrl: string;
  stagingUrl?: string;
  onBack: () => void;
  onStagingFallback: (repoUrl: string, stagingUrl: string) => void;
}

const PHASE_LABEL: Record<LaunchProgress["phase"], string> = {
  clone: "Cloning repository…",
  install: "Installing dependencies…",
  start: "Starting dev server…",
  wait: "Waiting for dev server…",
  ready: "Surface editor ready",
  error: "Failed",
};

export function LaunchScreen({ repoUrl, stagingUrl, onBack, onStagingFallback }: Props) {
  const [log, setLog] = useState<LaunchProgress[]>([]);
  const [active, setActive] = useState<LaunchProgress["phase"]>("clone");
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stagingInput, setStagingInput] = useState("");
  const unlistenRef = useRef<(() => void) | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      const unlisten = await listen<LaunchProgress>("launch-progress", (event) => {
        if (cancelled) return;
        const p = event.payload;
        setActive(p.phase);
        setLog((prev) => [...prev, p]);
        if (p.phase === "error") {
          setFailed(true);
          setErrorMsg(p.message);
        }
      });
      unlistenRef.current = unlisten;

      try {
        await commands.launchProject(repoUrl, stagingUrl);
      } catch (e: any) {
        if (!cancelled) {
          setFailed(true);
          setErrorMsg(e.message || "Unknown error");
          setLog((prev) => [...prev, { phase: "error", message: e.message || "Unknown error" }]);
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      unlistenRef.current?.();
    };
  }, [repoUrl, stagingUrl]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const handleStagingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = stagingInput.trim();
    if (url) onStagingFallback(repoUrl, url);
  };

  const repoName = repoUrl.replace(/\.git$/, "").split("/").slice(-2).join("/");

  return (
    <div className="screen launch-screen">
      <header className="launch-header" data-tauri-drag-region>
        <button
          className="btn-back"
          onClick={async () => { await commands.stopProject(); onBack(); }}
        >
          ← Back
        </button>
        <span className="launch-repo">{repoName}</span>
      </header>

      <div className="launch-body">
        <div className="launch-log">
          {log.map((p, i) => (
            <div key={i} className={`launch-line launch-line-${p.phase}`}>
              <span className="launch-mark">
                {p.phase === "ready" ? "✓" : p.phase === "error" ? "✗" : "·"}
              </span>
              <span>{p.message || PHASE_LABEL[p.phase]}</span>
            </div>
          ))}
          {!failed && active !== "ready" && (
            <div className="launch-line launch-line-active">
              <span className="launch-mark"><span className="spinner-inline" /></span>
              <span>{PHASE_LABEL[active]}</span>
            </div>
          )}
          <div ref={logEndRef} />
        </div>

        {failed && (
          <div className="launch-fallback">
            <p className="launch-fallback-msg">
              Could not start the dev server locally.
              {errorMsg && <span className="launch-fallback-detail"> {errorMsg}</span>}
            </p>
            <p className="launch-fallback-hint">
              If this app needs a backend, enter your staging URL:
            </p>
            <form onSubmit={handleStagingSubmit} className="launch-fallback-form">
              <input
                className="launch-staging-input"
                placeholder="https://your-staging.example.com"
                value={stagingInput}
                onChange={(e) => setStagingInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" disabled={!stagingInput.trim()}>
                Use staging URL
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
