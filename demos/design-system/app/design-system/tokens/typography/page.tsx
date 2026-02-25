const typeScale = [
  { name: "text-xs", class: "text-xs" },
  { name: "text-sm", class: "text-sm" },
  { name: "text-base", class: "text-base" },
  { name: "text-lg", class: "text-lg" },
  { name: "text-xl", class: "text-xl" },
  { name: "text-2xl", class: "text-2xl" },
  { name: "text-3xl", class: "text-3xl" },
  { name: "text-4xl", class: "text-4xl" },
  { name: "text-5xl", class: "text-5xl" },
  { name: "text-6xl", class: "text-6xl" },
] as const;

const fontWeights = [
  { name: "font-light", class: "font-light" },
  { name: "font-normal", class: "font-normal" },
  { name: "font-medium", class: "font-medium" },
  { name: "font-semibold", class: "font-semibold" },
  { name: "font-bold", class: "font-bold" },
  { name: "font-extrabold", class: "font-extrabold" },
] as const;

const leadingValues = [
  { name: "leading-none", class: "leading-none" },
  { name: "leading-tight", class: "leading-tight" },
  { name: "leading-snug", class: "leading-snug" },
  { name: "leading-normal", class: "leading-normal" },
  { name: "leading-relaxed", class: "leading-relaxed" },
  { name: "leading-loose", class: "leading-loose" },
] as const;

export default function TypographyPage() {
  return (
    <div data-slot="typography-page">
      <h1 className="text-3xl font-bold tracking-tight">Typography</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Type scale, font weights, and line height tokens used throughout the
        design system.
      </p>

      {/* Type Scale */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Type Scale</h2>
        <div className="mt-6 space-y-4">
          {typeScale.map((size) => (
            <div
              key={size.name}
              className="flex items-baseline gap-6 border-b border-border/40 pb-4"
            >
              <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">
                {size.name}
              </span>
              <span className={size.class}>The quick brown fox</span>
            </div>
          ))}
        </div>
      </section>

      {/* Font Weights */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Font Weights</h2>
        <div className="mt-6 space-y-4">
          {fontWeights.map((weight) => (
            <div
              key={weight.name}
              className="flex items-baseline gap-6 border-b border-border/40 pb-4"
            >
              <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">
                {weight.name}
              </span>
              <span className={`text-xl ${weight.class}`}>
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Leading */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Leading (Line Height)</h2>
        <div className="mt-6 space-y-6">
          {leadingValues.map((leading) => (
            <div
              key={leading.name}
              className="flex gap-6 border-b border-border/40 pb-6"
            >
              <span className="w-36 shrink-0 pt-1 font-mono text-xs text-muted-foreground">
                {leading.name}
              </span>
              <p className={`text-base ${leading.class}`}>
                The quick brown fox jumps over the lazy dog. Pack my box with
                five dozen liquor jugs. How vexingly quick daft zebras jump.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
