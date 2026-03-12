/**
 * Icon Reference Page
 *
 * Lists every icon used in the @designtools/surface editor controls.
 * Designed to be human-scannable and LLM-readable.
 *
 * Each icon shows: visual preview, name, library, usage context,
 * and a collapsible SVG source block.
 */
import { useState, type ComponentType, type ReactElement, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ─── Radix UI Icons ──────────────────────────────────────────────────────────
import {
  WidthIcon,
  HeightIcon,
  PaddingIcon,
  MarginIcon,
  FontFamilyIcon,
  FontSizeIcon,
  FontBoldIcon,
  LineHeightIcon,
  LetterSpacingIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  TextAlignTopIcon,
  TextAlignBottomIcon,
  UnderlineIcon,
  StrikethroughIcon,
  LetterCaseUppercaseIcon,
  LetterCaseLowercaseIcon,
  LetterCaseCapitalizeIcon,
  TextNoneIcon,
  BorderWidthIcon,
  BorderStyleIcon,
  CornersIcon,
  CornerTopLeftIcon,
  CornerTopRightIcon,
  CornerBottomLeftIcon,
  CornerBottomRightIcon,
  OpacityIcon,
  ShadowIcon,
  LayersIcon,
  MoveIcon,
  ColumnSpacingIcon,
  RowSpacingIcon,
  LayoutIcon,
  GridIcon,
  BoxIcon,
  RowsIcon,
  ColumnsIcon,
  AlignLeftIcon,
  AlignCenterHorizontallyIcon,
  AlignRightIcon,
  AlignTopIcon,
  AlignCenterVerticallyIcon,
  AlignBottomIcon,
  SpaceBetweenHorizontallyIcon,
  SpaceEvenlyHorizontallyIcon,
  StretchHorizontallyIcon,
  EyeNoneIcon,
  EyeClosedIcon,
  DimensionsIcon,
  ColorWheelIcon,
  ReloadIcon,
  Component1Icon,
  ComponentInstanceIcon,
  MixerHorizontalIcon,
  MixerVerticalIcon,
  TokensIcon,
  DesktopIcon,
  FrameIcon,
  TransformIcon,
  RulerSquareIcon,
  Cross2Icon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  CursorArrowIcon,
  PlusIcon,
  TrashIcon,
  Pencil1Icon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  GlobeIcon,
  CodeIcon,
  InfoCircledIcon,
  SliderIcon,
  SquareIcon,
  ArrowLeftIcon,
  BoxModelIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

// ─── Lucide Icons ────────────────────────────────────────────────────────────
import {
  SquareArrowRightExit,
  Maximize2,
  Maximize,
  LayoutGrid,
  Palette,
  Move,
  Type,
  Sparkles,
  Square,
  Crosshair,
  Pin,
  WrapText,
  AlignJustify,
  Columns3,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronsDownUp,
  ChevronsUpDown,
  ZoomIn,
  ZoomOut,
  Monitor,
  ChevronDown,
  CornerDownLeft,
  Bold,
  Activity,
  PanelTop,
  ArrowRightToLine,
  ToggleLeft,
  Circle,
  AlignLeft,
  Package,
  Layers,
  PanelTopDashed,
  PanelRightDashed,
  PanelBottomDashed,
  PanelLeftDashed,
  PanelLeftRightDashed,
  PanelTopBottomDashed,
  Plus,
  Minus,
  Info,
  RotateCw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface IconEntry {
  name: string;
  library: "radix" | "lucide" | "custom";
  importPath: string;
  category: string;
  usedFor: string;
  usedIn: string[];
  render: () => ReactElement;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Wrap a Radix icon (15×15 viewBox) */
const radix = (Icon: ComponentType<{ width?: number; height?: number }>) => () =>
  createElement(Icon, { width: 20, height: 20 });

/** Wrap a Lucide icon (24×24 viewBox, stroke-based) */
const lucide = (Icon: ComponentType<{ size?: number; strokeWidth?: number }>) => () =>
  createElement(Icon, { size: 20, strokeWidth: 1.5 });

// ─── Icon Registry ───────────────────────────────────────────────────────────

const ICONS: IconEntry[] = [
  // ── Size & Layout ──────────────────────────────────────────────────────────
  {
    name: "WidthIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Size & Layout",
    usedFor: "Width, min-width, max-width property controls",
    usedIn: ["property-icons.ts", "property-panel.tsx", "controls-gallery.tsx"],
    render: radix(WidthIcon),
  },
  {
    name: "HeightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Size & Layout",
    usedFor: "Height, min-height, max-height property controls",
    usedIn: ["property-icons.ts", "property-panel.tsx"],
    render: radix(HeightIcon),
  },
  {
    name: "DimensionsIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Size & Layout",
    usedFor: "Size/dimensions indicator in isolation view",
    usedIn: ["isolation-view.tsx", "editor-panel.tsx"],
    render: radix(DimensionsIcon),
  },
  {
    name: "Maximize2",
    library: "lucide",
    importPath: "lucide-react",
    category: "Size & Layout",
    usedFor: "Size section header (max-width)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: lucide(Maximize2),
  },
  {
    name: "Maximize",
    library: "lucide",
    importPath: "lucide-react",
    category: "Size & Layout",
    usedFor: "Maximize property control",
    usedIn: ["property-panel.tsx", "editor-panel.tsx"],
    render: lucide(Maximize),
  },

  // ── Spacing ────────────────────────────────────────────────────────────────
  {
    name: "PaddingIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Spacing",
    usedFor: "Padding property controls (all sides)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx", "controls-gallery.tsx", "box-spacing.tsx"],
    render: radix(PaddingIcon),
  },
  {
    name: "MarginIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Spacing",
    usedFor: "Margin property controls (all sides)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx", "controls-gallery.tsx", "box-spacing.tsx"],
    render: radix(MarginIcon),
  },
  {
    name: "ColumnSpacingIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Spacing",
    usedFor: "Column gap / horizontal gap controls",
    usedIn: ["property-icons.ts", "property-panel.tsx"],
    render: radix(ColumnSpacingIcon),
  },
  {
    name: "RowSpacingIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Spacing",
    usedFor: "Row gap / vertical gap controls",
    usedIn: ["property-icons.ts", "property-panel.tsx"],
    render: radix(RowSpacingIcon),
  },
  {
    name: "Move (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Spacing section header icon",
    usedIn: ["computed-property-panel.tsx", "token-editor.tsx"],
    render: lucide(Move),
  },
  {
    name: "BoxModelIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Spacing",
    usedFor: "Box model toggle in spacing controls",
    usedIn: ["box-spacing.tsx"],
    render: radix(BoxModelIcon),
  },
  {
    name: "PanelTopDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Top spacing side indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelTopDashed),
  },
  {
    name: "PanelRightDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Right spacing side indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelRightDashed),
  },
  {
    name: "PanelBottomDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Bottom spacing side indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelBottomDashed),
  },
  {
    name: "PanelLeftDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Left spacing side indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelLeftDashed),
  },
  {
    name: "PanelLeftRightDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Horizontal axis (X) spacing indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelLeftRightDashed),
  },
  {
    name: "PanelTopBottomDashed",
    library: "lucide",
    importPath: "lucide-react",
    category: "Spacing",
    usedFor: "Vertical axis (Y) spacing indicator",
    usedIn: ["box-spacing.tsx"],
    render: lucide(PanelTopBottomDashed),
  },

  // ── Flex & Grid Layout ─────────────────────────────────────────────────────
  {
    name: "LayoutIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Flex & Grid Layout",
    usedFor: "Display flex/grid indicator",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(LayoutIcon),
  },
  {
    name: "GridIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Flex & Grid Layout",
    usedFor: "Display grid indicator",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(GridIcon),
  },
  {
    name: "BoxIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Flex & Grid Layout",
    usedFor: "Display block indicator; generic element in page explorer",
    usedIn: ["computed-property-panel.tsx", "page-explorer.tsx"],
    render: radix(BoxIcon),
  },
  {
    name: "RowsIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Flex & Grid Layout",
    usedFor: "Flex direction row (horizontal stacking)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(RowsIcon),
  },
  {
    name: "ColumnsIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Flex & Grid Layout",
    usedFor: "Flex direction column (vertical stacking)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(ColumnsIcon),
  },
  {
    name: "Columns3",
    library: "lucide",
    importPath: "lucide-react",
    category: "Flex & Grid Layout",
    usedFor: "Flex direction row option in segmented control",
    usedIn: ["computed-property-panel.tsx", "editor-panel.tsx"],
    render: lucide(Columns3),
  },
  {
    name: "LayoutGrid",
    library: "lucide",
    importPath: "lucide-react",
    category: "Flex & Grid Layout",
    usedFor: "Layout section header icon",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: lucide(LayoutGrid),
  },
  {
    name: "WrapText",
    library: "lucide",
    importPath: "lucide-react",
    category: "Flex & Grid Layout",
    usedFor: "Flex wrap option",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: lucide(WrapText),
  },
  {
    name: "AlignJustify (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Flex & Grid Layout",
    usedFor: "Flex nowrap option",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: lucide(AlignJustify),
  },

  // ── Alignment ──────────────────────────────────────────────────────────────
  {
    name: "AlignLeftIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Justify content flex-start (horizontal)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignLeftIcon),
  },
  {
    name: "AlignCenterHorizontallyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Justify content center",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignCenterHorizontallyIcon),
  },
  {
    name: "AlignRightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Justify content flex-end",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignRightIcon),
  },
  {
    name: "SpaceBetweenHorizontallyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Justify content space-between",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx", "token-editor.tsx"],
    render: radix(SpaceBetweenHorizontallyIcon),
  },
  {
    name: "SpaceEvenlyHorizontallyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Justify content space-evenly",
    usedIn: ["property-panel.tsx"],
    render: radix(SpaceEvenlyHorizontallyIcon),
  },
  {
    name: "AlignTopIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Align items flex-start (vertical)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignTopIcon),
  },
  {
    name: "AlignCenterVerticallyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Align items center (vertical)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignCenterVerticallyIcon),
  },
  {
    name: "AlignBottomIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Align items flex-end (vertical)",
    usedIn: ["computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(AlignBottomIcon),
  },
  {
    name: "StretchHorizontallyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Alignment",
    usedFor: "Align items stretch",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(StretchHorizontallyIcon),
  },
  {
    name: "AlignLeft (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Alignment",
    usedFor: "Align left indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(AlignLeft),
  },

  // ── Typography ─────────────────────────────────────────────────────────────
  {
    name: "FontFamilyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Font family property selector",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx"],
    render: radix(FontFamilyIcon),
  },
  {
    name: "FontSizeIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Font size scale input control",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx", "property-panel.tsx", "controls-gallery.tsx"],
    render: radix(FontSizeIcon),
  },
  {
    name: "FontBoldIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Font weight (bold) control",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx", "property-panel.tsx"],
    render: radix(FontBoldIcon),
  },
  {
    name: "LineHeightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Line height (leading) control",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx"],
    render: radix(LineHeightIcon),
  },
  {
    name: "LetterSpacingIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Letter spacing (tracking) control",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx"],
    render: radix(LetterSpacingIcon),
  },
  {
    name: "TextAlignLeftIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text align left option",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx", "controls-gallery.tsx"],
    render: radix(TextAlignLeftIcon),
  },
  {
    name: "TextAlignCenterIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text align center option",
    usedIn: ["computed-property-panel.tsx", "controls-gallery.tsx", "isolation-view.tsx"],
    render: radix(TextAlignCenterIcon),
  },
  {
    name: "TextAlignRightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text align right option",
    usedIn: ["computed-property-panel.tsx", "controls-gallery.tsx"],
    render: radix(TextAlignRightIcon),
  },
  {
    name: "TextAlignJustifyIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text align justify option",
    usedIn: ["computed-property-panel.tsx", "controls-gallery.tsx"],
    render: radix(TextAlignJustifyIcon),
  },
  {
    name: "TextAlignTopIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Vertical text align top",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(TextAlignTopIcon),
  },
  {
    name: "TextAlignBottomIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Vertical text align bottom",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(TextAlignBottomIcon),
  },
  {
    name: "UnderlineIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text decoration underline toggle",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx"],
    render: radix(UnderlineIcon),
  },
  {
    name: "StrikethroughIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text decoration line-through toggle",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(StrikethroughIcon),
  },
  {
    name: "TextNoneIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text decoration none option",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(TextNoneIcon),
  },
  {
    name: "LetterCaseUppercaseIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text transform uppercase toggle",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx"],
    render: radix(LetterCaseUppercaseIcon),
  },
  {
    name: "LetterCaseLowercaseIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text transform lowercase toggle",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(LetterCaseLowercaseIcon),
  },
  {
    name: "LetterCaseCapitalizeIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Typography",
    usedFor: "Text transform capitalize toggle",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(LetterCaseCapitalizeIcon),
  },
  {
    name: "Type",
    library: "lucide",
    importPath: "lucide-react",
    category: "Typography",
    usedFor: "Typography section header icon",
    usedIn: ["computed-property-panel.tsx", "editor-panel.tsx"],
    render: lucide(Type),
  },
  {
    name: "Bold",
    library: "lucide",
    importPath: "lucide-react",
    category: "Typography",
    usedFor: "Font weight bold indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(Bold),
  },

  // ── Borders & Corners ──────────────────────────────────────────────────────
  {
    name: "BorderWidthIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border width property controls (all sides)",
    usedIn: ["property-icons.ts", "computed-property-panel.tsx", "token-editor.tsx"],
    render: radix(BorderWidthIcon),
  },
  {
    name: "BorderStyleIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border style property control",
    usedIn: ["property-icons.ts"],
    render: radix(BorderStyleIcon),
  },
  {
    name: "CornersIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Uniform border radius control; border section header",
    usedIn: ["computed-property-panel.tsx", "box-radius.tsx", "editor-panel.tsx", "token-editor.tsx"],
    render: radix(CornersIcon),
  },
  {
    name: "CornerTopLeftIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border top-left radius control",
    usedIn: ["property-icons.ts", "box-radius.tsx"],
    render: radix(CornerTopLeftIcon),
  },
  {
    name: "CornerTopRightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border top-right radius control",
    usedIn: ["property-icons.ts", "box-radius.tsx"],
    render: radix(CornerTopRightIcon),
  },
  {
    name: "CornerBottomLeftIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border bottom-left radius control",
    usedIn: ["property-icons.ts", "box-radius.tsx"],
    render: radix(CornerBottomLeftIcon),
  },
  {
    name: "CornerBottomRightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Borders & Corners",
    usedFor: "Border bottom-right radius control",
    usedIn: ["property-icons.ts", "box-radius.tsx"],
    render: radix(CornerBottomRightIcon),
  },
  {
    name: "Square (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Borders & Corners",
    usedFor: "Border section header icon",
    usedIn: ["computed-property-panel.tsx"],
    render: lucide(Square),
  },

  // ── Color & Appearance ─────────────────────────────────────────────────────
  {
    name: "OpacityIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Color & Appearance",
    usedFor: "Opacity property control and slider",
    usedIn: ["property-icons.ts", "opacity-slider.tsx", "controls-gallery.tsx"],
    render: radix(OpacityIcon),
  },
  {
    name: "ColorWheelIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Color & Appearance",
    usedFor: "Color property indicator in isolation view",
    usedIn: ["isolation-view.tsx"],
    render: radix(ColorWheelIcon),
  },
  {
    name: "Palette",
    library: "lucide",
    importPath: "lucide-react",
    category: "Color & Appearance",
    usedFor: "Color section header icon",
    usedIn: ["computed-property-panel.tsx", "token-editor.tsx", "editor-panel.tsx"],
    render: lucide(Palette),
  },
  {
    name: "Circle",
    library: "lucide",
    importPath: "lucide-react",
    category: "Color & Appearance",
    usedFor: "Circle / fill indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(Circle),
  },

  // ── Effects ────────────────────────────────────────────────────────────────
  {
    name: "ShadowIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Effects",
    usedFor: "Box shadow property control; shadow picker",
    usedIn: ["property-icons.ts", "shadow-picker.tsx"],
    render: radix(ShadowIcon),
  },
  {
    name: "Sparkles",
    library: "lucide",
    importPath: "lucide-react",
    category: "Effects",
    usedFor: "Effects section header; special/used tokens indicator",
    usedIn: ["computed-property-panel.tsx", "editor-panel.tsx", "token-editor.tsx"],
    render: lucide(Sparkles),
  },

  // ── Position ───────────────────────────────────────────────────────────────
  {
    name: "MoveIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Position",
    usedFor: "Position offset controls (top, right, bottom, left)",
    usedIn: ["property-icons.ts"],
    render: radix(MoveIcon),
  },
  {
    name: "Crosshair",
    library: "lucide",
    importPath: "lucide-react",
    category: "Position",
    usedFor: "Position absolute indicator in segmented control",
    usedIn: ["computed-property-panel.tsx"],
    render: lucide(Crosshair),
  },
  {
    name: "Pin",
    library: "lucide",
    importPath: "lucide-react",
    category: "Position",
    usedFor: "Position fixed indicator in segmented control",
    usedIn: ["computed-property-panel.tsx"],
    render: lucide(Pin),
  },

  // ── Direction Arrows ───────────────────────────────────────────────────────
  {
    name: "ArrowRight",
    library: "lucide",
    importPath: "lucide-react",
    category: "Direction Arrows",
    usedFor: "Direction arrow for flex-direction and navigation",
    usedIn: ["property-panel.tsx", "computed-property-panel.tsx"],
    render: lucide(ArrowRight),
  },
  {
    name: "ArrowDown",
    library: "lucide",
    importPath: "lucide-react",
    category: "Direction Arrows",
    usedFor: "Direction arrow for flex-direction column",
    usedIn: ["property-panel.tsx"],
    render: lucide(ArrowDown),
  },
  {
    name: "ArrowLeft",
    library: "lucide",
    importPath: "lucide-react",
    category: "Direction Arrows",
    usedFor: "Direction arrow for flex-direction row-reverse",
    usedIn: ["property-panel.tsx"],
    render: lucide(ArrowLeft),
  },
  {
    name: "ArrowUp",
    library: "lucide",
    importPath: "lucide-react",
    category: "Direction Arrows",
    usedFor: "Direction arrow for flex-direction column-reverse",
    usedIn: ["property-panel.tsx"],
    render: lucide(ArrowUp),
  },
  {
    name: "ArrowLeftIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Direction Arrows",
    usedFor: "Back navigation button in isolation view",
    usedIn: ["isolation-view.tsx"],
    render: radix(ArrowLeftIcon),
  },
  {
    name: "ArrowRightToLine",
    library: "lucide",
    importPath: "lucide-react",
    category: "Direction Arrows",
    usedFor: "Export / send action in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(ArrowRightToLine),
  },

  // ── Overflow & Visibility ──────────────────────────────────────────────────
  {
    name: "SquareArrowRightExit",
    library: "lucide",
    importPath: "lucide-react",
    category: "Overflow & Visibility",
    usedFor: "Overflow property icon (content exiting container)",
    usedIn: ["property-icons.ts"],
    render: lucide(SquareArrowRightExit),
  },
  {
    name: "EyeNoneIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Overflow & Visibility",
    usedFor: "Display none indicator",
    usedIn: ["computed-property-panel.tsx"],
    render: radix(EyeNoneIcon),
  },
  {
    name: "EyeClosedIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Overflow & Visibility",
    usedFor: "Disabled/hidden state indicator",
    usedIn: ["isolation-view.tsx"],
    render: radix(EyeClosedIcon),
  },

  // ── Z-Index & Layers ───────────────────────────────────────────────────────
  {
    name: "LayersIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Z-Index & Layers",
    usedFor: "Z-index / layers property; layer indicator in editor panel",
    usedIn: ["property-icons.ts", "editor-panel.tsx", "isolation-view.tsx"],
    render: radix(LayersIcon),
  },
  {
    name: "Layers (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Z-Index & Layers",
    usedFor: "Layers section in page explorer and token editor",
    usedIn: ["page-explorer.tsx", "token-editor.tsx", "editor-panel.tsx"],
    render: lucide(Layers),
  },

  // ── Components & Tokens ────────────────────────────────────────────────────
  {
    name: "Component1Icon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Components & Tokens",
    usedFor: "Component symbol in editor panel and page explorer",
    usedIn: ["editor-panel.tsx", "isolation-view.tsx", "page-explorer.tsx"],
    render: radix(Component1Icon),
  },
  {
    name: "ComponentInstanceIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Components & Tokens",
    usedFor: "Component instance indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: radix(ComponentInstanceIcon),
  },
  {
    name: "MixerHorizontalIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Components & Tokens",
    usedFor: "Variant / mixer prop indicator in isolation view and editor panel",
    usedIn: ["isolation-view.tsx", "editor-panel.tsx"],
    render: radix(MixerHorizontalIcon),
  },
  {
    name: "MixerVerticalIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Components & Tokens",
    usedFor: "Layout direction prop; vertical mixer in computed property panel",
    usedIn: ["isolation-view.tsx", "computed-property-panel.tsx"],
    render: radix(MixerVerticalIcon),
  },
  {
    name: "TokensIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Components & Tokens",
    usedFor: "Tokens / design tokens tab icon; token mode toggle in scale input",
    usedIn: ["editor-panel.tsx", "scale-input.tsx"],
    render: radix(TokensIcon),
  },
  {
    name: "Package",
    library: "lucide",
    importPath: "lucide-react",
    category: "Components & Tokens",
    usedFor: "Package / module icon in page explorer",
    usedIn: ["page-explorer.tsx"],
    render: lucide(Package),
  },

  // ── Toolbar & Chrome ───────────────────────────────────────────────────────
  {
    name: "CursorArrowIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Selection mode toggle in toolbar",
    usedIn: ["editor-panel.tsx", "tool-chrome.tsx"],
    render: radix(CursorArrowIcon),
  },
  {
    name: "SunIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Light theme toggle",
    usedIn: ["tool-chrome.tsx"],
    render: radix(SunIcon),
  },
  {
    name: "MoonIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Dark theme toggle",
    usedIn: ["tool-chrome.tsx"],
    render: radix(MoonIcon),
  },
  {
    name: "GlobeIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Address bar / URL icon in toolbar",
    usedIn: ["tool-chrome.tsx"],
    render: radix(GlobeIcon),
  },
  {
    name: "ReloadIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Rescan / reload button; loading spinner",
    usedIn: ["tool-chrome.tsx", "isolation-view.tsx"],
    render: radix(ReloadIcon),
  },
  {
    name: "DesktopIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Device preview toggle in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: radix(DesktopIcon),
  },
  {
    name: "FrameIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Frame / container indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: radix(FrameIcon),
  },
  {
    name: "TransformIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Transform / rotate / scale controls",
    usedIn: ["editor-panel.tsx"],
    render: radix(TransformIcon),
  },
  {
    name: "RulerSquareIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Toolbar & Chrome",
    usedFor: "Measurement / ruler tool",
    usedIn: ["editor-panel.tsx"],
    render: radix(RulerSquareIcon),
  },
  {
    name: "Monitor",
    library: "lucide",
    importPath: "lucide-react",
    category: "Toolbar & Chrome",
    usedFor: "Breakpoint / device selector in toolbar",
    usedIn: ["tool-chrome.tsx"],
    render: lucide(Monitor),
  },
  {
    name: "ZoomIn",
    library: "lucide",
    importPath: "lucide-react",
    category: "Toolbar & Chrome",
    usedFor: "Zoom in button in toolbar",
    usedIn: ["tool-chrome.tsx"],
    render: lucide(ZoomIn),
  },
  {
    name: "ZoomOut",
    library: "lucide",
    importPath: "lucide-react",
    category: "Toolbar & Chrome",
    usedFor: "Zoom out button in toolbar",
    usedIn: ["tool-chrome.tsx"],
    render: lucide(ZoomOut),
  },
  {
    name: "PanelTop",
    library: "lucide",
    importPath: "lucide-react",
    category: "Toolbar & Chrome",
    usedFor: "Panel layout indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(PanelTop),
  },
  {
    name: "Activity",
    library: "lucide",
    importPath: "lucide-react",
    category: "Toolbar & Chrome",
    usedFor: "Activity indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(Activity),
  },

  // ── Generic Actions ────────────────────────────────────────────────────────
  {
    name: "PlusIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Add item button (properties, shadows, tokens)",
    usedIn: ["computed-property-panel.tsx", "shadow-list.tsx", "shadow-controls.tsx", "token-editor.tsx"],
    render: radix(PlusIcon),
  },
  {
    name: "Plus (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Generic Actions",
    usedFor: "Add grid track button",
    usedIn: ["grid-input.tsx"],
    render: lucide(Plus),
  },
  {
    name: "Minus",
    library: "lucide",
    importPath: "lucide-react",
    category: "Generic Actions",
    usedFor: "Remove grid track button",
    usedIn: ["grid-input.tsx"],
    render: lucide(Minus),
  },
  {
    name: "TrashIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Delete item button (shadows, tokens)",
    usedIn: ["shadow-list.tsx", "shadow-controls.tsx", "token-editor.tsx"],
    render: radix(TrashIcon),
  },
  {
    name: "Pencil1Icon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Edit mode toggle for shadows and tokens",
    usedIn: ["shadow-list.tsx", "token-editor.tsx"],
    render: radix(Pencil1Icon),
  },
  {
    name: "Cross2Icon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Close / dismiss button (panels, editors, settings)",
    usedIn: ["editor-panel.tsx", "settings-page.tsx", "shadow-list.tsx", "usage-panel.tsx", "token-editor.tsx"],
    render: radix(Cross2Icon),
  },
  {
    name: "CheckIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Selection confirmation; checkmark in select dropdowns",
    usedIn: ["editor-panel.tsx", "tool-chrome.tsx", "isolation-view.tsx", "select.tsx", "shadow-list.tsx", "token-editor.tsx"],
    render: radix(CheckIcon),
  },
  {
    name: "BookmarkIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Generic Actions",
    usedFor: "Bookmark / favorite for shadow presets",
    usedIn: ["shadow-list.tsx"],
    render: radix(BookmarkIcon),
  },

  // ── Navigation & Disclosure ────────────────────────────────────────────────
  {
    name: "ChevronRightIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Navigation & Disclosure",
    usedFor: "Collapsed section indicator; tree node expand trigger",
    usedIn: ["editor-panel.tsx", "computed-property-panel.tsx", "page-explorer.tsx", "shadow-list.tsx", "isolation-view.tsx", "token-editor.tsx", "instruction-panel.tsx", "usage-panel.tsx", "token-overview.tsx"],
    render: radix(ChevronRightIcon),
  },
  {
    name: "ChevronDownIcon (radix)",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Navigation & Disclosure",
    usedFor: "Expanded section indicator; tree node collapse trigger",
    usedIn: ["editor-panel.tsx", "computed-property-panel.tsx", "page-explorer.tsx", "shadow-list.tsx", "isolation-view.tsx", "token-editor.tsx", "instruction-panel.tsx", "usage-panel.tsx", "token-overview.tsx"],
    render: radix(ChevronDownIcon),
  },
  {
    name: "ChevronDown (lucide)",
    library: "lucide",
    importPath: "lucide-react",
    category: "Navigation & Disclosure",
    usedFor: "Dropdown toggle in toolbar and terminal panel",
    usedIn: ["tool-chrome.tsx", "terminal-panel.tsx"],
    render: lucide(ChevronDown),
  },
  {
    name: "ChevronsDownUp",
    library: "lucide",
    importPath: "lucide-react",
    category: "Navigation & Disclosure",
    usedFor: "Collapse all sections bidirectional toggle",
    usedIn: ["computed-property-panel.tsx", "token-editor.tsx", "editor-panel.tsx", "page-explorer.tsx"],
    render: lucide(ChevronsDownUp),
  },
  {
    name: "ChevronsUpDown",
    library: "lucide",
    importPath: "lucide-react",
    category: "Navigation & Disclosure",
    usedFor: "Expand all sections bidirectional toggle",
    usedIn: ["computed-property-panel.tsx", "token-editor.tsx", "page-explorer.tsx"],
    render: lucide(ChevronsUpDown),
  },
  {
    name: "CornerDownLeft",
    library: "lucide",
    importPath: "lucide-react",
    category: "Navigation & Disclosure",
    usedFor: "Enter / send button in terminal panel",
    usedIn: ["terminal-panel.tsx"],
    render: lucide(CornerDownLeft),
  },

  // ── Search & Info ──────────────────────────────────────────────────────────
  {
    name: "MagnifyingGlassIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Search & Info",
    usedFor: "Search / filter input icon in select dropdowns",
    usedIn: ["select.tsx"],
    render: radix(MagnifyingGlassIcon),
  },
  {
    name: "InfoCircledIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Search & Info",
    usedFor: "Info / help tooltip trigger",
    usedIn: ["tooltip.tsx", "page-explorer.tsx"],
    render: radix(InfoCircledIcon),
  },
  {
    name: "Info",
    library: "lucide",
    importPath: "lucide-react",
    category: "Search & Info",
    usedFor: "Info / help icon in settings page",
    usedIn: ["settings-page.tsx"],
    render: lucide(Info),
  },
  {
    name: "CodeIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Search & Info",
    usedFor: "Code / arbitrary value toggle in scale input",
    usedIn: ["scale-input.tsx"],
    render: radix(CodeIcon),
  },

  // ── Miscellaneous ──────────────────────────────────────────────────────────
  {
    name: "SliderIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Miscellaneous",
    usedFor: "Slider / generic prop fallback icon in isolation view",
    usedIn: ["isolation-view.tsx", "computed-property-panel.tsx"],
    render: radix(SliderIcon),
  },
  {
    name: "SquareIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Miscellaneous",
    usedFor: "Shape / square fallback icon in isolation view",
    usedIn: ["isolation-view.tsx", "computed-property-panel.tsx"],
    render: radix(SquareIcon),
  },
  {
    name: "FileTextIcon",
    library: "radix",
    importPath: "@radix-ui/react-icons",
    category: "Miscellaneous",
    usedFor: "File / page icon in usage panel",
    usedIn: ["usage-panel.tsx"],
    render: radix(FileTextIcon),
  },
  {
    name: "ToggleLeft",
    library: "lucide",
    importPath: "lucide-react",
    category: "Miscellaneous",
    usedFor: "Toggle switch indicator in editor panel",
    usedIn: ["editor-panel.tsx"],
    render: lucide(ToggleLeft),
  },
  {
    name: "RotateCw",
    library: "lucide",
    importPath: "lucide-react",
    category: "Miscellaneous",
    usedFor: "Refresh / reset icon in settings page",
    usedIn: ["settings-page.tsx"],
    render: lucide(RotateCw),
  },
];

// Also track 3 custom inline SVG icons defined in computed-property-panel.tsx
const CUSTOM_ICONS: {
  name: string;
  category: string;
  usedFor: string;
  usedIn: string[];
  svgSource: string;
}[] = [
  {
    name: "StaticIcon",
    category: "Position",
    usedFor: "Position static indicator — shows default document flow (box with text lines)",
    usedIn: ["computed-property-panel.tsx"],
    svgSource: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="10" height="8" rx="1"/><line x1="4" y1="6" x2="10" y2="6"/><line x1="4" y1="8.5" x2="8" y2="8.5"/></svg>`,
  },
  {
    name: "RelativeIcon",
    category: "Position",
    usedFor: "Position relative indicator — shows offset from normal position (dashed original + solid moved)",
    usedIn: ["computed-property-panel.tsx"],
    svgSource: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1.5" y="3" width="8" height="8" rx="1" stroke-dasharray="2 2"/><rect x="4.5" y="1.5" width="8" height="8" rx="1"/></svg>`,
  },
  {
    name: "StickyIcon",
    category: "Position",
    usedFor: "Position sticky indicator — shows pinned header with scrollable body (solid top bar + dashed body)",
    usedIn: ["computed-property-panel.tsx"],
    svgSource: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="1.5" width="10" height="3" rx="0.75"/><rect x="2" y="6" width="10" height="6.5" rx="1" stroke-dasharray="2 2"/></svg>`,
  },
];

// ─── SVG Source Helper ───────────────────────────────────────────────────────

function getSvgSource(entry: IconEntry): string {
  const markup = renderToStaticMarkup(entry.render());
  // Pretty-print the SVG for readability
  return markup
    .replace(/></g, ">\n  <")
    .replace(/<\/svg>/, "\n</svg>")
    .replace(/^\s*</, "<");
}

// ─── Components ──────────────────────────────────────────────────────────────

function LibraryBadge({ library }: { library: "radix" | "lucide" | "custom" }) {
  const colors = {
    radix: "bg-violet-100 text-violet-800 border-violet-200",
    lucide: "bg-sky-100 text-sky-800 border-sky-200",
    custom: "bg-amber-100 text-amber-800 border-amber-200",
  };
  const labels = {
    radix: "@radix-ui/react-icons",
    lucide: "lucide-react",
    custom: "Custom SVG",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 text-[10px] font-mono rounded border ${colors[library]}`}>
      {labels[library]}
    </span>
  );
}

function SvgSourceBlock({ source }: { source: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-mono text-ink2 hover:text-ink underline cursor-pointer"
      >
        {open ? "Hide SVG source" : "Show SVG source"}
      </button>
      {open && (
        <pre className="mt-1 p-2 bg-zinc-100 border border-edge rounded text-[11px] font-mono text-ink2 overflow-x-auto whitespace-pre-wrap break-all">
          {source}
        </pre>
      )}
    </div>
  );
}

function IconCard({ entry }: { entry: IconEntry }) {
  const svgSource = getSvgSource(entry);
  return (
    <div className="flex gap-4 items-start py-3 px-4 border border-edge rounded-lg hover:border-edge-subtle hover:bg-raised/50 transition-colors">
      {/* Icon preview */}
      <div className="shrink-0 w-10 h-10 rounded-md bg-zinc-900 text-white flex items-center justify-center">
        {entry.render()}
      </div>
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold text-ink">{entry.name}</span>
          <LibraryBadge library={entry.library} />
        </div>
        <p className="text-xs text-ink2 mt-0.5">{entry.usedFor}</p>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-[10px] text-ink3 uppercase tracking-wide">Used in:</span>
          {entry.usedIn.map((f) => (
            <span key={f} className="text-[10px] font-mono text-ink2 bg-muted px-1 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>
        <SvgSourceBlock source={svgSource} />
      </div>
    </div>
  );
}

function CustomIconCard({ entry }: { entry: (typeof CUSTOM_ICONS)[number] }) {
  return (
    <div className="flex gap-4 items-start py-3 px-4 border border-edge rounded-lg hover:border-edge-subtle hover:bg-raised/50 transition-colors">
      {/* Icon preview */}
      <div
        className="shrink-0 w-10 h-10 rounded-md bg-zinc-900 text-white flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: entry.svgSource }}
      />
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold text-ink">{entry.name}</span>
          <LibraryBadge library="custom" />
        </div>
        <p className="text-xs text-ink2 mt-0.5">{entry.usedFor}</p>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-[10px] text-ink3 uppercase tracking-wide">Used in:</span>
          {entry.usedIn.map((f) => (
            <span key={f} className="text-[10px] font-mono text-ink2 bg-muted px-1 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <pre className="p-2 bg-zinc-100 border border-edge rounded text-[11px] font-mono text-ink2 overflow-x-auto whitespace-pre-wrap break-all">
            {entry.svgSource}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function IconReferencePage() {
  const [filter, setFilter] = useState("");
  const [expandAll, setExpandAll] = useState(false);

  // Group by category
  const categories = ICONS.reduce<Record<string, IconEntry[]>>((acc, entry) => {
    (acc[entry.category] ??= []).push(entry);
    return acc;
  }, {});

  const categoryOrder = Object.keys(categories);

  // Filter
  const lowerFilter = filter.toLowerCase();
  const filteredCategories = categoryOrder
    .map((cat) => ({
      name: cat,
      icons: categories[cat].filter(
        (e) =>
          !filter ||
          e.name.toLowerCase().includes(lowerFilter) ||
          e.usedFor.toLowerCase().includes(lowerFilter) ||
          e.usedIn.some((f) => f.toLowerCase().includes(lowerFilter)) ||
          e.category.toLowerCase().includes(lowerFilter),
      ),
    }))
    .filter((c) => c.icons.length > 0);

  const filteredCustom = CUSTOM_ICONS.filter(
    (e) =>
      !filter ||
      e.name.toLowerCase().includes(lowerFilter) ||
      e.usedFor.toLowerCase().includes(lowerFilter) ||
      e.category.toLowerCase().includes(lowerFilter),
  );

  const totalCount = ICONS.length + CUSTOM_ICONS.length;
  const radixCount = ICONS.filter((e) => e.library === "radix").length;
  const lucideCount = ICONS.filter((e) => e.library === "lucide").length;
  const customCount = CUSTOM_ICONS.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      {/* Header */}
      <h1 className="text-2xl font-bold text-ink">Icon Reference</h1>
      <p className="text-sm text-ink2 mt-1">
        Every icon used in the <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">@designtools/surface</code> editor controls.
      </p>

      {/* Summary */}
      <div className="mt-6 p-4 bg-raised border border-edge rounded-lg text-sm text-ink2">
        <p>
          <strong className="text-ink">{totalCount} icons</strong> from {" "}
          <strong className="text-ink">3 sources</strong>:
        </p>
        <ul className="mt-2 space-y-1 text-xs">
          <li>
            <LibraryBadge library="radix" /> — {radixCount} icons. 15&times;15 viewBox, fill-based.{" "}
            <a href="https://www.radix-ui.com/icons" className="underline text-sel" target="_blank" rel="noreferrer">
              radix-ui.com/icons
            </a>
          </li>
          <li>
            <LibraryBadge library="lucide" /> — {lucideCount} icons. 24&times;24 viewBox, stroke-based (strokeWidth 1.5 in our usage).{" "}
            <a href="https://lucide.dev/icons" className="underline text-sel" target="_blank" rel="noreferrer">
              lucide.dev/icons
            </a>
          </li>
          <li>
            <LibraryBadge library="custom" /> — {customCount} icons. Inline SVGs defined in{" "}
            <code className="text-[10px] bg-muted px-1 py-0.5 rounded font-mono">computed-property-panel.tsx</code>{" "}
            for position indicators.
          </li>
        </ul>
      </div>

      {/* LLM note */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <strong>For LLMs:</strong> Click &ldquo;Show SVG source&rdquo; on any icon to see its full SVG markup,
        or use the &ldquo;Expand all SVG sources&rdquo; button below to reveal all at once. Custom inline SVGs
        always show their source. All icons render at 15&times;15 (Radix) or 24&times;24 (Lucide) by default.
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter icons by name, usage, file, or category..."
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-edge rounded-lg bg-white placeholder:text-ink3 focus:outline-none focus:ring-2 focus:ring-sel/30 focus:border-sel"
        />
        <button
          onClick={() => setExpandAll(!expandAll)}
          className="px-3 py-2 text-xs font-medium border border-edge rounded-lg bg-white hover:bg-raised transition-colors"
        >
          {expandAll ? "Collapse all SVG sources" : "Expand all SVG sources"}
        </button>
      </div>

      {/* Icon listing */}
      <div className="mt-8 space-y-10">
        {filteredCategories.map(({ name, icons }) => (
          <section key={name}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink3 mb-3 border-b border-edge pb-1">
              {name}
              <span className="ml-2 text-ink3/60 font-normal normal-case tracking-normal">({icons.length})</span>
            </h2>
            <div className="space-y-2">
              {icons.map((entry) => (
                <IconCardWithExpand key={entry.name} entry={entry} forceExpand={expandAll} />
              ))}
            </div>
          </section>
        ))}

        {/* Custom inline SVGs */}
        {filteredCustom.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink3 mb-3 border-b border-edge pb-1">
              Custom Inline SVGs (Position)
              <span className="ml-2 text-ink3/60 font-normal normal-case tracking-normal">({filteredCustom.length})</span>
            </h2>
            <div className="space-y-2">
              {filteredCustom.map((entry) => (
                <CustomIconCard key={entry.name} entry={entry} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-edge text-xs text-ink3">
        <p>
          Source files:{" "}
          <code className="bg-muted px-1 py-0.5 rounded font-mono">packages/surface/src/client/components/</code>
        </p>
        <p className="mt-1">
          Icon libraries: @radix-ui/react-icons (15&times;15, fill) &bull; lucide-react (24&times;24, stroke)
        </p>
      </footer>
    </div>
  );
}

/** Wrapper that respects the global expand-all toggle */
function IconCardWithExpand({ entry, forceExpand }: { entry: IconEntry; forceExpand: boolean }) {
  const svgSource = getSvgSource(entry);
  return (
    <div className="flex gap-4 items-start py-3 px-4 border border-edge rounded-lg hover:border-edge-subtle hover:bg-raised/50 transition-colors">
      <div className="shrink-0 w-10 h-10 rounded-md bg-zinc-900 text-white flex items-center justify-center">
        {entry.render()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-semibold text-ink">{entry.name}</span>
          <LibraryBadge library={entry.library} />
        </div>
        <p className="text-xs text-ink2 mt-0.5">{entry.usedFor}</p>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          <span className="text-[10px] text-ink3 uppercase tracking-wide">Used in:</span>
          {entry.usedIn.map((f) => (
            <span key={f} className="text-[10px] font-mono text-ink2 bg-muted px-1 py-0.5 rounded">
              {f}
            </span>
          ))}
        </div>
        {forceExpand ? (
          <pre className="mt-2 p-2 bg-zinc-100 border border-edge rounded text-[11px] font-mono text-ink2 overflow-x-auto whitespace-pre-wrap break-all">
            {svgSource}
          </pre>
        ) : (
          <SvgSourceBlock source={svgSource} />
        )}
      </div>
    </div>
  );
}
