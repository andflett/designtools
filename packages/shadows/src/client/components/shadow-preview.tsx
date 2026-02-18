interface ShadowPreviewProps {
  value: string;
  size?: number;
  shape?: "square" | "rounded" | "circle";
  background?: string;
}

export function ShadowPreview({
  value,
  size = 32,
  shape = "rounded",
  background = "white",
}: ShadowPreviewProps) {
  const borderRadius =
    shape === "circle" ? "50%" : shape === "rounded" ? "4px" : "0";

  return (
    <div
      className="shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius,
        background,
        boxShadow: value,
        border: "1px solid var(--studio-border-subtle)",
      }}
    />
  );
}
