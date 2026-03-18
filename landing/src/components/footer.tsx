export function Footer() {
  return (
    <footer className="py-8 bg-[#09090b] border-t border-white/8">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[12px] text-white/50 font-mono">
          <span className="text-white/40">@designtools/</span>surface{" "}
          <span className="text-white/20 mx-1">/</span>{" "}
          <a href="/cascade" className="text-white/40 hover:text-white/60 transition-colors">
            cascade
          </a>
          <span className="text-white/20 mx-1">/</span>{" "}
          <a href="https://flett.cc" target="_blank" rel="noopener" className="text-white/40 hover:text-white/60 transition-colors">
            flett.cc
          </a>
        </span>
        <ul className="flex flex-wrap justify-center gap-5 list-none">
          <li>
            <a href="https://github.com/andflett/designtools" target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
              github
            </a>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/@designtools/surface" target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
              npm
            </a>
          </li>
          <li>
            <a href="https://www.flett.cc/projects/design-engineer-studio" target="_blank" rel="noopener" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
              about
            </a>
          </li>
          <li>
            <a href="#privacy" className="text-[12px] text-white/50 hover:text-white transition-colors font-mono">
              privacy
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
