/**
 * Barrel file — imports and re-exports all icon sub-files as a single map.
 */

import type { SlotIconData } from "../types";
import { DISPLAY_ICONS } from "./display";
import { FLEX_ICONS } from "./flex";
import { ALIGNMENT_ICONS, DISTRIBUTION_ICONS } from "./alignment";
import { POSITION_ICONS } from "./position";
import { OVERFLOW_ICONS } from "./overflow";
import { TEXT_ICONS } from "./text";
import { BORDER_ICONS } from "./border";
import { SPACING_ICONS } from "./spacing";
import { VISUAL_ICONS } from "./visual";

export const DEFAULT_ICONS: Record<string, SlotIconData> = {
  ...POSITION_ICONS,
  ...DISPLAY_ICONS,
  ...FLEX_ICONS,
  ...ALIGNMENT_ICONS,
  ...SPACING_ICONS,
  ...BORDER_ICONS,
  ...OVERFLOW_ICONS,
  ...TEXT_ICONS,
  ...VISUAL_ICONS,
};

export { ALIGNMENT_ICONS, DISTRIBUTION_ICONS } from "./alignment";
export { BORDER_ICONS } from "./border";
export { DISPLAY_ICONS } from "./display";
export { FLEX_ICONS } from "./flex";
export { OVERFLOW_ICONS } from "./overflow";
export { POSITION_ICONS } from "./position";
export { SPACING_ICONS } from "./spacing";
export { TEXT_ICONS } from "./text";
export { VISUAL_ICONS } from "./visual";
export { GLYPH_PATHS } from "./glyph-paths";
