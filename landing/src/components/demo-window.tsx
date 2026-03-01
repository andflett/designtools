import { Reveal } from "./reveal.js";

export function DemoWindow() {
  return (
    <section className="pb-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <Reveal>
          <div className="max-w-[960px] mx-auto rounded-xl border border-edge overflow-hidden bg-surface shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_32px_-8px_rgba(0,0,0,0.08)]">
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-raised border-b border-edge">
              <div className="flex gap-1.5">
                <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
              </div>
              <span className="flex-1 text-center text-[11px] text-ink3 font-mono">
                localhost:4400
              </span>
              <div className="w-[42px]" />
            </div>

            <img
              src="/screen.png"
              alt="Surface editor interface"
              className="w-full block"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
