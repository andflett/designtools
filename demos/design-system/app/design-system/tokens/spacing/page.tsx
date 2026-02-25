const spacingScale = [
  { key: "0.5", rem: "0.125rem", px: "2px", value: 2 },
  { key: "1", rem: "0.25rem", px: "4px", value: 4 },
  { key: "1.5", rem: "0.375rem", px: "6px", value: 6 },
  { key: "2", rem: "0.5rem", px: "8px", value: 8 },
  { key: "3", rem: "0.75rem", px: "12px", value: 12 },
  { key: "4", rem: "1rem", px: "16px", value: 16 },
  { key: "5", rem: "1.25rem", px: "20px", value: 20 },
  { key: "6", rem: "1.5rem", px: "24px", value: 24 },
  { key: "8", rem: "2rem", px: "32px", value: 32 },
  { key: "10", rem: "2.5rem", px: "40px", value: 40 },
  { key: "12", rem: "3rem", px: "48px", value: 48 },
  { key: "16", rem: "4rem", px: "64px", value: 64 },
  { key: "20", rem: "5rem", px: "80px", value: 80 },
  { key: "24", rem: "6rem", px: "96px", value: 96 },
  { key: "32", rem: "8rem", px: "128px", value: 128 },
  { key: "40", rem: "10rem", px: "160px", value: 160 },
  { key: "48", rem: "12rem", px: "192px", value: 192 },
  { key: "64", rem: "16rem", px: "256px", value: 256 },
] as const;

export default function SpacingPage() {
  return (
    <div data-slot="spacing-page">
      <h1 className="text-3xl font-bold tracking-tight">Spacing</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        The spacing scale used for margins, padding, gaps, and layout. Based on
        a 4px grid with Tailwind utility names.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Spacing Scale</h2>
        <div className="mt-6 space-y-3">
          {spacingScale.map((step) => (
            <div key={step.key} className="flex items-center gap-4">
              <span className="w-40 shrink-0 text-right font-mono text-xs text-muted-foreground">
                {step.key} / {step.rem} / {step.px}
              </span>
              <div
                className="h-6 rounded bg-primary"
                style={{ width: `${step.value}px` }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
