import { useState, useCallback } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Rocket, ExternalLink, Check, AlertCircle, GitBranch } from "lucide-react";

interface PreviewInfo {
  url: string;
  state: string;
  inspectorUrl?: string;
}

interface PublishResult {
  ok: boolean;
  branch: string;
  sha: string;
  committed: boolean;
  sourceBranch?: string | null;
  preview: PreviewInfo | null;
  previewNote?: string;
}

type Status = "idle" | "publishing" | "done" | "error";

/**
 * Global "Publish preview" action. Commits the designer's edits, pushes them to
 * a preview branch, and surfaces the resulting Vercel preview URL. Lives in the
 * top toolbar because it's a project-level action, not tied to a selection.
 */
export function PublishButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PublishResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publish = useCallback(async () => {
    setStatus("publishing");
    setError(null);
    setResult(null);
    setOpen(true);
    try {
      const res = await fetch("/api/publish-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setResult(data as PublishResult);
      setStatus("done");
    } catch (e: any) {
      setError(e.message || String(e));
      setStatus("error");
    }
  }, []);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="studio-publish-btn"
          onClick={() => {
            if (status !== "publishing") publish();
          }}
          disabled={status === "publishing"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 28,
            padding: "0 12px",
            borderRadius: 6,
            border: "none",
            cursor: status === "publishing" ? "default" : "pointer",
            background: "var(--studio-accent)",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            opacity: status === "publishing" ? 0.7 : 1,
            whiteSpace: "nowrap",
          }}
        >
          <Rocket size={13} strokeWidth={2} />
          <span>{status === "publishing" ? "Publishing…" : "Publish"}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="studio-popover"
          align="end"
          sideOffset={8}
          style={{
            width: 300,
            padding: 14,
            background: "var(--studio-surface)",
            border: "1px solid var(--studio-border)",
            borderRadius: 8,
            color: "var(--studio-text)",
            fontSize: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            zIndex: 9999,
          }}
        >
          {status === "publishing" && (
            <Row icon={<Spinner />}>Committing &amp; pushing to preview…</Row>
          )}

          {status === "error" && (
            <Row icon={<AlertCircle size={14} color="var(--studio-danger, #e5484d)" />}>
              <span style={{ color: "var(--studio-danger, #e5484d)" }}>{error}</span>
            </Row>
          )}

          {status === "done" && result && <PublishResultView result={result} />}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PublishResultView({ result }: { result: PublishResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Row icon={<Check size={14} color="var(--studio-success, #46a758)" />}>
        {result.committed
          ? "Changes committed & pushed"
          : "Pushed (no new changes to commit)"}
      </Row>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--studio-text-dimmed)",
          fontSize: 11,
        }}
      >
        <GitBranch size={12} />
        <span style={{ fontFamily: "monospace" }}>{result.branch}</span>
        <span style={{ opacity: 0.5 }}>· {result.sha.slice(0, 7)}</span>
      </div>

      {result.preview ? (
        <a
          href={result.preview.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 6,
            background: "var(--studio-surface-hover)",
            color: "var(--studio-accent)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {result.preview.url.replace(/^https?:\/\//, "")}
          </span>
          <ExternalLink size={13} style={{ flexShrink: 0 }} />
        </a>
      ) : (
        result.previewNote && (
          <p
            style={{
              margin: 0,
              color: "var(--studio-text-dimmed)",
              fontSize: 11,
              lineHeight: 1.5,
            }}
          >
            {result.previewNote}
          </p>
        )
      )}
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        border: "2px solid var(--studio-border)",
        borderTopColor: "var(--studio-accent)",
        borderRadius: "50%",
        display: "inline-block",
        animation: "studio-spin 0.7s linear infinite",
      }}
    />
  );
}
