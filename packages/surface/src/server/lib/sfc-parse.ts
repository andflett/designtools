/**
 * Unified AST parser for .astro and .svelte single-file components.
 * Extracts elements with positions, classes, parent references, and style blocks.
 * Used by write-element.ts to replace fragile regex-based SFC parsing.
 */

import { parse as astroParse } from "@astrojs/compiler";
import { is } from "@astrojs/compiler/utils";

export interface SfcElement {
  tagName: string;
  classes: string[];
  /** 1-based line number */
  line: number;
  /** 0-based column (matches data-source convention) */
  col: number;
  /** Byte offset of the start of the opening tag in source */
  startOffset: number;
  /** Byte offset right after the tag name (insertion point for new attributes) */
  attrInsertOffset: number;
  /** Full opening tag end offset (position of ">") */
  openTagEndOffset: number;
  /** Parent element, if any */
  parent: SfcElement | null;
}

export interface SfcStyleBlock {
  /** The raw CSS content inside the <style> tags */
  css: string;
  /** Byte offset of CSS content start within the source file */
  startOffset: number;
  /** Byte offset of CSS content end within the source file */
  endOffset: number;
  /** Whether this is a global style block */
  isGlobal: boolean;
}

export interface SfcParseResult {
  /** Flat list of all elements with positions */
  elements: SfcElement[];
  /** Style blocks extracted from the file */
  styleBlocks: SfcStyleBlock[];
}

/** Tags that should not be parsed as editable elements. */
const SKIP_TAGS = new Set(["style", "script", "slot", "Fragment"]);

/**
 * Convert a character offset to 1-based line and 0-based column.
 */
function offsetToLineCol(
  source: string,
  offset: number,
): { line: number; col: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === "\n") {
      line++;
      lastNewline = i;
    }
  }
  return { line, col: offset - lastNewline - 1 };
}

/**
 * Find the offset right after the tag name (for attribute insertion).
 * Handles the @astrojs/compiler inconsistency where offset sometimes
 * points to `<` and sometimes to the tag name.
 */
function findInsertOffset(
  source: string,
  offset: number,
  tagName: string,
): number {
  if (source[offset] === "<") {
    return offset + 1 + tagName.length;
  }
  return offset + tagName.length;
}

/**
 * Find the end of the opening tag (the ">" character) starting from
 * the insert offset. Handles self-closing tags ("/>").
 */
function findOpenTagEnd(source: string, fromOffset: number): number {
  let i = fromOffset;
  let inString: string | null = null;
  while (i < source.length) {
    const ch = source[i];
    if (inString) {
      if (ch === inString) inString = null;
    } else {
      if (ch === '"' || ch === "'") {
        inString = ch;
      } else if (ch === ">") {
        return i;
      }
    }
    i++;
  }
  return i;
}

/**
 * Extract class names from an AST node's attributes.
 */
function extractClasses(node: any, format: "astro" | "svelte"): string[] {
  if (!node.attributes) return [];

  for (const attr of node.attributes) {
    if (format === "astro") {
      if (attr.name === "class" && attr.kind === "quoted" && typeof attr.value === "string") {
        return attr.value.split(/\s+/).filter(Boolean);
      }
    } else {
      // Svelte: Attribute type with Text child
      if (attr.type === "Attribute" && attr.name === "class") {
        if (Array.isArray(attr.value)) {
          for (const v of attr.value) {
            if (v.type === "Text" && typeof v.data === "string") {
              return v.data.split(/\s+/).filter(Boolean);
            }
          }
        } else if (attr.value === true) {
          return [];
        }
      }
    }
  }
  return [];
}

/**
 * Parse an .astro file into SfcParseResult.
 */
async function parseAstro(source: string): Promise<SfcParseResult> {
  const result = await astroParse(source, { position: true });
  const elements: SfcElement[] = [];
  const styleBlocks: SfcStyleBlock[] = [];

  function walkTree(
    node: any,
    parentElement: SfcElement | null,
  ): void {
    if (node.position?.start) {
      const { line, column, offset } = node.position.start;

      if (is.element(node) && !SKIP_TAGS.has(node.name)) {
        const insertOffset = findInsertOffset(source, offset, node.name);
        const openTagEnd = findOpenTagEnd(source, insertOffset);
        const classes = extractClasses(node, "astro");

        const el: SfcElement = {
          tagName: node.name,
          classes,
          line,
          col: column - 1, // astro compiler uses 1-based column, convert to 0-based
          startOffset: offset,
          attrInsertOffset: insertOffset,
          openTagEndOffset: openTagEnd,
          parent: parentElement,
        };
        elements.push(el);
        parentElement = el;
      } else if (node.name === "style") {
        // Extract style block
        const attrs = (node.attributes || []).map((a: any) => a.name).join(" ");
        const isGlobal = /\bis:global\b/.test(attrs);

        if (Array.isArray(node.children) && node.children.length > 0) {
          const firstChild = node.children[0];
          if (firstChild.position?.start && firstChild.position?.end) {
            const cssStart = firstChild.position.start.offset;
            const cssEnd = firstChild.position.end?.offset ?? (cssStart + (firstChild.value?.length || 0));
            const css = source.slice(cssStart, cssEnd);
            styleBlocks.push({ css, startOffset: cssStart, endOffset: cssEnd, isGlobal });
          }
        }
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        walkTree(child, parentElement);
      }
    }
  }

  walkTree(result.ast, null);
  return { elements, styleBlocks };
}

/** Svelte element types that represent regular HTML elements. */
const SVELTE_ELEMENT_TYPES = new Set(["RegularElement", "SvelteElement"]);

/** Svelte element types to skip. */
const SVELTE_SKIP_TYPES = new Set([
  "SlotElement", "SvelteHead", "SvelteWindow", "SvelteDocument",
  "SvelteBody", "SvelteBoundary", "SvelteFragment",
]);

/**
 * Parse a .svelte file into SfcParseResult.
 */
async function parseSvelte(source: string): Promise<SfcParseResult> {
  const { parse } = await import("svelte/compiler");
  const ast = parse(source, { modern: true }) as any;
  const elements: SfcElement[] = [];
  const styleBlocks: SfcStyleBlock[] = [];

  function walkNodes(
    nodes: any[],
    parentElement: SfcElement | null,
  ): void {
    for (const node of nodes) {
      let currentParent = parentElement;

      if (SVELTE_ELEMENT_TYPES.has(node.type) && !SVELTE_SKIP_TYPES.has(node.type)) {
        const { line, col } = offsetToLineCol(source, node.start);
        const insertOffset = findInsertOffset(source, node.start, node.name);
        const openTagEnd = findOpenTagEnd(source, insertOffset);
        const classes = extractClasses(node, "svelte");

        const el: SfcElement = {
          tagName: node.name,
          classes,
          line,
          col,
          startOffset: node.start,
          attrInsertOffset: insertOffset,
          openTagEndOffset: openTagEnd,
          parent: parentElement,
        };
        elements.push(el);
        currentParent = el;
      }

      // Recurse into children
      if (node.fragment?.nodes) walkNodes(node.fragment.nodes, currentParent);
      if (node.consequent?.nodes) walkNodes(node.consequent.nodes, currentParent);
      if (node.alternate?.nodes) walkNodes(node.alternate.nodes, currentParent);
      if (node.body?.nodes) walkNodes(node.body.nodes, currentParent);
      if (node.fallback?.nodes) walkNodes(node.fallback.nodes, currentParent);
      if (node.pending?.nodes) walkNodes(node.pending.nodes, currentParent);
      if (node.then?.nodes) walkNodes(node.then.nodes, currentParent);
      if (node.catch?.nodes) walkNodes(node.catch.nodes, currentParent);
    }
  }

  walkNodes(ast.fragment.nodes, null);

  // Extract style blocks from Svelte AST
  if (ast.css) {
    const styleNode = ast.css;
    const isGlobal = false; // Svelte's main <style> is scoped by default
    const contentStart = styleNode.content.start;
    const contentEnd = styleNode.content.end;
    const css = source.slice(contentStart, contentEnd);
    styleBlocks.push({ css, startOffset: contentStart, endOffset: contentEnd, isGlobal });
  }

  return { elements, styleBlocks };
}

/**
 * Parse an SFC file (.astro or .svelte) into a unified SfcParseResult.
 * Dispatches to the appropriate compiler based on file extension.
 */
export async function parseSfc(
  source: string,
  filename: string,
): Promise<SfcParseResult> {
  if (filename.endsWith(".astro")) {
    return parseAstro(source);
  }
  if (filename.endsWith(".svelte")) {
    return parseSvelte(source);
  }
  throw new Error(`Unsupported SFC file type: ${filename}`);
}

/**
 * Find the element at a given source line and column.
 * Returns the closest matching SfcElement, or null if not found.
 */
export function findSfcElement(
  elements: SfcElement[],
  line: number,
  col: number,
): SfcElement | null {
  // Exact match first
  for (const el of elements) {
    if (el.line === line && el.col === col) return el;
  }
  // Line match (col may differ slightly due to data-source annotation differences)
  for (const el of elements) {
    if (el.line === line) return el;
  }
  return null;
}
