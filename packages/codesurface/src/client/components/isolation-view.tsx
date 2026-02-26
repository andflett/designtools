/**
 * Component isolation toolbar — shown when a component is in preview mode.
 * Displays the component name, a back button to return to the page,
 * and variant dimension toggles to filter the preview grid.
 */
import { useState, useMemo, useCallback } from "react";
import {
  ArrowLeftIcon,
  MixerHorizontalIcon,
  Component1Icon,
} from "@radix-ui/react-icons";
import type { ComponentEntry, VariantDimension } from "../../server/lib/scan-components.js";
import type { PreviewCombination } from "../../shared/protocol.js";

interface IsolationViewProps {
  component: ComponentEntry;
  onBack: () => void;
  onCombinationsChange: (combinations: PreviewCombination[]) => void;
}

/**
 * Generate preview combinations: vary one dimension at a time,
 * keeping all others at their defaults.
 */
export function generateCombinations(
  variants: VariantDimension[],
  enabledDimensions?: Set<string>
): PreviewCombination[] {
  if (variants.length === 0) {
    return [{ label: "Default", props: {} }];
  }

  const defaults: Record<string, string> = {};
  for (const dim of variants) {
    defaults[dim.name] = dim.default;
  }

  const combinations: PreviewCombination[] = [];

  for (const dim of variants) {
    if (enabledDimensions && !enabledDimensions.has(dim.name)) continue;

    for (const option of dim.options) {
      combinations.push({
        label: `${dim.name}: ${option}`,
        props: { ...defaults, [dim.name]: option },
      });
    }
  }

  // Dedupe the "all defaults" combination if it appears multiple times
  const seen = new Set<string>();
  return combinations.filter((c) => {
    const key = JSON.stringify(c.props);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function IsolationView({
  component,
  onBack,
  onCombinationsChange,
}: IsolationViewProps) {
  const [enabledDimensions, setEnabledDimensions] = useState<Set<string>>(
    () => new Set(component.variants.map((v) => v.name))
  );

  const combinations = useMemo(() => {
    const combos = generateCombinations(component.variants, enabledDimensions);
    return combos;
  }, [component.variants, enabledDimensions]);

  // Notify parent when combinations change
  const prevCombosRef = useMemo(() => ({ current: "" }), []);
  const combosKey = JSON.stringify(combinations);
  if (prevCombosRef.current !== combosKey) {
    prevCombosRef.current = combosKey;
    // Defer to avoid setState during render
    setTimeout(() => onCombinationsChange(combinations), 0);
  }

  const toggleDimension = useCallback((name: string) => {
    setEnabledDimensions((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--studio-surface)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b shrink-0"
        style={{ borderColor: "var(--studio-border)" }}
      >
        <button
          onClick={onBack}
          className="studio-icon-btn shrink-0"
          style={{ width: 22, height: 22 }}
          title="Back to page"
        >
          <ArrowLeftIcon style={{ width: 12, height: 12 }} />
        </button>
        <Component1Icon
          style={{
            width: 12,
            height: 12,
            color: "var(--studio-accent)",
            flexShrink: 0,
          }}
        />
        <span
          className="text-[11px] font-semibold truncate"
          style={{ color: "var(--studio-text)" }}
        >
          {component.name}
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--studio-text-dimmed)" }}
        >
          Isolation
        </span>
      </div>

      {/* Variant dimension toggles */}
      {component.variants.length > 0 && (
        <div className="px-3 py-2 border-b" style={{ borderColor: "var(--studio-border)" }}>
          <div
            className="flex items-center gap-1.5 mb-2"
            style={{ color: "var(--studio-text-dimmed)" }}
          >
            <MixerHorizontalIcon style={{ width: 10, height: 10 }} />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Dimensions
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {component.variants.map((dim) => {
              const isEnabled = enabledDimensions.has(dim.name);
              return (
                <button
                  key={dim.name}
                  onClick={() => toggleDimension(dim.name)}
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{
                    background: isEnabled
                      ? "var(--studio-accent-muted)"
                      : "var(--studio-surface-hover)",
                    color: isEnabled
                      ? "var(--studio-accent)"
                      : "var(--studio-text-dimmed)",
                    border: "1px solid",
                    borderColor: isEnabled
                      ? "var(--studio-accent)"
                      : "var(--studio-border)",
                    cursor: "pointer",
                  }}
                >
                  {dim.name}
                  <span style={{ opacity: 0.6, marginLeft: 4 }}>
                    {dim.options.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Combination count */}
      <div
        className="px-3 py-2 text-[10px]"
        style={{ color: "var(--studio-text-dimmed)" }}
      >
        {combinations.length} combination{combinations.length !== 1 ? "s" : ""} shown
      </div>
    </div>
  );
}
