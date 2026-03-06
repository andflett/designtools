import { useState } from "react";
import { Reveal } from "./reveal.js";

/* ─────────────────────────────────────────────────
   Shared diagram primitives
   ───────────────────────────────────────────────── */

function PArrow() {
  return (
    <div className="flex items-center shrink-0 self-center max-md:rotate-90">
      <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
        <line x1="0" y1="5" x2="22" y2="5" stroke="#a1a1aa" strokeWidth="1.5" />
        <path d="M22 5L17 2v6l5-3z" fill="#a1a1aa" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Shared three-stage pipeline
   ───────────────────────────────────────────────── */

function Stage({ label, sub, variant = "default" }: { label: string; sub: string; variant?: "default" | "highlight" }) {
  return (
    <div className={`relative flex-1 rounded-lg border px-4 py-4 ${variant === "highlight" ? "border-zinc-800 bg-zinc-800" : "border-edge bg-page text-ink"}`}>
      <div className={`text-[14px] font-mono font-medium leading-snug ${variant === "highlight" ? "text-white" : "text-ink"}`}>{label}</div>
      <div className={`text-[12px] mt-1.5 leading-snug ${variant === "highlight" ? "text-zinc-300" : "text-ink2"}`}>{sub}</div>
    </div>
  );
}

function DeterministicDiagram() {
  return (
    <div className="flex max-md:flex-col items-stretch gap-2">
      <Stage label="Code Plugin" sub="scans your code to build an editor UI that promotes use of your established design system" />
      <PArrow />
      <Stage label="Visual Editor" sub="framework-agnostic visual controls" variant="highlight" />
      <PArrow />
      <Stage label="Write adapter" sub="one per stack" />
    </div>
  );
}

function AiWritesDiagram() {
  return (
    <div className="flex max-md:flex-col items-stretch gap-2">
      <Stage label="Code Plugin" sub="scans your code to build an editor UI that promotes use of your established design system" />
      <PArrow />
      <Stage label="Visual Editor" sub="framework-agnostic visual controls" variant="highlight" />
      <PArrow />
      <Stage label="AI + customisable skills" sub="any stack" />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Skill examples
   ───────────────────────────────────────────────── */

const skills = [
  {
    file: "skills/base.skill.md",
    code: `# Base skill

Make only the change requested.
Never reformat surrounding code.
Output the complete file, not a diff.

# Example
Before: <div className="p-4 text-sm">
After:  <div className="p-6 text-sm">`,
  },
  {
    file: "skills/tailwind-v4.skill.md",
    code: `# Tailwind v4

Edit className props using Tailwind utility classes.
Use scale values: p-4 is 16px, p-6 is 24px.
Prefer design system classes over raw values.`,
  },
  {
    file: "project/my-app.skill.md",
    code: `# My app

Use cn() from @/lib/utils for class composition.
Color tokens live in globals.css, prefer those.
Don't touch variant definitions unless asked.`,
  },
];

const skillLayers = [
  {
    n: "01",
    title: "App Framework",
    desc: "Teaches the model to make precise edits. Change only what's asked, leave everything else exactly as-is.",
    code: skills[0].code,
    file: skills[0].file,
  },
  {
    n: "02",
    title: "Styling System",
    desc: "Tells the model which design language the project uses: spacing scales, color utilities, how values are expressed.",
    code: skills[1].code,
    file: skills[1].file,
  },
  {
    n: "03",
    title: "Your Project",
    desc: "Your team's patterns and decisions: which helpers to use, where tokens live, what to never touch. Checked into the repo.",
    code: skills[2].code,
    file: skills[2].file,
    accent: true,
  },
];

function SkillLayers() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-edge">
      {skillLayers.map((layer, i) => (
        <div
          key={layer.n}
          className="border-b border-edge last:border-0 bg-page hover:bg-raised/50 transition-colors cursor-pointer group"
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div className="flex items-center gap-4 px-5 py-4 text-left">
            <span className="text-[10px] font-mono text-ink3 shrink-0">{layer.n}</span>
            <div className="flex-1 min-w-0">
              <span className={`text-[14px] font-medium block mb-0.5 ${layer.accent ? "text-sel" : "text-ink"}`}>{layer.title}</span>
              <p className="text-[12px] text-ink2 leading-relaxed">{layer.desc}</p>
            </div>
            {/* Eyeball icon */}
            <div className={`shrink-0 transition-colors ${open === i ? "text-ink" : "text-ink3 group-hover:text-ink2"}`}>
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                <path d="M1 6C1 6 4 1 9 1s8 5 8 5-3 5-8 5S1 6 1 6z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                <circle cx="9" cy="6" r="2" stroke="currentColor" strokeWidth="1.25"/>
              </svg>
            </div>
          </div>
          {open === i && (
            <div className="px-5 pb-5">
              <CodeBlock code={layer.code} label={layer.file} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "#1f1f1f" }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#333" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#333" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#333" }} />
        </div>
        <span className="text-[11px] font-mono ml-1" style={{ color: "#555" }}>{label}</span>
      </div>
      <pre className="p-5 text-[12px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ color: "#a0a0a0" }}>{code}</pre>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Trade-off comparison
   ───────────────────────────────────────────────── */

const tradeoffs = [
  {
    dimension: "Write reliability",
    deterministic: "Byte-perfect. AST edits preserve exact formatting.",
    ai: "Probabilistic. Strong skills + constrained prompts push accuracy high.",
    det: "strong",
    ai_score: "neutral",
  },
  {
    dimension: "New stack support",
    deterministic: "Write code for every framework × styling system combo.",
    ai: "Write a skill file. One model handles every stack.",
    det: "weak",
    ai_score: "strong",
  },
  {
    dimension: "Latency",
    deterministic: "< 50ms. Pure code path, no inference.",
    ai: "Seconds. Even local models add inference overhead.",
    det: "strong",
    ai_score: "weak",
  },
  {
    dimension: "Cross-file reasoning",
    deterministic: "Hard. Must write explicit code for each cross-file pattern.",
    ai: "Natural. Model sees all relevant files in context.",
    det: "weak",
    ai_score: "strong",
  },
  {
    dimension: "Novel patterns",
    deterministic: "Fails silently or falls back to inline styles.",
    ai: "Handles gracefully — reads the code, understands the pattern.",
    det: "weak",
    ai_score: "strong",
  },
  {
    dimension: "Project conventions",
    deterministic: "Hard-coded detection heuristics per project.",
    ai: "Project skill files — written once, shared across the team.",
    det: "weak",
    ai_score: "strong",
  },
  {
    dimension: "Offline / air-gapped",
    deterministic: "Fully local. Zero network dependency.",
    ai: "Local model (e.g. Claude running locally) — stays fully offline.",
    det: "strong",
    ai_score: "strong",
  },
  {
    dimension: "Auditability",
    deterministic: "Obvious git diff. One change, one line.",
    ai: "Still git diff — model outputs full file, diff is the delta.",
    det: "strong",
    ai_score: "neutral",
  },
];

type Score = "strong" | "neutral" | "weak";

function ScoreBadge({ score }: { score: Score }) {
  const styles: Record<Score, string> = {
    strong: "bg-emerald-50 text-emerald-700 border-emerald-200",
    neutral: "bg-amber-50 text-amber-700 border-amber-200",
    weak: "bg-red-50 text-red-700 border-red-200",
  };
  const labels: Record<Score, string> = {
    strong: "✓ strong",
    neutral: "~ ok",
    weak: "✗ weak",
  };
  return (
    <span className={`inline-flex items-center justify-center w-[72px] px-2 py-0.5 rounded border text-[10px] font-mono ${styles[score]}`}>
      {labels[score]}
    </span>
  );
}

/* ─────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────── */

export function AiWritesExploration() {
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <div className="relative graph-grid-fade pt-24 pb-12 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6 relative">
          <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-4 font-mono">
            Architecture Exploration
          </p>
          <h1
            className="text-[clamp(2rem,4.5vw,3.2rem)] font-medium tracking-[0.03em] leading-[1.1] mb-3"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            Deterministic vs AI write models
          </h1>
          <p className="text-base text-ink2 max-w-[580px] leading-relaxed mb-6">
            Surface currently writes changes via deterministic plugins. One per
            app framework and styling system combination. The below explores
            replacing that layer with a locally-running AI model guided by
            composable write skills.
          </p>
        </div>
      </div>

      {/* Two diagrams side by side */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="flex flex-col gap-12">
            {/* Model 1 */}
            <Reveal>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-mono text-ink3 uppercase tracking-widest mb-2">
                    Model A — current
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight mb-2">
                    Deterministic Writes
                  </h2>
                  <p className="text-[13px] text-ink2 leading-relaxed">
                    Each supported framework and styling system gets a
                    hand-written adapter. Output is byte-precise and fast, but
                    the adapter matrix grows with every new stack.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-edge bg-raised shadow-xs overflow-hidden scanlines">
                  <DeterministicDiagram />
                </div>
              </div>
            </Reveal>

            {/* Model 2 */}
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-mono text-sel uppercase tracking-widest mb-2">
                    Model B — proposed
                  </p>
                  <h2 className="text-xl font-semibold tracking-tight mb-2">
                    AI Writes
                  </h2>
                  <p className="text-[13px] text-ink2 leading-relaxed">
                    The editor builds a structured prompt. A local model makes
                    the change, guided by composable write skills that encode
                    how to write for each stack and project.
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-edge bg-raised shadow-xs overflow-hidden scanlines">
                  <AiWritesDiagram />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Write Skills section */}
      <section className="py-20 border-b border-edge bg-raised checker-dither">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-2 font-mono">
              Core concept
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
              Customisable AI Write skills
            </h2>
            <p className="text-[14px] text-ink2 max-w-[700px] leading-relaxed mb-8">
              Skills replace plugin code. Structured prompt files that teach the
              model how to make changes, covering language mechanics, framework
              patterns, and project conventions. The concept builds on{" "}
              <a href="https://skills.sh/" target="_blank" rel="noopener" className="text-sel hover:underline">skills.sh</a>,
              and ships with defaults for common stacks, similar to how Vercel
              provides{" "}
              <a href="https://vercel.com/blog/introducing-react-best-practices" target="_blank" rel="noopener" className="text-sel hover:underline">React & Next.js best-practice skills</a>{" "}
              for their framework. These defaults are fully customisable per
              project.
            </p>
          </Reveal>

          {/* Skill layers with inline expand */}
          <Reveal delay={0.08}>
            <SkillLayers />
          </Reveal>
        </div>
      </section>

      {/* What the prompt looks like */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Prompt structure
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
              What the editor sends to AI model
            </h2>
            <p className="text-[14px] text-ink2 max-w-[600px] leading-relaxed mb-10">
              The Prompt Builder gathers everything the model needs: the stacked
              skills, the current file content, the element's coordinates from
              its{" "}
              <code className="font-mono text-[12px] bg-muted px-1.5 py-0.5 rounded border border-edge-subtle">
                data-source
              </code>{" "}
              attribute, and a precise description of the intended change.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <CodeBlock
              label="prompt (assembled at write time)"
              code={`[SKILL 01 — App Framework — skills/base.skill.md]
Make only the change requested.
Never reformat surrounding code.
Output the complete file, not a diff.

[SKILL 02 — Styling System — skills/tailwind-v4.skill.md]
Edit className props using Tailwind utility classes.
Use scale values: p-4 is 16px, p-6 is 24px.
Prefer design system classes over raw values.

[SKILL 03 — Your Project — project/my-app.skill.md]
Use cn() from @/lib/utils for class composition.
Color tokens live in globals.css, prefer those.
Don't touch variant definitions unless asked.

[USER]
File: src/components/page-header.tsx
Element at line 23 col 4 (data-source="src/components/page-header.tsx:23:4")

Current className: "flex items-center gap-4 px-6 py-3"
Change: padding-top and padding-bottom to 24px

[CONTEXT — src/components/page-header.tsx]
... (full file content) ...`}
            />
          </Reveal>
        </div>
      </section>

      {/* Trade-off comparison */}
      <section className="py-20 border-b border-edge bg-raised">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Comparison
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-10">
              Trade-offs
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-edge overflow-hidden bg-page">
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_80px_24px_1fr_80px] max-md:hidden px-4 py-3 bg-muted border-b border-edge text-[10px] font-mono text-ink3 uppercase tracking-widest gap-4">
                <span>Dimension</span>
                <span>Deterministic</span>
                <span></span>
                <span></span>
                <span>AI Writes</span>
                <span></span>
              </div>
              {tradeoffs.map((row, i) => (
                <div
                  key={row.dimension}
                  className={`grid grid-cols-[1fr_1fr_80px_24px_1fr_80px] max-md:grid-cols-1 px-4 py-4 gap-4 text-[13px] border-b border-edge last:border-0 ${i % 2 === 0 ? "bg-page" : "bg-raised/40"}`}
                >
                  <div className="font-mono text-[12px] font-medium text-ink self-start">
                    {row.dimension}
                  </div>
                  <div className="text-ink2 text-[12px] leading-relaxed self-start max-md:border-t max-md:border-edge max-md:pt-3">
                    <span className="text-[10px] font-mono text-ink3 flex items-center gap-2 md:hidden mb-1">
                      Deterministic <ScoreBadge score={row.det as Score} />
                    </span>
                    {row.deterministic}
                  </div>
                  <div className="self-start justify-self-end max-md:hidden pl-12">
                    <ScoreBadge score={row.det as Score} />
                  </div>
                  <div className="max-md:hidden" />
                  <div className="text-ink2 text-[12px] leading-relaxed self-start">
                    <span className="text-[10px] font-mono text-ink3 flex items-center gap-2 md:hidden mb-1">
                      AI Writes <ScoreBadge score={row.ai_score as Score} />
                    </span>
                    {row.ai}
                  </div>
                  <div className="self-start justify-self-end max-md:hidden">
                    <ScoreBadge score={row.ai_score as Score} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hybrid thinking */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Design space
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-5">
              These aren't mutually exclusive
            </h2>
            <p className="text-[14px] text-ink2 max-w-[620px] leading-relaxed mb-12">
              The strongest version of this might be a hybrid: deterministic
              adapters for the well-understood cases where byte-precision
              matters, and AI writes as a fallback for novel stacks, complex
              patterns, or when no adapter exists yet.
            </p>
          </Reveal>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px bg-edge-subtle rounded-xl overflow-hidden border border-edge-subtle">
            {[
              {
                title: "Deterministic first",
                desc: "When a known adapter exists for the detected stack, use it. Fast, precise, zero model latency.",
              },
              {
                title: "AI as fallback",
                desc: "Unknown styling system? Unusual computed className pattern? Hand off to the model with the closest matching skills.",
              },
              {
                title: "Project skill as config",
                desc: "The project skill file doubles as a configuration layer — reducing per-project detection heuristics in favor of explicit human-written context.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="bg-page p-7 h-full">
                  <div className="text-[10px] font-mono text-ink3 mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-[14px] font-semibold tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-ink2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <div className="border-t border-edge py-6 bg-raised">
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink3">
            Surface — architecture exploration
          </span>
          <a
            href="/"
            className="text-[11px] font-mono text-ink3 hover:text-ink transition-colors"
          >
            ← back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
