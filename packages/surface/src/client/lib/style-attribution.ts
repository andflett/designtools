/**
 * Client-side style attribution: diff instance runtime styles against
 * component-authored styles to classify each property.
 */

export type Attribution = "inherited" | "overridden" | "instance-added";

export interface ComponentAuthoredStyles {
  properties: Record<string, {
    value: string;
    source: "class" | "css-module" | "scoped-style" | "inline-style";
    tailwindClass?: string;
  }>;
  rawClassName?: string;
}

export interface AttributedValue {
  attribution: Attribution;
  componentValue?: string;
  componentSource?: string;
}

/**
 * For each CSS property key in `instanceProperties`, determine whether it
 * is inherited from the component, overridden by the instance, or
 * added only by the instance.
 *
 * Returns a map from CSS property name to attribution info.
 */
export function attributeStyles(
  instanceProperties: string[],         // CSS property names visible in the panel
  instanceValues: Record<string, string | null>,  // authored/computed values
  componentAuthored: ComponentAuthoredStyles,
): Record<string, AttributedValue> {
  const result: Record<string, AttributedValue> = {};

  for (const prop of instanceProperties) {
    const compEntry = componentAuthored.properties[prop];
    const instanceVal = instanceValues[prop];

    if (!compEntry) {
      result[prop] = { attribution: "instance-added" };
      continue;
    }

    // Normalise for comparison: strip whitespace
    const compNorm = compEntry.value.trim().toLowerCase();
    const instNorm = (instanceVal ?? "").trim().toLowerCase();

    if (compNorm === instNorm || instNorm === "") {
      result[prop] = {
        attribution: "inherited",
        componentValue: compEntry.value,
        componentSource: compEntry.source,
      };
    } else {
      result[prop] = {
        attribution: "overridden",
        componentValue: compEntry.value,
        componentSource: compEntry.source,
      };
    }
  }

  return result;
}
