import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { codeToHtml } from "shiki";
import { Reveal } from "./reveal.js";

/* ─────────────────────────────────────────────────
   Shared primitives
   ───────────────────────────────────────────────── */

function CodeBlock({
  code,
  label,
  lang = "tsx",
}: {
  code: string;
  label: string;
  lang?: string;
}) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-dark-default",
    }).then(setHtml);
  }, [code, lang]);

  return (
    <div className="rounded-xl overflow-hidden border border-edge-subtle bg-surface">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-edge-subtle">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-edge" />
          <div className="w-2.5 h-2.5 rounded-full bg-edge" />
          <div className="w-2.5 h-2.5 rounded-full bg-edge" />
        </div>
        <span className="text-[11px] font-mono ml-1 text-ink3">{label}</span>
      </div>
      {html ? (
        <div
          className="shiki-wrapper p-5 text-[12px] leading-relaxed overflow-x-auto [&_pre]:!bg-transparent [&_code]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-5 text-[12px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap text-ink3">
          {code}
        </pre>
      )}
    </div>
  );
}

function BrowserFrame({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-edge">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-edge bg-raised">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-edge" />
          <div className="w-2 h-2 rounded-full bg-edge" />
          <div className="w-2 h-2 rounded-full bg-edge" />
        </div>
        {label && (
          <span className="text-[10px] font-mono text-ink3 ml-1">{label}</span>
        )}
      </div>
      <div className="bg-surface p-5">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Element mock — selected element with badge + border
   ───────────────────────────────────────────────── */

interface Chip {
  label: string;
  color: string;
  bg: string;
  border: string;
}

function ElementMock({
  elementName,
  chips,
  borderStyle,
  children,
}: {
  elementName: string;
  chips: Chip[];
  borderStyle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <div className="flex gap-1 items-center flex-wrap">
        <div className="bg-raised border border-edge rounded px-2 py-0.5 text-[11px] text-ink2 font-mono whitespace-nowrap">
          ⊞ {elementName}
        </div>
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="rounded px-2 py-0.5 text-[10px] font-mono whitespace-nowrap"
            style={{
              color: chip.color,
              background: chip.bg,
              border: `1px solid ${chip.border}`,
            }}
          >
            {chip.label}
          </div>
        ))}
      </div>
      <div
        className={`rounded-md px-4 py-3 bg-page min-w-[180px] ${borderStyle === "none" ? "w-full" : ""}`}
        style={{ border: borderStyle }}
      >
        {children}
      </div>
    </div>
  );
}

function EditorNotice({
  title,
  text,
  expression,
  color,
  bg,
  border,
}: {
  title: string;
  text: string;
  expression?: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="text-[11px] px-3 py-2.5 rounded-lg"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <span className="font-semibold">{title}</span>
      {" — "}
      {text}
      {expression && (
        <span className="block mt-1 font-mono text-[10px] opacity-80">
          {expression}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Signal section — code left, browser frame right
   ───────────────────────────────────────────────── */

interface SignalSectionProps {
  code: string;
  codeFile: string;
  codeLang?: string;
  browserLabel: string;
  elementName: string;
  chips: Chip[];
  borderStyle: string;
  elementContent: React.ReactNode;
  noticeTitle: string;
  noticeText: string;
  noticeExpr?: string;
  noticeColor: string;
  noticeBg: string;
  noticeBorder: string;
  heading: string;
  explanation: string;
  delay?: number;
}

function SignalSection({
  code,
  codeFile,
  codeLang,
  browserLabel,
  elementName,
  chips,
  borderStyle,
  elementContent,
  noticeTitle,
  noticeText,
  noticeExpr,
  noticeColor,
  noticeBg,
  noticeBorder,
  heading,
  explanation,
  delay = 0,
}: SignalSectionProps) {
  return (
    <Reveal delay={delay}>
      <div className="mb-14 last:mb-0">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink mb-1.5">
          {heading}
        </h3>
        <p className="text-[13px] text-ink2 leading-relaxed mb-5 max-w-[600px]">
          {explanation}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock code={code} label={codeFile} lang={codeLang} />
          <BrowserFrame label={browserLabel}>
            <div className="flex flex-col gap-4">
              <ElementMock
                elementName={elementName}
                chips={chips}
                borderStyle={borderStyle}
              >
                {elementContent}
              </ElementMock>
              <EditorNotice
                title={noticeTitle}
                text={noticeText}
                expression={noticeExpr}
                color={noticeColor}
                bg={noticeBg}
                border={noticeBorder}
              />
            </div>
          </BrowserFrame>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────
   Signal data
   ───────────────────────────────────────────────── */

const signals: Omit<SignalSectionProps, "delay">[] = [
  {
    heading: "Repeated element",
    explanation:
      "This element renders more than once — Surface detected a loop in your code. Edit its layout here and every row updates.",
    code: `function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
    codeFile: "src/components/UserTable.tsx",
    browserLabel: "users",
    elementName: "tr",
    chips: [
      {
        label: "repeated",
        color: "#c084fc",
        bg: "rgba(139,92,246,0.15)",
        border: "rgba(139,92,246,0.35)",
      },
    ],
    borderStyle: "none",
    elementContent: (
      <table className="w-full text-[12px]" style={{ borderSpacing: 0 }}>
        <thead>
          <tr className="text-ink3 text-left">
            <th className="pb-2 px-3 font-medium">Name</th>
            <th className="pb-2 px-3 font-medium">Role</th>
            <th className="pb-2 px-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="text-ink">
          <tr
            className="border-t border-edge-subtle"
            style={{
              outline: "2px dashed rgba(192,132,252,0.75)",
              outlineOffset: -1,
              borderRadius: 4,
            }}
          >
            <td className="py-2 px-3">Alice Chen</td>
            <td className="py-2 px-3 text-ink3">Admin</td>
            <td className="py-2 px-3 text-emerald-400">Active</td>
          </tr>
          <tr className="border-t border-edge-subtle">
            <td className="py-2 px-3">Bob Park</td>
            <td className="py-2 px-3 text-ink3">Editor</td>
            <td className="py-2 px-3 text-emerald-400">Active</td>
          </tr>
          <tr className="border-t border-edge-subtle">
            <td className="py-2 px-3">Carol Wu</td>
            <td className="py-2 px-3 text-ink3">Viewer</td>
            <td className="py-2 px-3 text-ink3">Invited</td>
          </tr>
        </tbody>
      </table>
    ),
    noticeTitle: "Repeated element",
    noticeText: "edits affect all 3 rows.",
    noticeExpr: "users.map(…)",
    noticeColor: "#c084fc",
    noticeBg: "rgba(139,92,246,0.1)",
    noticeBorder: "rgba(139,92,246,0.25)",
  },
  {
    heading: "Dynamic content",
    explanation:
      "The text isn't hardcoded — it comes from data. Surface knows not to suggest replacing it with placeholder text.",
    code: `<div className="flex flex-col gap-1">
  <h2 className="text-lg font-bold">
    {user.displayName}
  </h2>
  <p className="text-sm text-gray-500">
    {user.email}
  </p>
</div>`,
    codeFile: "src/profile.tsx",
    browserLabel: "profile",
    elementName: "h2",
    chips: [
      {
        label: "dynamic",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.12)",
        border: "rgba(20,184,166,0.3)",
      },
    ],
    borderStyle: "2px solid rgba(45,212,191,0.75)",
    elementContent: (
      <div className="font-semibold text-ink text-[14px]">
        {"{user.displayName}"}
      </div>
    ),
    noticeTitle: "Dynamic content",
    noticeText: "this text comes from data, not from the source code.",
    noticeExpr: "{user.displayName}",
    noticeColor: "#2dd4bf",
    noticeBg: "rgba(20,184,166,0.1)",
    noticeBorder: "rgba(20,184,166,0.25)",
  },
  {
    heading: "Read-only (external component)",
    explanation:
      "This element lives inside node_modules — a third-party library. Surface can't edit the component definition, but if the library supports it you can still override instance props like className at the call site.",
    code: `import { Calendar } from "@acme/ui";

// The component itself is read-only,
// but you can still override props here:
<Calendar
  selected={date}
  onSelect={setDate}
  className="rounded-xl border shadow-lg"
/>`,
    codeFile: "src/date-picker.tsx",
    browserLabel: "date picker",
    elementName: "Calendar",
    chips: [
      {
        label: "read only",
        color: "#9ca3af",
        bg: "rgba(107,114,128,0.08)",
        border: "rgba(107,114,128,0.2)",
      },
      {
        label: "instance props",
        color: "#60a5fa",
        bg: "rgba(59,130,246,0.1)",
        border: "rgba(59,130,246,0.25)",
      },
    ],
    borderStyle: "2px solid rgba(156,163,175,0.6)",
    elementContent: (
      <div className="text-ink3 text-[12px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-ink text-[13px] font-medium">April 2026</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
            <span key={d} className="text-ink3 py-0.5">
              {d}
            </span>
          ))}
          {[14, 15, 16, 17, 18, 19, 20].map((d) => (
            <span
              key={d}
              className={`py-0.5 rounded ${d === 17 ? "bg-blue-500/20 text-blue-400" : "text-ink2"}`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    ),
    noticeTitle: "Read-only component",
    noticeText: "definition is inside node_modules, but instance props (like className) can still be edited at the call site.",
    noticeColor: "#9ca3af",
    noticeBg: "rgba(107,114,128,0.06)",
    noticeBorder: "rgba(107,114,128,0.15)",
  },
  {
    heading: "Data origin: local",
    explanation:
      "The data driving this content is defined in the same file — a list, a constant, or a conditional. The values are predictable and won't change between page loads.",
    code: `const greeting = "Welcome back";
const plan = user.isEnterprise
  ? "Enterprise"
  : "Starter";

<div className="flex flex-col gap-1">
  <h1 className="text-2xl font-bold">
    {greeting}
  </h1>
  <p className="text-sm text-gray-500">
    {plan} plan
  </p>
</div>`,
    codeFile: "src/dashboard.tsx",
    browserLabel: "dashboard",
    elementName: "h1",
    chips: [
      {
        label: "dynamic",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.12)",
        border: "rgba(20,184,166,0.3)",
      },
      {
        label: "local",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.08)",
        border: "rgba(20,184,166,0.2)",
      },
    ],
    borderStyle: "2px solid rgba(45,212,191,0.75)",
    elementContent: (
      <div>
        <div className="font-bold text-ink text-[16px] mb-0.5">
          Welcome back
        </div>
        <div className="text-ink3 text-[12px]">Enterprise plan</div>
      </div>
    ),
    noticeTitle: "Dynamic · local",
    noticeText: "content comes from data defined in this file.",
    noticeColor: "#2dd4bf",
    noticeBg: "rgba(20,184,166,0.1)",
    noticeBorder: "rgba(20,184,166,0.25)",
  },
  {
    heading: "Data origin: external",
    explanation:
      "The data comes from an API, database, or another service — it could change between page loads. Surface flags this so you don't accidentally replace it with fixed text.",
    code: `const { data: product } = useQuery(
  ["product", id],
  () => fetchProduct(id)
);

<div className="flex flex-col gap-2">
  <h2 className="text-xl font-bold">
    {product.name}
  </h2>
  <span className="text-lg">
    {product.price}
  </span>
</div>`,
    codeFile: "src/product-page.tsx",
    browserLabel: "product page",
    elementName: "h2",
    chips: [
      {
        label: "dynamic",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.12)",
        border: "rgba(20,184,166,0.3)",
      },
      {
        label: "external",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.08)",
        border: "rgba(20,184,166,0.2)",
      },
    ],
    borderStyle: "2px solid rgba(45,212,191,0.75)",
    elementContent: (
      <div>
        <div className="font-bold text-ink text-[15px] mb-0.5">
          {"{product.name}"}
        </div>
        <div className="text-ink2 text-[14px]">{"{product.price}"}</div>
      </div>
    ),
    noticeTitle: "Dynamic · external",
    noticeText: "content comes from an API — it can change between page loads.",
    noticeColor: "#2dd4bf",
    noticeBg: "rgba(20,184,166,0.1)",
    noticeBorder: "rgba(20,184,166,0.25)",
  },
];

/* ─────────────────────────────────────────────────
   Component vs Instance — animated toggle
   ───────────────────────────────────────────────── */

const componentInstanceCode = `// Button.tsx
export function Button({ variant, children }) {
  return (
    <button className={cn(
      "rounded-lg px-4 py-2 font-medium",
      variant === "primary"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-900"
    )}>
      {children}
    </button>
  );
}`;

const modes = {
  component: {
    codeFile: "src/components/Button.tsx",
    chips: [
      {
        label: "component",
        color: "#fb923c",
        bg: "rgba(249,115,22,0.1)",
        border: "rgba(249,115,22,0.25)",
      },
    ] as Chip[],
    borderStyle: "2px solid rgba(251,146,60,0.8)",
    noticeTitle: "Component",
    noticeText: "edits write to Button.tsx — every usage updates.",
    noticeColor: "#fb923c",
    noticeBg: "rgba(249,115,22,0.08)",
    noticeBorder: "rgba(249,115,22,0.2)",
  },
  instance: {
    codeFile: "src/dashboard.tsx",
    chips: [
      {
        label: "instance",
        color: "#60a5fa",
        bg: "rgba(59,130,246,0.1)",
        border: "rgba(59,130,246,0.25)",
      },
    ] as Chip[],
    borderStyle: "2px solid rgba(96,165,250,0.8)",
    noticeTitle: "Instance",
    noticeText: "edits write to dashboard.tsx — only this usage changes.",
    noticeColor: "#60a5fa",
    noticeBg: "rgba(59,130,246,0.08)",
    noticeBorder: "rgba(59,130,246,0.2)",
  },
};

function ComponentInstanceSection({ delay = 0 }: { delay?: number }) {
  const [mode, setMode] = useState<"component" | "instance">("component");
  const s = modes[mode];

  // Auto-toggle every 4 seconds
  useEffect(() => {
    const id = setInterval(
      () => setMode((m) => (m === "component" ? "instance" : "component")),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <Reveal delay={delay}>
      <div className="mb-14 last:mb-0">
        <h3 className="text-[17px] font-semibold tracking-tight text-ink mb-1.5">
          Component vs instance
        </h3>
        <p className="text-[13px] text-ink2 leading-relaxed mb-5 max-w-[600px]">
          You click the same Button on the page — but choose where the edit
          lands. Component mode writes to the definition file, instance mode
          writes to the usage site.
        </p>

        {/* Toggle */}
        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-raised border border-edge w-fit">
          {(["component", "instance"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`text-[12px] font-medium px-3.5 py-1.5 rounded-md transition-all ${
                mode === m
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink3 hover:text-ink2"
              }`}
            >
              {m === "component" ? "Component" : "Instance"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <CodeBlock code={componentInstanceCode} label={s.codeFile} />
                <div className="mt-2 text-[11px] font-mono text-ink3 px-1">
                  {mode === "component" ? (
                    <>
                      Writing to{" "}
                      <span className="text-orange-400">Button.tsx</span> —
                      changes every usage
                    </>
                  ) : (
                    <>
                      Writing to{" "}
                      <span className="text-blue-400">dashboard.tsx</span> —
                      changes only this call site
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <BrowserFrame label="dashboard">
            <div className="flex flex-col gap-4">
              <ElementMock
                elementName="Button"
                chips={s.chips}
                borderStyle={s.borderStyle}
              >
                <span className="inline-block bg-blue-600 text-white text-[13px] rounded-lg px-4 py-2 font-medium">
                  Save changes
                </span>
              </ElementMock>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <EditorNotice
                    title={s.noticeTitle}
                    text={s.noticeText}
                    color={s.noticeColor}
                    bg={s.noticeBg}
                    border={s.noticeBorder}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </BrowserFrame>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────
   Border color catalog
   ───────────────────────────────────────────────── */

const borderStates = [
  {
    label: "Repeated element",
    when: "Inside .map(), .flatMap(), or a loop",
    border: "2px dashed rgba(192,132,252,0.8)",
    color: "#c084fc",
    bg: "rgba(139,92,246,0.1)",
    borderColor: "rgba(139,92,246,0.25)",
    desc: "Rendered by a loop — edits affect every instance.",
    chips: [
      {
        label: "repeated",
        color: "#c084fc",
        bg: "rgba(139,92,246,0.12)",
        border: "rgba(139,92,246,0.3)",
      },
    ],
  },
  {
    label: "Dynamic content",
    when: "Text or content comes from data",
    border: "2px solid rgba(45,212,191,0.8)",
    color: "#2dd4bf",
    bg: "rgba(20,184,166,0.1)",
    borderColor: "rgba(20,184,166,0.25)",
    desc: "Content comes from data — not hardcoded in the source file.",
    chips: [
      {
        label: "dynamic",
        color: "#2dd4bf",
        bg: "rgba(20,184,166,0.12)",
        border: "rgba(20,184,166,0.3)",
      },
    ],
  },
  {
    label: "Component (all instances)",
    when: "Editing the component definition",
    border: "2px solid rgba(251,146,60,0.8)",
    color: "#fb923c",
    bg: "rgba(249,115,22,0.1)",
    borderColor: "rgba(249,115,22,0.25)",
    desc: "Changes apply everywhere this component appears in the project.",
    chips: [
      {
        label: "component",
        color: "#fb923c",
        bg: "rgba(249,115,22,0.1)",
        border: "rgba(249,115,22,0.25)",
      },
    ],
  },
  {
    label: "This instance only",
    when: "Editing one usage of a component",
    border: "2px solid rgba(96,165,250,0.8)",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.1)",
    borderColor: "rgba(59,130,246,0.25)",
    desc: "Changes stay scoped to this one place in the page.",
    chips: [
      {
        label: "instance",
        color: "#60a5fa",
        bg: "rgba(59,130,246,0.1)",
        border: "rgba(59,130,246,0.25)",
      },
    ],
  },
  {
    label: "Read-only",
    when: "Element is inside node_modules",
    border: "2px solid rgba(156,163,175,0.6)",
    color: "#9ca3af",
    bg: "rgba(107,114,128,0.08)",
    borderColor: "rgba(107,114,128,0.2)",
    desc: "Inside a library — you can inspect it but Surface won't write to it.",
    chips: [
      {
        label: "read only",
        color: "#9ca3af",
        bg: "rgba(107,114,128,0.08)",
        border: "rgba(107,114,128,0.2)",
      },
    ],
  },
];

/* ─────────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────────── */

export function DataSourcesExploration() {
  return (
    <div className="min-h-screen bg-page">
      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative graph-grid-fade pt-24 pb-14 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6 relative">
          <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-4 font-mono">
            Design Exploration
          </p>
          <h1
            className="text-[clamp(2rem,4.5vw,3.4rem)] font-medium tracking-[0.02em] leading-[1.01] mb-5"
            style={{ fontFamily: "'Jersey 25', sans-serif" }}
          >
            Every edit has a blast radius
          </h1>
          <p className="text-[15px] text-ink2 max-w-[560px] leading-relaxed mb-4">
            Production code has shared templates rendered across data records,
            headings showing API values, and components reused across pages. A
            visual edit can affect far more than what's on screen.
          </p>
          <p className="text-[13px] text-ink3 max-w-[560px] leading-relaxed mb-8">
            Surface reads your source code to surface these relationships —
            loops, live data, shared components — before you commit a
            change you didn't fully understand.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {[
              {
                label: "repeated",
                color: "#c084fc",
                bg: "rgba(139,92,246,0.1)",
                border: "rgba(139,92,246,0.28)",
              },
              {
                label: "dynamic",
                color: "#2dd4bf",
                bg: "rgba(20,184,166,0.1)",
                border: "rgba(20,184,166,0.28)",
              },
              {
                label: "read only",
                color: "#9ca3af",
                bg: "rgba(107,114,128,0.06)",
                border: "rgba(107,114,128,0.2)",
              },
              {
                label: "component · instance",
                color: "#fb923c",
                bg: "rgba(249,115,22,0.08)",
                border: "rgba(249,115,22,0.22)",
              },
            ].map((chip) => (
              <span
                key={chip.label}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md"
                style={{
                  color: chip.color,
                  background: chip.bg,
                  border: `1px solid ${chip.border}`,
                }}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Border colour hierarchy (moved before signals) ── */}
      <section className="py-20 border-b border-edge bg-raised/50">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Selection highlights
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4 md:max-w-[70%]">
              Production code is more than a few isolated components
            </h2>
            <p className="text-[14px] text-ink2 max-w-[580px] leading-relaxed mb-10">
              Every selected element gets border highlight depending on what
              Surface detects in the code. When signals overlap — a looped
              component, for instance — the higher-priority state wins, because
              that's the most important thing to know before you edit.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-edge overflow-hidden">
              <div className="px-4 py-3 border-b border-edge bg-raised">
                <span className="text-[10px] font-mono text-ink3 uppercase tracking-widest">
                  Priority order — highest first
                </span>
              </div>
              {borderStates.map((state, i) => (
                <div
                  key={state.label}
                  className={`flex items-start gap-5 px-5 py-4 border-b border-edge last:border-0 ${i % 2 === 0 ? "bg-page" : "bg-raised/30"}`}
                >
                  <span className="text-[11px] font-mono text-ink3 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Border swatch */}
                  <div
                    className="shrink-0 mt-1 rounded bg-surface max-md:hidden"
                    style={{ width: 40, height: 26, border: state.border }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[13px] font-medium text-ink">
                        {state.label}
                      </span>
                      {state.chips.map((chip) => (
                        <span
                          key={chip.label}
                          className="text-[10px] font-mono px-2 py-0.5 rounded"
                          style={{
                            color: chip.color,
                            background: chip.bg,
                            border: `1px solid ${chip.border}`,
                          }}
                        >
                          {chip.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-[12px] text-ink2 leading-relaxed">
                      {state.desc}
                    </p>
                  </div>

                  <div className="shrink-0 text-right max-md:hidden">
                    <span className="text-[11px] text-ink3 leading-relaxed">
                      {state.when}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Signal sections ──────────────────────────── */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Classification signals
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
              What Surface sees in your code
            </h2>
            <p className="text-[14px] text-ink2 max-w-[600px] leading-relaxed mb-14">
              Every element you select is classified on the DOM using data
              attributes — is it repeated? Does it show live data?
              Where does that data come from? Each answer changes the border,
              the chips, and the warnings in the editor panel.
            </p>
          </Reveal>

          <div className="flex flex-col gap-6">
            <ComponentInstanceSection delay={0} />
            {signals.map((sig, i) => (
              <SignalSection key={sig.heading} {...sig} delay={(i + 1) * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI agent integration ────────────────────── */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              AI agent integration
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
              The AI knows too
            </h2>
            <p className="text-[14px] text-ink2 max-w-[620px] leading-relaxed mb-10">
              When you ask Surface's AI agent to make a change, it receives the
              same classification as context. It won't suggest replacing{" "}
              <code className="font-mono text-[12px] text-ink2 bg-muted px-1.5 py-0.5 rounded border border-edge-subtle">
                {"{user.name}"}
              </code>{" "}
              with literal text, and it knows that editing a looped element
              affects every instance.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Reveal delay={0.06}>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-mono text-ink3 uppercase tracking-widest">
                  Looped element
                </p>
                <CodeBlock
                  label="system context"
                  lang="text"
                  code={`[Repeated element]
This element renders multiple times
via \`stats.map(…)\` (local data in this file).

Style edits affect all instances.
Do not hardcode values that come from data.`}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-mono text-ink3 uppercase tracking-widest">
                  Dynamic content
                </p>
                <CodeBlock
                  label="system context"
                  lang="text"
                  code={`[Dynamic content]
Text or children of this element come
from data, not from the source code.

Do not replace it with hardcoded text.`}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────── */}
      <section className="py-20 border-b border-edge">
        <div className="max-w-[900px] mx-auto px-6">
          <Reveal>
            <p className="text-xs font-medium text-ink3 uppercase tracking-widest mb-3 font-mono">
              Under the hood
            </p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold tracking-[-0.03em] leading-tight mb-4">
              How it works
            </h2>
            <p className="text-[14px] text-ink2 max-w-[600px] leading-relaxed mb-12">
              Classification is lazy — it happens once per element click, cached
              by file and timestamp so HMR reloads don't re-analyse unchanged
              elements.
            </p>
          </Reveal>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px rounded-xl overflow-hidden border border-edge bg-edge">
            {[
              {
                n: "01",
                title: "Selection",
                desc: "Surface sees the element's data-source coordinate — the exact file and line in your codebase.",
              },
              {
                n: "02",
                title: "AST analysis",
                desc: "It parses that file, walks the element's ancestors looking for loops, and checks whether children come from data.",
              },
              {
                n: "03",
                title: "Editor update",
                desc: "The border colour changes, chips appear, and the editor panel shows a notice — all before you touch a control.",
              },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 0.08}>
                <div className="bg-page p-7 h-full">
                  <div className="text-[10px] font-mono text-ink3 mb-3">
                    {item.n}
                  </div>
                  <h3 className="text-[14px] font-semibold tracking-tight mb-2 text-ink">
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

      {/* ── Footer ─────────────────────────────────── */}
      <div className="border-t border-edge py-6 bg-raised/30">
        <div className="max-w-[900px] mx-auto px-6 flex items-center justify-between">
          <span className="text-[11px] font-mono text-ink3">
            Surface — architecture exploration
          </span>
          <a
            href="/"
            className="text-[11px] font-mono text-ink3 hover:text-ink2 transition-colors"
          >
            ← back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
