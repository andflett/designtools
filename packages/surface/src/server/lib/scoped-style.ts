/**
 * Framework-agnostic scoped style utilities for single-file components.
 * Extracts <style> blocks from .astro / .svelte files and provides
 * read/write operations using the existing CSS rule utilities.
 */

import { findCssRule, writeCssPropertyWithCleanup } from "./write-css-rule.js";
import type { SfcStyleBlock } from "./sfc-parse.js";

export interface ScopedStyleBlock {
  /** The raw CSS content inside the <style> tags */
  css: string;
  /** Byte offset of the CSS content start within the source file */
  startOffset: number;
  /** Byte offset of the CSS content end within the source file */
  endOffset: number;
  /** Whether this is a global style block (is:global in Astro, global in Svelte) */
  isGlobal: boolean;
}

/**
 * Extract <style> blocks from a single-file component source.
 * Works for .astro and .svelte files.
 */
export function extractScopedStyles(source: string): ScopedStyleBlock[] {
  const blocks: ScopedStyleBlock[] = [];
  const regex = /<style([^>]*)>([\s\S]*?)<\/style>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    const attrs = match[1];
    const css = match[2];

    // Detect global: Astro uses is:global, Svelte uses global attribute
    const isGlobal = /\bis:global\b/.test(attrs) || /\bglobal\b/.test(attrs);

    // Calculate offset of the CSS content (after the opening <style...> tag)
    const tagLength = match[0].indexOf(">") + 1;
    const startOffset = match.index + tagLength;
    const endOffset = startOffset + css.length;

    blocks.push({ css, startOffset, endOffset, isGlobal });
  }

  return blocks;
}

/**
 * Write a CSS property to a scoped <style> block within a source file.
 * Searches non-global style blocks for a matching CSS rule by selector,
 * then updates the property using the existing write-css-rule utilities.
 *
 * Returns the modified full source string, or null if the selector wasn't found.
 */
export function writeScopedStyleProperty(
  source: string,
  selector: string,
  property: string,
  value: string,
): string | null {
  const blocks = extractScopedStyles(source);

  for (const block of blocks) {
    // Skip global style blocks — those are handled by the project stylesheet path
    if (block.isGlobal) continue;

    // Check if this block contains a matching rule
    if (!findCssRule(block.css, selector)) continue;

    // Write the property using existing utilities
    const modified = writeCssPropertyWithCleanup(block.css, selector, property, value);
    if (!modified) continue;

    // Splice the modified CSS back into the full source
    return source.slice(0, block.startOffset) + modified + source.slice(block.endOffset);
  }

  return null;
}

/**
 * Write a CSS property to a scoped <style> block using pre-parsed style blocks
 * from the SFC AST parser. Avoids re-parsing the source with regex.
 *
 * Returns the modified full source string, or null if the selector wasn't found.
 */
export function writeScopedStylePropertyFromBlocks(
  source: string,
  blocks: SfcStyleBlock[],
  selector: string,
  property: string,
  value: string,
): string | null {
  for (const block of blocks) {
    if (block.isGlobal) continue;
    if (!findCssRule(block.css, selector)) continue;

    const modified = writeCssPropertyWithCleanup(block.css, selector, property, value);
    if (!modified) continue;

    return source.slice(0, block.startOffset) + modified + source.slice(block.endOffset);
  }

  return null;
}

/**
 * Add a new CSS rule to a scoped <style> block, or create a new <style> block
 * if none exists. Used for classless elements that receive a generated class.
 *
 * @param source - Full SFC source code
 * @param styleBlock - The first non-global style block (or null if none exists)
 * @param selector - CSS selector (e.g. ".surface-hero-h1-a3f2b")
 * @param property - CSS property name
 * @param value - CSS property value
 * @returns Modified source string
 */
export function addScopedStyleRule(
  source: string,
  styleBlock: SfcStyleBlock | null,
  selector: string,
  property: string,
  value: string,
): string {
  const ruleText = `\n${selector} {\n  ${property}: ${value};\n}`;

  if (styleBlock && !styleBlock.isGlobal) {
    // Append rule inside the existing <style> block
    return (
      source.slice(0, styleBlock.endOffset) +
      ruleText + "\n" +
      source.slice(styleBlock.endOffset)
    );
  }

  // No scoped <style> block — create one at the end of the file
  const styleTag = `\n<style>${ruleText}\n</style>\n`;
  return source.trimEnd() + styleTag;
}
