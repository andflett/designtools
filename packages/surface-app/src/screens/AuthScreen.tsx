import { useState, useEffect, useRef } from "react";
import { commands } from "../lib/invoke.js";
import type { DeviceFlowStart } from "../lib/types.js";

interface Props {
  onComplete: (token: string) => void;
}

export function AuthScreen({ onComplete }: Props) {
  const [flow, setFlow] = useState<DeviceFlowStart | null>(null);
  const [status, setStatus] = useState<"starting" | "waiting" | "error">("starting");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startFlow = async () => {
    setStatus("starting");
    setError(null);
    try {
      const data = await commands.startDeviceFlow();
      setFlow(data);
      setStatus("waiting");

      const intervalMs = Math.max(data.interval, 5) * 1000;
      pollRef.current = setInterval(async () => {
        try {
          const result = await commands.pollDeviceFlow(data.deviceCode);
          if (result.status === "authorized" && result.token) {
            clearInterval(pollRef.current!);
            await commands.storeToken(result.token);
            onComplete(result.token);
          } else if (result.status === "expired" || result.status === "access_denied") {
            clearInterval(pollRef.current!);
            setError(
              result.status === "access_denied"
                ? "Authorization was denied."
                : "Code expired — please try again."
            );
            setStatus("error");
          }
        } catch {
          // transient poll errors are fine — keep polling
        }
      }, intervalMs);
    } catch (e: any) {
      setError(e.message || "Failed to start authorization");
      setStatus("error");
    }
  };

  useEffect(() => {
    startFlow();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const copyCode = async () => {
    if (!flow) return;
    await navigator.clipboard.writeText(flow.userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <Logo />
        </div>
        <h1 className="auth-title">DesignTools</h1>
        <p className="auth-subtitle">Connect your GitHub account to get started</p>

        {status === "starting" && (
          <div className="auth-status">
            <div className="spinner spinner-sm" />
            <span>Starting authorization…</span>
          </div>
        )}

        {status === "waiting" && flow && (
          <div className="auth-flow">
            <p className="auth-instruction">
              Open <strong>github.com/login/device</strong> and enter this code:
            </p>
            <button className="auth-code" onClick={copyCode} title="Click to copy">
              {flow.userCode}
            </button>
            <p className="auth-hint">{copied ? "Copied!" : "Click to copy"}</p>
            <a
              className="auth-open-link"
              href={flow.verificationUri}
              target="_blank"
              rel="noreferrer"
            >
              Open github.com/login/device ↗
            </a>
            <div className="auth-waiting">
              <div className="spinner spinner-sm" />
              <span>Waiting for authorization…</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="auth-flow">
            <p className="auth-error">{error}</p>
            <button className="btn btn-primary" onClick={startFlow}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="9" fill="var(--accent)" />
      <path d="M9 27V9h4.5l4.5 9 4.5-9H27v18h-4.5V18l-4.5 6.75L13.5 18v9H9z" fill="white" />
    </svg>
  );
}
