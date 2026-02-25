export default function DesignSystemOverview() {
  return (
    <div data-slot="overview-page">
      <h1 className="text-3xl font-bold tracking-tight">Flett Design System</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        A comprehensive design system built with semantic tokens, Radix
        primitives, and Tailwind CSS v4. Browse tokens and components using the
        sidebar navigation.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <OverviewCard
          title="Tokens"
          description="Color palettes, typography scales, spacing units, and shadow definitions that form the visual foundation."
          items={["Colors", "Typography", "Spacing", "Shadows"]}
        />
        <OverviewCard
          title="Components"
          description="28 reusable UI components built with Radix primitives, CVA variants, and semantic design tokens."
          items={["Button", "Card", "Dialog", "Table", "Tabs", "Toast"]}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Design Principles</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <PrincipleCard
            title="Semantic Tokens"
            description="All colors reference semantic tokens — primary, neutral, success, destructive, warning — not raw palette values."
          />
          <PrincipleCard
            title="Composable"
            description="Components use data-slot attributes and Radix primitives for accessible, composable interactions."
          />
          <PrincipleCard
            title="Theme-aware"
            description="Light and dark modes are supported through CSS custom properties with oklch color values."
          />
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div
      data-slot="overview-card"
      className="rounded-lg border border-border bg-surface p-6"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-neutral-subdued px-2 py-0.5 text-xs font-medium text-neutral-subdued-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PrincipleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      data-slot="principle-card"
      className="rounded-lg border border-border p-4"
    >
      <h4 className="text-sm font-semibold">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
