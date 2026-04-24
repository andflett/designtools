/*
  LinkedIn Carousel — Data-Aware Element Detection
  ─────────────────────────────────────────────────
  Each slide is 1080 × 1350 px (4:5 portrait, LinkedIn optimal).

  Browser: slides render at 540 × 675 px (50% scale, 2-col grid preview).
  Print:   slides restore to 1080 × 1350 px, one per PDF page.
           File > Print → Save as PDF → upload to LinkedIn as a Document post.

  Fonts are loaded from the parent HTML file (Inter + Jersey 25).
*/

/* ─────────────────────────────────────────────────
   Design tokens
   ───────────────────────────────────────────────── */

const BG = "#0d0d10";
const BG2 = "#131316";
const BG3 = "#1a1a1f";
const RULE = "rgba(255,255,255,0.08)";
const INK = "#f4f4f5";
const INK2 = "#a1a1aa";
const INK3 = "#52525b";

const PURPLE = "#c084fc";
const PURPLE_BG = "rgba(192,132,252,0.12)";
const PURPLE_BORDER = "rgba(192,132,252,0.3)";
const PURPLE_DASH = "2px dashed rgba(192,132,252,0.85)";

const TEAL = "#2dd4bf";
const TEAL_BG = "rgba(45,212,191,0.1)";
const TEAL_BORDER = "rgba(45,212,191,0.28)";
const TEAL_SOLID = "2px solid rgba(45,212,191,0.85)";

const ORANGE = "#fb923c";
const ORANGE_BG = "rgba(251,146,60,0.1)";
const ORANGE_BORDER = "rgba(251,146,60,0.28)";

const BLUE = "#60a5fa";
const BLUE_BG = "rgba(96,165,250,0.1)";
const BLUE_BORDER = "rgba(96,165,250,0.28)";

const GRAY = "#9ca3af";
const GRAY_BG = "rgba(156,163,175,0.07)";
const GRAY_BORDER = "rgba(156,163,175,0.2)";

/* ─────────────────────────────────────────────────
   Slide shell — consistent header/footer/padding
   ───────────────────────────────────────────────── */

function Slide({ n, total = 10, children }: { n: number; total?: number; children: React.ReactNode }) {
  return (
    <div
      className="slide"
      style={{
        width: 1080,
        height: 1350,
        background: BG,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "36px 72px 0",
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "'Jersey 25', sans-serif", fontSize: 22, color: INK, letterSpacing: "0.04em" }}>
          Surface
        </span>
        <span style={{ fontSize: 13, color: INK3, fontFamily: "ui-monospace, monospace" }}>
          {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "0 72px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {children}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 72px 36px",
          borderTop: `1px solid ${RULE}`,
          paddingTop: 20,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, color: INK3, fontFamily: "ui-monospace, monospace" }}>surface.sh</span>
        <span style={{ fontSize: 12, color: INK3, fontFamily: "ui-monospace, monospace" }}>Data-aware element detection</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Shared slide primitives
   ───────────────────────────────────────────────── */

function SlideLabel({ text, color = INK3 }: { text: string; color?: string }) {
  return (
    <p style={{ fontSize: 13, color, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24, marginTop: 48 }}>
      {text}
    </p>
  );
}

function SlideH({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Jersey 25', sans-serif",
        fontSize: 80,
        lineHeight: 1.05,
        color: INK,
        letterSpacing: "0.02em",
        marginBottom: 32,
      }}
    >
      {children}
    </h2>
  );
}

function SlideP({ children, size = 26 }: { children: React.ReactNode; size?: number }) {
  return (
    <p style={{ fontSize: size, color: INK2, lineHeight: 1.55, marginBottom: 24 }}>
      {children}
    </p>
  );
}

function BadgeChip({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: "5px 14px",
        fontSize: 16,
        fontFamily: "ui-monospace, monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function ElementBadge({ name, color }: { name: string; color: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: INK2,
        background: "#1c1c1e",
        border: "1px solid #333",
        borderRadius: 6,
        padding: "5px 14px",
        fontSize: 16,
        fontFamily: "ui-monospace, monospace",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color }}>⊞</span> {name}
    </div>
  );
}

function MockElement({
  borderStyle,
  children,
}: {
  borderStyle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: borderStyle,
        borderRadius: 12,
        padding: "32px 36px",
        background: BG3,
      }}
    >
      {children}
    </div>
  );
}

function Notice({
  title, text, expr, color, bg, border,
}: {
  title: string; text: string; expr?: string;
  color: string; bg: string; border: string;
}) {
  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: 10,
        background: bg,
        border: `1px solid ${border}`,
        fontSize: 17,
        color,
        lineHeight: 1.5,
      }}
    >
      <strong>{title}</strong>
      {" — "}
      {text}
      {expr && (
        <div style={{ marginTop: 8, fontFamily: "ui-monospace, monospace", fontSize: 14, opacity: 0.8 }}>
          {expr}
        </div>
      )}
    </div>
  );
}

function Rule() {
  return <div style={{ height: 1, background: RULE, margin: "32px 0" }} />;
}

/* ─────────────────────────────────────────────────
   Individual slides
   ───────────────────────────────────────────────── */

function CoverSlide() {
  return (
    <Slide n={1}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: INK3, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 40 }}>
          Architecture exploration
        </p>
        <h1
          style={{
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: 108,
            lineHeight: 1.0,
            color: INK,
            letterSpacing: "0.02em",
            marginBottom: 48,
          }}
        >
          The border tells you what will change.
        </h1>
        <p style={{ fontSize: 28, color: INK2, lineHeight: 1.5, maxWidth: 760 }}>
          Surface reads your code to understand what each
          element actually is — before you make a change.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 72 }}>
          <BadgeChip label="repeated" color={PURPLE} bg={PURPLE_BG} border={PURPLE_BORDER} />
          <BadgeChip label="dynamic" color={TEAL} bg={TEAL_BG} border={TEAL_BORDER} />
          <BadgeChip label="local · external" color={ORANGE} bg={ORANGE_BG} border={ORANGE_BORDER} />
        </div>
      </div>
    </Slide>
  );
}

function ProblemSlide() {
  return (
    <Slide n={2}>
      <SlideLabel text="The problem" />
      <SlideH>Most design tools show you pixels. Not intent.</SlideH>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
        {[
          "Is this card one of twelve, or is it a one-off?",
          "Is that text hardcoded or coming from your database?",
          "Will editing it affect other places in the app?",
        ].map((q) => (
          <div
            key={q}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 18,
              padding: "24px 28px",
              background: BG2,
              border: `1px solid ${RULE}`,
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 20, color: INK3, marginTop: 2 }}>?</span>
            <p style={{ fontSize: 22, color: INK2, lineHeight: 1.45 }}>{q}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 48 }}>
        <SlideP>Without these answers, every edit is a guess.</SlideP>
      </div>
    </Slide>
  );
}

function SolutionSlide() {
  return (
    <Slide n={3}>
      <SlideLabel text="The solution" />
      <SlideH>Surface reads your code. Before you click anything.</SlideH>

      <SlideP>
        When you select an element, Surface parses the source file
        and answers two questions automatically.
      </SlideP>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "28px 32px", background: PURPLE_BG, border: `1px solid ${PURPLE_BORDER}`, borderRadius: 12 }}>
          <div style={{ width: 36, height: 24, border: PURPLE_DASH, borderRadius: 4, flexShrink: 0, marginTop: 4 }} />
          <div>
            <p style={{ fontSize: 20, color: PURPLE, fontWeight: 600, marginBottom: 6 }}>Is this element repeated?</p>
            <p style={{ fontSize: 18, color: INK2, lineHeight: 1.5 }}>
              Surface detects if it's inside a loop, how many instances there are, and where the data comes from.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", padding: "28px 32px", background: TEAL_BG, border: `1px solid ${TEAL_BORDER}`, borderRadius: 12 }}>
          <div style={{ width: 36, height: 24, border: TEAL_SOLID, borderRadius: 4, flexShrink: 0, marginTop: 4 }} />
          <div>
            <p style={{ fontSize: 20, color: TEAL, fontWeight: 600, marginBottom: 6 }}>Is the content live data?</p>
            <p style={{ fontSize: 18, color: INK2, lineHeight: 1.5 }}>
              Surface checks whether text is hardcoded or comes from a variable, API, or user session.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "auto", padding: "32px 0 0" }}>
        <p style={{ fontSize: 20, color: INK3 }}>Both answers are shown through colour. Instantly.</p>
      </div>
    </Slide>
  );
}

function LoopBorderSlide() {
  return (
    <Slide n={4}>
      <SlideLabel text="Signal one" color={PURPLE} />

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 40 }}>
        <div style={{ width: 52, height: 32, border: PURPLE_DASH, borderRadius: 5 }} />
        <p style={{ fontSize: 20, color: PURPLE, fontFamily: "ui-monospace, monospace" }}>Purple dashed border</p>
      </div>

      <SlideH>This renders more than once.</SlideH>

      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <ElementBadge name="StatCard" color={PURPLE} />
          <BadgeChip label="repeated" color={PURPLE} bg={PURPLE_BG} border={PURPLE_BORDER} />
        </div>
        <MockElement borderStyle={PURPLE_DASH}>
          <p style={{ fontSize: 15, color: INK3, fontFamily: "ui-monospace, monospace", marginBottom: 10 }}>Revenue</p>
          <p style={{ fontSize: 40, fontWeight: 700, color: INK, lineHeight: 1 }}>$4.2M</p>
          <p style={{ fontSize: 16, color: PURPLE, marginTop: 8 }}>↑ 8% this month</p>
        </MockElement>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Notice
          title="Repeated element"
          text="edits affect all instances, using local data defined in this file."
          expr="stats.map(…)"
          color={PURPLE}
          bg={PURPLE_BG}
          border={PURPLE_BORDER}
        />
      </div>
    </Slide>
  );
}

function LoopMeansSlide() {
  return (
    <Slide n={5}>
      <SlideLabel text="What this means for you" color={PURPLE} />
      <SlideH>Change one. Change them all.</SlideH>

      <SlideP>
        This card is rendered once per item in a list. There's only
        one template — displayed multiple times with different data.
      </SlideP>

      <Rule />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          "Padding, typography, colours — all shared",
          "Edit the template, every instance updates",
          "Surface warns you before you commit",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, color: PURPLE, fontFamily: "ui-monospace, monospace", marginTop: 3, flexShrink: 0 }}>→</span>
            <p style={{ fontSize: 22, color: INK, lineHeight: 1.45 }}>{item}</p>
          </div>
        ))}
      </div>

      <Rule />

      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1, padding: "24px", background: PURPLE_BG, border: `1px solid ${PURPLE_BORDER}`, borderRadius: 10 }}>
          <p style={{ fontSize: 14, color: PURPLE, fontFamily: "ui-monospace, monospace", marginBottom: 8 }}>LOCAL DATA</p>
          <p style={{ fontSize: 19, color: INK2, lineHeight: 1.5 }}>Array defined in this file — number of instances is predictable</p>
        </div>
        <div style={{ flex: 1, padding: "24px", background: ORANGE_BG, border: `1px solid ${ORANGE_BORDER}`, borderRadius: 10 }}>
          <p style={{ fontSize: 14, color: ORANGE, fontFamily: "ui-monospace, monospace", marginBottom: 8 }}>EXTERNAL DATA</p>
          <p style={{ fontSize: 19, color: INK2, lineHeight: 1.5 }}>From a hook or API — could be 3 instances or 300</p>
        </div>
      </div>
    </Slide>
  );
}

function DynamicBorderSlide() {
  return (
    <Slide n={6}>
      <SlideLabel text="Signal two" color={TEAL} />

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 40 }}>
        <div style={{ width: 52, height: 32, border: TEAL_SOLID, borderRadius: 5 }} />
        <p style={{ fontSize: 20, color: TEAL, fontFamily: "ui-monospace, monospace" }}>Teal border</p>
      </div>

      <SlideH>This text isn't written in the code.</SlideH>

      <div style={{ marginTop: 32 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <ElementBadge name="h2" color={TEAL} />
          <BadgeChip label="dynamic" color={TEAL} bg={TEAL_BG} border={TEAL_BORDER} />
        </div>
        <MockElement borderStyle={TEAL_SOLID}>
          <p style={{ fontSize: 36, fontWeight: 700, color: INK, fontFamily: "ui-monospace, monospace" }}>
            {"{user.displayName}"}
          </p>
          <p style={{ fontSize: 16, color: TEAL, marginTop: 12 }}>Runtime value — not a string literal</p>
        </MockElement>
      </div>

      <div style={{ marginTop: "auto" }}>
        <Notice
          title="Dynamic content"
          text="text or children contain runtime expressions."
          expr="{user.displayName}"
          color={TEAL}
          bg={TEAL_BG}
          border={TEAL_BORDER}
        />
      </div>
    </Slide>
  );
}

function DynamicMeansSlide() {
  return (
    <Slide n={7}>
      <SlideLabel text="What this means for you" color={TEAL} />
      <SlideH>Surface won't suggest replacing real data with placeholder text.</SlideH>

      <SlideP size={24}>
        That heading says <code style={{ fontFamily: "ui-monospace, monospace", color: TEAL, fontSize: 22 }}>{"{user.displayName}"}</code> because
        it shows a different name for every user. Surface detects this and keeps
        the AI agent from suggesting you replace it with "John Smith".
      </SlideP>

      <Rule />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          "User names, timestamps, API responses",
          "Database-driven content, session data",
          "Anything your users see differently",
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, color: TEAL, fontFamily: "ui-monospace, monospace", marginTop: 3, flexShrink: 0 }}>→</span>
            <p style={{ fontSize: 22, color: INK, lineHeight: 1.45 }}>{item}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto" }}>
        <Notice
          title="Dynamic content"
          text="text or children contain runtime expressions."
          color={TEAL}
          bg={TEAL_BG}
          border={TEAL_BORDER}
        />
      </div>
    </Slide>
  );
}

function ColorSystemSlide() {
  const states = [
    { border: "2px dashed rgba(192,132,252,0.85)", color: PURPLE, label: "Repeated element", desc: "Rendered from a list", chip: "repeated" },
    { border: TEAL_SOLID, color: TEAL, label: "Dynamic content", desc: "Text from a variable", chip: "dynamic" },
    { border: `2px solid rgba(251,146,60,0.85)`, color: ORANGE, label: "Component (all instances)", desc: "Editing the template", chip: "component" },
    { border: `2px solid rgba(96,165,250,0.85)`, color: BLUE, label: "This instance only", desc: "Editing one usage", chip: "instance" },
    { border: `2px solid rgba(156,163,175,0.65)`, color: GRAY, label: "Read-only", desc: "Library element", chip: "read only" },
  ];

  return (
    <Slide n={8}>
      <SlideLabel text="Full colour system" />
      <SlideH>What each colour means.</SlideH>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {states.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "20px 28px",
              background: i === 0 ? PURPLE_BG : i === 1 ? TEAL_BG : i === 2 ? ORANGE_BG : i === 3 ? BLUE_BG : GRAY_BG,
              border: `1px solid ${i === 0 ? PURPLE_BORDER : i === 1 ? TEAL_BORDER : i === 2 ? ORANGE_BORDER : i === 3 ? BLUE_BORDER : GRAY_BORDER}`,
              borderRadius: 10,
            }}
          >
            <div style={{ width: 48, height: 30, border: s.border, borderRadius: 5, flexShrink: 0, background: BG3 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 19, color: INK, fontWeight: 600 }}>{s.label}</p>
              <p style={{ fontSize: 15, color: INK3 }}>{s.desc}</p>
            </div>
            <span
              style={{
                fontSize: 13,
                color: s.color,
                background: i === 0 ? PURPLE_BG : i === 1 ? TEAL_BG : i === 2 ? ORANGE_BG : i === 3 ? BLUE_BG : GRAY_BG,
                border: `1px solid ${s.color}40`,
                borderRadius: 4,
                padding: "3px 10px",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {s.chip}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 16, color: INK3, marginTop: 24 }}>
        Data-driven states (repeated, dynamic) always override editing-mode states.
      </p>
    </Slide>
  );
}

function DataOriginSlide() {
  return (
    <Slide n={9}>
      <SlideLabel text="One more signal" color={ORANGE} />
      <SlideH>Where does the data come from?</SlideH>

      <SlideP>
        When an element is repeated, Surface goes further — it traces the
        list back to its source to tell you exactly what you're dealing with.
      </SlideP>

      <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
        <div style={{ flex: 1, padding: "32px 28px", background: PURPLE_BG, border: `1px solid ${PURPLE_BORDER}`, borderRadius: 14 }}>
          <p style={{ fontSize: 14, color: PURPLE, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Local</p>
          <p style={{ fontSize: 22, color: INK, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
            Defined in this file
          </p>
          <p style={{ fontSize: 17, color: INK2, lineHeight: 1.55 }}>
            A hardcoded array like <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 15 }}>const items = [...]</code>.
            The number of instances is fixed and predictable.
          </p>
        </div>

        <div style={{ flex: 1, padding: "32px 28px", background: ORANGE_BG, border: `1px solid ${ORANGE_BORDER}`, borderRadius: 14 }}>
          <p style={{ fontSize: 14, color: ORANGE, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>External</p>
          <p style={{ fontSize: 22, color: INK, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
            From a hook, API, or props
          </p>
          <p style={{ fontSize: 17, color: INK2, lineHeight: 1.55 }}>
            Runtime data like <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 15 }}>useQuery()</code> or <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 15 }}>props.items</code>.
            Could be any number of instances at runtime.
          </p>
        </div>
      </div>
    </Slide>
  );
}

function ClosingSlide() {
  return (
    <Slide n={10}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: INK3, fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 48 }}>
          The result
        </p>
        <h2
          style={{
            fontFamily: "'Jersey 25', sans-serif",
            fontSize: 100,
            lineHeight: 1.0,
            color: INK,
            letterSpacing: "0.02em",
            marginBottom: 52,
          }}
        >
          No more guessing what a change will affect.
        </h2>

        <div style={{ height: 1, background: RULE, marginBottom: 48 }} />

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <BadgeChip label="repeated" color={PURPLE} bg={PURPLE_BG} border={PURPLE_BORDER} />
          <BadgeChip label="dynamic" color={TEAL} bg={TEAL_BG} border={TEAL_BORDER} />
          <BadgeChip label="local" color={PURPLE} bg={PURPLE_BG} border={PURPLE_BORDER} />
          <BadgeChip label="external" color={ORANGE} bg={ORANGE_BG} border={ORANGE_BORDER} />
        </div>

        <p style={{ fontSize: 26, color: INK2, lineHeight: 1.5, marginTop: 52, maxWidth: 700 }}>
          Surface reads your code so the editor always reflects
          what a change will actually do.
        </p>

        <p style={{ fontSize: 18, color: INK3, marginTop: 36, fontFamily: "ui-monospace, monospace" }}>
          surface.sh
        </p>
      </div>
    </Slide>
  );
}

/* ─────────────────────────────────────────────────
   Carousel page
   ───────────────────────────────────────────────── */

const slides = [
  CoverSlide,
  ProblemSlide,
  SolutionSlide,
  LoopBorderSlide,
  LoopMeansSlide,
  DynamicBorderSlide,
  DynamicMeansSlide,
  ColorSystemSlide,
  DataOriginSlide,
  ClosingSlide,
];

export function DataSourcesCarousel() {
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          @page { size: 1080px 1350px; margin: 0; }
          body { margin: 0; background: #0d0d10; }
          .print-hide { display: none !important; }
          .slide-wrapper {
            width: 1080px !important;
            height: 1350px !important;
            page-break-after: always;
            break-after: page;
            overflow: visible !important;
            border-radius: 0 !important;
            border: none !important;
          }
          .slide {
            transform: none !important;
            transform-origin: top left;
          }
          .carousel-grid {
            display: block !important;
            padding: 0 !important;
            gap: 0 !important;
          }
        }
        @media screen {
          .slide {
            transform: scale(0.5);
            transform-origin: top left;
          }
          .slide-wrapper {
            width: 540px;
            height: 675px;
            overflow: hidden;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.06);
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080809", paddingBottom: 80 }}>
        {/* Toolbar */}
        <div
          className="print-hide"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "rgba(8,8,9,0.92)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "14px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "'Jersey 25', sans-serif", fontSize: 18, color: "#f4f4f5" }}>Surface</span>
            <span style={{ fontSize: 12, color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
              LinkedIn carousel — {slides.length} slides · 1080 × 1350 px
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/data-sources"
              style={{ fontSize: 12, color: "#71717a", fontFamily: "ui-monospace, monospace", textDecoration: "none" }}
            >
              ← back
            </a>
            <button
              onClick={() => window.print()}
              style={{
                background: "#f4f4f5",
                color: "#0d0d10",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div
          className="print-hide"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "32px 40px 16px",
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#52525b", fontFamily: "ui-monospace, monospace", lineHeight: 1.7 }}>
              Click <strong style={{ color: "#a1a1aa" }}>Download PDF</strong> above, or use{" "}
              <strong style={{ color: "#a1a1aa" }}>File → Print → Save as PDF</strong> (set destination to "Save as PDF",
              paper size will be set automatically). Upload the PDF to LinkedIn as a{" "}
              <strong style={{ color: "#a1a1aa" }}>Document post</strong> to create a carousel.
              Showing at 50% — full 1080 × 1350 px in the PDF.
            </p>
          </div>
        </div>

        {/* Slide grid */}
        <div
          className="carousel-grid"
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "0 40px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 540px)",
            gap: 24,
          }}
        >
          {slides.map((SlideComponent, i) => (
            <div key={i} className="slide-wrapper">
              <SlideComponent />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
