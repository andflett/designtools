import { Reveal } from "./reveal.js";

const cards = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        <rect x="1" y="1" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1 7h18M7 7v12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Your code, not a canvas",
    description:
      "No import/export cycle. Codesurface loads your running app in an iframe and edits source files directly. The app you see is the app you ship.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 1v4M10 15v4M1 10h4M15 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    ),
    title: "Deterministic, not generative",
    description:
      "You click a property, you change a value, the exact edit is written to your file. No AI guessing what you meant. Precision by default.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    title: "Design system thinking",
    description:
      "Tokens, components, instances. Codesurface maps your codebase structure and encourages systematic changes over freeform pixel pushing.",
  },
];

export function Philosophy() {
  return (
    <section className="py-24 border-t border-edge-subtle">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-px bg-edge-subtle rounded-xl overflow-hidden border border-edge-subtle">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <div className="bg-page p-8 h-full">
                <div className="text-ink3 mb-4">{card.icon}</div>
                <h3 className="text-[15px] font-semibold mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[13px] text-ink2 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
