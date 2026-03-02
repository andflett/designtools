/**
 * Resolved Tailwind theme types.
 * Extracted from project config (v3) or @theme CSS blocks (v4).
 */

export interface ScaleEntry {
  key: string;    // "4", "bold", "xl", "sm"
  value: string;  // "1rem", "700", "1.25rem"
}

export interface ResolvedTailwindTheme {
  spacing: ScaleEntry[];
  fontSize: ScaleEntry[];
  fontWeight: ScaleEntry[];
  lineHeight: ScaleEntry[];
  letterSpacing: ScaleEntry[];
  borderRadius: ScaleEntry[];
  borderWidth: ScaleEntry[];
  opacity: ScaleEntry[];
}
