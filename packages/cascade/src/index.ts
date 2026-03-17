/**
 * @designtools/cascade — CSS layout icon library
 */

// Types
export type { SvgPathData, SlotIconData } from "./types";
export type { IconEntry } from "../generated/types";

// Metadata
import type { IconEntry } from "../generated/types";
import _metadata from "../generated/metadata.json";
export const metadata: IconEntry[] = _metadata;

// Icon data
export {
  DEFAULT_ICONS,
  ALIGNMENT_ICONS,
  DISTRIBUTION_ICONS,
  BORDER_ICONS,
  DISPLAY_ICONS,
  FLEX_ICONS,
  OVERFLOW_ICONS,
  POSITION_ICONS,
  SPACING_ICONS,
  TEXT_ICONS,
  VISUAL_ICONS,
  GLYPH_PATHS,
} from "./icons";

// Properties
export {
  LAYOUT_PROPERTIES,
  slotKey,
  TOTAL_SLOTS,
  type LayoutValue,
  type PreviewType,
  type LayoutPropertyGroup,
} from "./properties";

// Render utilities
export {
  renderPreviewElement,
  IconSvg,
  PV_BG,
  PV_LABEL_COLOR,
} from "./render";
