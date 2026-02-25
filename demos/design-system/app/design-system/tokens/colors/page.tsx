const palettes = ["primary", "neutral", "success", "destructive", "warning", "green", "red", "yellow"] as const;
const shades = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const intents = ["primary", "neutral", "success", "destructive", "warning"] as const;
const variants = ["base", "subdued", "highlight"] as const;

const surfaceTokens = [
  { name: "canvas", bg: "var(--canvas)", fg: "var(--canvas-foreground)" },
  { name: "surface", bg: "var(--surface)", fg: "var(--surface-foreground)" },
  { name: "overlay", bg: "var(--overlay)", fg: "var(--overlay-foreground)" },
];

const utilityTokens = [
  { name: "border", color: "var(--border)" },
  { name: "input", color: "var(--input)" },
  { name: "ring", color: "var(--ring)" },
  { name: "shadow", color: "var(--shadow)" },
];

function getSemanticTokens(intent: string, variant: string) {
  if (variant === "base") {
    return {
      bg: `var(--${intent})`,
      fg: `var(--${intent}-foreground)`,
      label: intent,
    };
  }
  return {
    bg: `var(--${intent}-${variant})`,
    fg: `var(--${intent}-${variant}-foreground)`,
    label: `${intent}-${variant}`,
  };
}

export default function ColorsPage() {
  return (
    <div data-slot="colors-page">
      <h1 className="text-3xl font-bold tracking-tight">Colors</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Color tokens organized as palette scales and semantic mappings. All
        values use oklch and are defined as CSS custom properties.
      </p>

      {/* Palette Scales */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Palette Scales</h2>
        <div className="mt-6 space-y-8">
          {palettes.map((palette) => (
            <div key={palette}>
              <h3 className="mb-2 text-sm font-medium capitalize">
                {palette}
              </h3>
              <div className="grid grid-cols-12 gap-1.5">
                {shades.map((shade) => (
                  <div key={shade}>
                    <div
                      className="h-12 w-full rounded-md border border-border/40"
                      style={{
                        backgroundColor: `var(--${palette}-${shade})`,
                      }}
                    />
                    <p className="mt-1 text-center text-xs text-muted-foreground">
                      {shade}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Semantic Tokens */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Semantic Tokens</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each intent provides base, subdued, and highlight variants with
          matching foreground colors.
        </p>
        <div className="mt-6 space-y-6">
          {intents.map((intent) => (
            <div key={intent}>
              <h3 className="mb-2 text-sm font-medium capitalize">
                {intent}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {variants.map((variant) => {
                  const tokens = getSemanticTokens(intent, variant);
                  return (
                    <div
                      key={variant}
                      className="rounded-lg border border-border/40 p-4"
                      style={{ backgroundColor: tokens.bg }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: tokens.fg }}
                      >
                        {variant === "base" ? intent : `${intent}-${variant}`}
                      </p>
                      <p
                        className="mt-1 text-xs opacity-80"
                        style={{ color: tokens.fg }}
                      >
                        The quick brown fox jumps over the lazy dog.
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Surface & Utility */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Surface & Utility</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Layout surfaces and utility tokens for borders, inputs, and focus
          rings.
        </p>

        <h3 className="mb-2 mt-6 text-sm font-medium">Surfaces</h3>
        <div className="grid grid-cols-3 gap-3">
          {surfaceTokens.map((token) => (
            <div
              key={token.name}
              className="rounded-lg border border-border p-4"
              style={{ backgroundColor: token.bg }}
            >
              <p className="text-sm font-medium" style={{ color: token.fg }}>
                {token.name}
              </p>
              <p
                className="mt-1 text-xs opacity-80"
                style={{ color: token.fg }}
              >
                {token.name}-foreground
              </p>
            </div>
          ))}
        </div>

        <h3 className="mb-2 mt-6 text-sm font-medium">Utility</h3>
        <div className="grid grid-cols-4 gap-3">
          {utilityTokens.map((token) => (
            <div
              key={token.name}
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-4"
            >
              <div
                className="h-10 w-10 rounded-full border border-border/40"
                style={{ backgroundColor: token.color }}
              />
              <p className="text-xs font-medium text-muted-foreground">
                {token.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
