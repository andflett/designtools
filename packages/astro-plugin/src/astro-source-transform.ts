/**
 * Vite plugin that annotates .astro template elements with data-source attributes.
 * Runs enforce: "pre" (before Astro's own compiler) so we can inject attributes
 * into the raw .astro source via string splicing at known offsets.
 *
 * Uses @astrojs/compiler's parse() + walk() to find element positions,
 * then splices attributes without reformatting (preserves exact user formatting).
 */

import type { Plugin } from "vite";
import { parse } from "@astrojs/compiler";
import { is } from "@astrojs/compiler/utils";
import path from "path";

/** Tags that should not receive data-source annotations. */
const SKIP_TAGS = new Set(["style", "script", "slot", "Fragment"]);

/** Recursively walk an AST node and its children. */
function walkTree(node: any, callback: (node: any) => void): void {
  callback(node);
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walkTree(child, callback);
    }
  }
}

function hasAttribute(node: any, name: string): boolean {
  return node.attributes?.some((a: any) => a.name === name) ?? false;
}

/**
 * Find the offset right after the tag name where we should insert the attribute.
 * The AST position.start.offset sometimes points to `<` and sometimes to the
 * tag name character (inconsistency in @astrojs/compiler). This handles both.
 */
function findInsertOffset(code: string, offset: number, name: string): number {
  if (code[offset] === "<") {
    // offset is at <, skip < + tagName
    return offset + 1 + name.length;
  }
  // offset is at the first char of the tag name
  return offset + name.length;
}

/**
 * Core transform: parses .astro source and injects data-source / data-instance-source
 * attributes via string splicing at AST-reported offsets.
 * Returns the modified source, or null if no changes were made.
 */
export async function transformAstroSource(
  code: string,
  relativePath: string
): Promise<string | null> {
  const result = await parse(code, { position: true });

  // Collect insertions: { offset, attr } sorted by offset descending
  // (insert from end to preserve earlier offsets)
  const insertions: { offset: number; attr: string }[] = [];

  walkTree(result.ast, (node: any) => {
    if (!node.position?.start) return;
    const { line, column, offset } = node.position.start;

    if (is.element(node)) {
      // Native HTML element -> data-source
      if (SKIP_TAGS.has(node.name)) return;
      if (hasAttribute(node, "data-source")) return;

      const value = `${relativePath}:${line}:${column}`;
      const insertOffset = findInsertOffset(code, offset, node.name);
      insertions.push({
        offset: insertOffset,
        attr: ` data-source="${value}"`,
      });
    } else if (is.component(node)) {
      // Astro/framework component -> data-instance-source
      if (SKIP_TAGS.has(node.name)) return;
      if (hasAttribute(node, "data-instance-source")) return;

      const value = `${relativePath}:${line}:${column}`;
      const insertOffset = findInsertOffset(code, offset, node.name);
      insertions.push({
        offset: insertOffset,
        attr: ` data-instance-source="${value}"`,
      });
    }
  });

  if (insertions.length === 0) return null;

  // Sort descending by offset so insertions don't shift subsequent offsets
  insertions.sort((a, b) => b.offset - a.offset);

  let modified = code;
  for (const { offset, attr } of insertions) {
    modified = modified.slice(0, offset) + attr + modified.slice(offset);
  }

  return modified;
}

export function createAstroSourcePlugin(): Plugin {
  let root: string;

  return {
    name: "designtools-astro-source",
    enforce: "pre",

    configResolved(config) {
      root = config.root;
    },

    async transform(code: string, id: string) {
      if (!id.endsWith(".astro")) return;
      if (id.includes("node_modules")) return;

      const relativePath = path.relative(root, id);
      const modified = await transformAstroSource(code, relativePath);

      if (modified === null) return;
      return { code: modified, map: null };
    },
  };
}
