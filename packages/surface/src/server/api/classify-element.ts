/**
 * GET /api/classify-element?file=<path>&line=<n>&col=<n>
 *
 * Analyzes the JSX element at source coordinates and returns editability
 * classification: iterator context, prop editability, content type.
 */

import { Router } from "express";
import fs from "fs/promises";
import { statSync } from "fs";
import { visit } from "recast";
import { namedTypes as n } from "ast-types";
import recast from "recast";
import { safePath } from "../lib/safe-path.js";
import { getParser, parseSource } from "../lib/ast-helpers.js";
import { findElementAtSource } from "../lib/find-element.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ElementClassification = {
  instance: {
    isAuthored: boolean;
    dataSource?: {
      type: "map" | "flatMap" | "filter" | "each" | "for";
      expression: string;
    };
    props: Array<{
      name: string;
      isEditable: boolean;
      expressionSource?: string;
    }>;
    contentType: "static" | "dynamic" | "mixed" | "empty";
    contentExpression?: string;
  };
};

// ---------------------------------------------------------------------------
// In-memory cache: key = "file:line:col", value = { mtime, result }
// ---------------------------------------------------------------------------

interface CacheEntry {
  mtime: number;
  result: ElementClassification;
}

const cache = new Map<string, CacheEntry>();

// ---------------------------------------------------------------------------
// Prop names to skip during classification
// ---------------------------------------------------------------------------

const SKIP_PROPS = new Set(["data-source", "data-instance-source", "data-slot", "className", "style"]);

// ---------------------------------------------------------------------------
// Iterator method names we care about
// ---------------------------------------------------------------------------

const ITERATOR_METHODS = new Set(["map", "flatMap", "filter"]);

type IteratorType = "map" | "flatMap" | "filter" | "each" | "for";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Truncate a string to maxLen, appending "…" if needed. */
function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1) + "…";
}

/**
 * Walk ancestor paths upward from `startPath`, looking for a .map() / .flatMap() / .filter()
 * call where the JSX element lives inside the callback. Returns the iterator type and
 * the printed call expression (truncated to 60 chars), or null if not found.
 */
function detectIteratorAncestor(
  startPath: any
): { type: IteratorType; expression: string } | null {
  let current = startPath;

  while (current && current.parent) {
    current = current.parent;
    const node = current.node;

    // Check for CallExpression with a member expression callee: foo.map(...)
    if (
      n.CallExpression.check(node) &&
      n.MemberExpression.check(node.callee) &&
      n.Identifier.check(node.callee.property)
    ) {
      const methodName = node.callee.property.name;
      if (ITERATOR_METHODS.has(methodName)) {
        // Make sure our JSX is inside one of the arguments (callback)
        const printed = truncate(recast.print(node).code, 60);
        return { type: methodName as IteratorType, expression: printed };
      }
    }

    // Check for JSXExpressionContainer (e.g. {items.map(...)}): keep walking up
    // Check for ArrayExpression iterators — less common, skip for now
  }

  return null;
}

/**
 * Classify props on a JSXOpeningElement. Skips internal/framework attrs.
 */
function classifyProps(
  openingElement: any
): Array<{ name: string; isEditable: boolean; expressionSource?: string }> {
  const result: Array<{ name: string; isEditable: boolean; expressionSource?: string }> = [];

  for (const attr of openingElement.attributes || []) {
    // Skip spread attributes
    if (!n.JSXAttribute.check(attr)) continue;
    // Attribute name must be a simple identifier
    if (!n.JSXIdentifier.check(attr.name)) continue;

    const name: string = attr.name.name;
    if (SKIP_PROPS.has(name)) continue;

    // No value (boolean prop shorthand like `disabled`) → editable
    if (attr.value === null || attr.value === undefined) {
      result.push({ name, isEditable: true });
      continue;
    }

    // String literal → editable
    if (n.StringLiteral.check(attr.value) || n.Literal.check(attr.value)) {
      result.push({ name, isEditable: true });
      continue;
    }

    // JSXExpressionContainer
    if (n.JSXExpressionContainer.check(attr.value)) {
      const expr = attr.value.expression;

      // Literal inside container → editable
      if (
        n.NumericLiteral.check(expr) ||
        n.BooleanLiteral.check(expr) ||
        n.StringLiteral.check(expr) ||
        n.Literal.check(expr)
      ) {
        result.push({ name, isEditable: true });
        continue;
      }

      // Non-literal expression → not editable, capture snippet
      const snippet = truncate(recast.print(expr).code, 40);
      result.push({ name, isEditable: false, expressionSource: snippet });
      continue;
    }

    // Anything else (JSXElement value, etc.) → not editable
    const snippet = truncate(recast.print(attr.value).code, 40);
    result.push({ name, isEditable: false, expressionSource: snippet });
  }

  return result;
}

/**
 * Classify the content (children) of the JSX element.
 * The JSXOpeningElement path gives us access to parent JSXElement.
 */
function classifyContent(openingElementPath: any): {
  contentType: "static" | "dynamic" | "mixed" | "empty";
  contentExpression?: string;
} {
  // The parent of JSXOpeningElement is JSXElement
  const jsxElement = openingElementPath.parent?.node;
  if (!jsxElement || !n.JSXElement.check(jsxElement)) {
    return { contentType: "empty" };
  }

  const children: any[] = jsxElement.children || [];

  // Filter out pure whitespace JSXText nodes
  const meaningfulChildren = children.filter((child) => {
    if (n.JSXText.check(child)) {
      return child.value.trim().length > 0;
    }
    return true;
  });

  if (meaningfulChildren.length === 0) {
    return { contentType: "empty" };
  }

  let hasStatic = false;
  let hasDynamic = false;
  let firstDynamicSnippet: string | undefined;

  for (const child of meaningfulChildren) {
    if (n.JSXText.check(child)) {
      hasStatic = true;
    } else if (n.JSXExpressionContainer.check(child)) {
      const expr = child.expression;
      // Literal expressions count as static
      if (
        n.StringLiteral.check(expr) ||
        n.NumericLiteral.check(expr) ||
        n.BooleanLiteral.check(expr) ||
        n.Literal.check(expr)
      ) {
        hasStatic = true;
      } else {
        hasDynamic = true;
        if (!firstDynamicSnippet) {
          firstDynamicSnippet = truncate(recast.print(expr).code, 40);
        }
      }
    } else {
      // Nested JSXElement or other node — treat as static structure
      hasStatic = true;
    }
  }

  if (hasDynamic && hasStatic) {
    return { contentType: "mixed", contentExpression: firstDynamicSnippet };
  }
  if (hasDynamic) {
    return { contentType: "dynamic", contentExpression: firstDynamicSnippet };
  }
  return { contentType: "static" };
}

// ---------------------------------------------------------------------------
// Stub for non-JSX files
// ---------------------------------------------------------------------------

const STUB_RESULT: ElementClassification = {
  instance: {
    isAuthored: true,
    props: [],
    contentType: "empty",
  },
};

// ---------------------------------------------------------------------------
// Route factory
// ---------------------------------------------------------------------------

export function createClassifyElementRouter(projectRoot: string): Router {
  const router = Router();

  router.get("/", async (req, res) => {
    const fileParam = req.query.file as string | undefined;
    const lineParam = req.query.line as string | undefined;
    const colParam = req.query.col as string | undefined;

    if (!fileParam || !lineParam || !colParam) {
      res.status(400).json({ error: "Missing required query params: file, line, col" });
      return;
    }

    const line = parseInt(lineParam, 10);
    const col = parseInt(colParam, 10);
    if (isNaN(line) || isNaN(col)) {
      res.status(400).json({ error: "line and col must be integers" });
      return;
    }

    let absPath: string;
    try {
      absPath = safePath(projectRoot, fileParam);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
      return;
    }

    // Non-JSX/TSX stub
    if (!/\.[jt]sx$/.test(absPath)) {
      res.json(STUB_RESULT);
      return;
    }

    // Cache check
    const cacheKey = `${absPath}:${line}:${col}`;
    let mtime = 0;
    try {
      mtime = statSync(absPath).mtimeMs;
    } catch {
      // file may not exist — let fs.readFile surface the error below
    }

    const cached = cache.get(cacheKey);
    if (cached && cached.mtime === mtime) {
      res.json(cached.result);
      return;
    }

    // Read + parse
    let source: string;
    try {
      source = await fs.readFile(absPath, "utf-8");
    } catch (err: any) {
      res.status(404).json({ error: `Cannot read file: ${err.message}` });
      return;
    }

    let ast: any;
    try {
      const parser = await getParser();
      ast = parseSource(source, parser);
    } catch (err: any) {
      res.status(422).json({ error: `Parse error: ${err.message}` });
      return;
    }

    const elementPath = findElementAtSource(ast, line, col);
    if (!elementPath) {
      res.status(404).json({ error: `No JSX element found at ${fileParam}:${line}:${col}` });
      return;
    }

    // Iterator ancestor detection
    const iteratorInfo = detectIteratorAncestor(elementPath);

    // Prop classification
    const props = classifyProps(elementPath.node);

    // Content classification
    const { contentType, contentExpression } = classifyContent(elementPath);

    const result: ElementClassification = {
      instance: {
        isAuthored: iteratorInfo === null,
        ...(iteratorInfo ? { dataSource: iteratorInfo } : {}),
        props,
        contentType,
        ...(contentExpression ? { contentExpression } : {}),
      },
    };

    cache.set(cacheKey, { mtime, result });
    res.json(result);
  });

  return router;
}
