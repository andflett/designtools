/**
 * Generate unique class names for classless SFC elements.
 * Used when writing scoped styles to elements that don't have a class attribute.
 */

import { createHash } from "crypto";

/**
 * Generate a unique class name for a classless element.
 *
 * Pattern: `surface-{context}-{tag}-{hash}`
 * - context: first parent class name, or "root" if no parent has classes
 * - tag: the element's tag name
 * - hash: 5-char hex from content hash of `file:line:col`
 *
 * Example: `surface-hero-h1-a3f2b`, `surface-card-p-x8d2k`
 */
export function generateClassName(
  tagName: string,
  parentClasses: string[],
  file: string,
  line: number,
  col: number,
): string {
  const context = parentClasses.length > 0 ? parentClasses[0] : "root";
  const hash = createHash("md5")
    .update(`${file}:${line}:${col}`)
    .digest("hex")
    .slice(0, 5);
  return `surface-${context}-${tagName}-${hash}`;
}
