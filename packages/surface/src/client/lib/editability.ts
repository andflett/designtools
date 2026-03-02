/**
 * Editability tiers for selected elements.
 * Determines what can be edited based on source attribution.
 */
import type { SelectedElementData } from "../../shared/protocol.js";

export type EditabilityTier = "full" | "instance-only" | "inspect-only";

/**
 * Compute the editability tier for a selected element.
 *
 * - `full`: source exists and is a project file (not node_modules)
 * - `instance-only`: no editable source, but instanceSource exists (can override at usage site)
 * - `inspect-only`: neither source nor instanceSource — read-only inspection
 */
export function getEditability(element: SelectedElementData | null): EditabilityTier {
  if (!element) return "inspect-only";

  // source exists and is a project file (not from node_modules)
  if (element.source && !element.source.file.includes("node_modules")) {
    return "full";
  }

  // Can edit at the usage site
  if (element.instanceSource) {
    return "instance-only";
  }

  return "inspect-only";
}
