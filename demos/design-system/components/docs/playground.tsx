"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/docs/code-block";

export interface PlaygroundProps {
  variants: { name: string; label: string }[];
  renderPreview: (variant: string) => React.ReactNode;
  renderCode: (variant: string) => string;
  defaultVariant?: string;
}

export function Playground({
  variants,
  renderPreview,
  renderCode,
  defaultVariant,
}: PlaygroundProps) {
  const [activeVariant, setActiveVariant] = useState(
    defaultVariant ?? variants[0]?.name ?? ""
  );

  return (
    <div>
      {/* Preview area */}
      <div className="flex min-h-[160px] items-center justify-center rounded-t-lg border border-border bg-neutral-50 p-6">
        {renderPreview(activeVariant)}
      </div>

      {/* Variant tabs */}
      <div className="flex gap-0 border-x border-border bg-white">
        {variants.map((variant) => (
          <button
            key={variant.name}
            onClick={() => setActiveVariant(variant.name)}
            className={`px-4 py-2 text-sm transition-colors cursor-pointer ${
              activeVariant === variant.name
                ? "border-b-2 border-primary text-foreground font-medium"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {variant.label}
          </button>
        ))}
      </div>

      {/* Code block */}
      <CodeBlock
        code={renderCode(activeVariant)}
        live
        className="rounded-t-none"
      />
    </div>
  );
}
