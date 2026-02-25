const shadows = [
  { name: "shadow-sm", class: "shadow-sm" },
  { name: "shadow", class: "shadow" },
  { name: "shadow-md", class: "shadow-md" },
  { name: "shadow-lg", class: "shadow-lg" },
  { name: "shadow-xl", class: "shadow-xl" },
  { name: "shadow-2xl", class: "shadow-2xl" },
] as const;

export default function ShadowsPage() {
  return (
    <div data-slot="shadows-page">
      <h1 className="text-3xl font-bold tracking-tight">Shadows</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Box shadow tokens at six levels of elevation, from subtle to dramatic.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Elevation Scale</h2>
        <div className="mt-6 grid grid-cols-2 gap-6">
          {shadows.map((shadow) => (
            <div
              key={shadow.name}
              className={`rounded-lg bg-surface p-6 ${shadow.class}`}
            >
              <p className="text-sm font-medium text-surface-foreground">
                {shadow.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Apply with the <code className="font-mono">{shadow.class}</code>{" "}
                utility class.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
