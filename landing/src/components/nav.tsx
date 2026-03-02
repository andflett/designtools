export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-3 bg-ink/90 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-[13px] text-white font-mono">
          <span className="text-white/40">@designtools/</span>surface
        </a>

        <div className="hidden md:flex items-center gap-6">
          <a href="#how-it-works" className="text-[13px] text-white/50 hover:text-white/80 transition-colors font-mono">how-it-works</a>
          <a href="#compatibility" className="text-[13px] text-white/50 hover:text-white/80 transition-colors font-mono">compatibility</a>
          <a href="https://github.com/andflett/designtools" target="_blank" rel="noopener" className="text-[13px] text-white/50 hover:text-white/80 transition-colors font-mono">
            github
          </a>
          <a
            href="https://www.npmjs.com/package/@designtools/surface"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center text-white/50 hover:text-white transition-colors"
            title="View on npm"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 256 256" fill="currentColor">
              <path d="M0 256V0h256v256H0zm41-41h43.7v-131H128v131h87V41H41v174z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
