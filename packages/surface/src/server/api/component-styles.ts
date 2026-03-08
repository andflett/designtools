/**
 * GET /api/component-styles?file=<path>&line=<n>&col=<n>
 *
 * Reads the component definition file and extracts authored styles on the
 * element at source coordinates: className (static base classes) and inline
 * style object entries.
 */

import { Router } from "express";
import fs from "fs/promises";
import { statSync } from "fs";
import { namedTypes as n } from "ast-types";
import recast from "recast";
import { safePath } from "../lib/safe-path.js";
import { getParser, parseSource, findAttr } from "../lib/ast-helpers.js";
import { findElementAtSource } from "../lib/find-element.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ComponentAuthoredStyles = {
  properties: Record<
    string,
    {
      value: string;
      source: "class" | "css-module" | "scoped-style" | "inline-style";
      tailwindClass?: string;
    }
  >;
  rawClassName?: string;
};

// ---------------------------------------------------------------------------
// In-memory cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  mtime: number;
  result: ComponentAuthoredStyles;
}

const cache = new Map<string, CacheEntry>();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert a camelCase CSS property name to kebab-case.
 * e.g. "backgroundColor" → "background-color"
 */
function camelToKebab(camel: string): string {
  return camel.replace(/([A-Z])/g, (_, c: string) => `-${c.toLowerCase()}`);
}

/**
 * Truncate a string to maxLen, appending "…" if needed.
 */
function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1) + "…";
}

/**
 * Extract the static string classes from a className attribute value.
 *
 * Handles:
 *   className="foo bar"                  → "foo bar"
 *   className={cn("foo", "bar", ...)}    → "foo bar" (static literal args only)
 *   className={clsx("foo", "bar", ...)}  → "foo bar"
 *   className={"foo bar"}               → "foo bar"
 *   anything else                        → ""
 */
function extractStaticClassNames(attrValue: any): string {
  if (!attrValue) return "";

  // className="string literal"
  if (n.StringLiteral.check(attrValue) || n.Literal.check(attrValue)) {
    return typeof attrValue.value === "string" ? attrValue.value : "";
  }

  // className={...}
  if (n.JSXExpressionContainer.check(attrValue)) {
    const expr = attrValue.expression;

    // className={"string"}
    if (n.StringLiteral.check(expr) || n.Literal.check(expr)) {
      return typeof expr.value === "string" ? expr.value : "";
    }

    // className={cn("base", cond && "opt")} / clsx(...)
    if (n.CallExpression.check(expr)) {
      const parts: string[] = [];
      for (const arg of expr.arguments) {
        if (n.StringLiteral.check(arg) || n.Literal.check(arg)) {
          if (typeof arg.value === "string" && arg.value.trim()) {
            parts.push(arg.value.trim());
          }
        }
      }
      return parts.join(" ");
    }
  }

  return "";
}

/**
 * Extract inline style entries from a style JSX attribute.
 *
 * Only reads `style={{ camelCase: "string" | number }}` — ignores dynamic values.
 * Returns Record<cssProperty, value>.
 */
function extractInlineStyles(styleAttr: any): Record<string, string> {
  const result: Record<string, string> = {};
  if (!styleAttr || !styleAttr.value) return result;

  // style={{...}}
  if (!n.JSXExpressionContainer.check(styleAttr.value)) return result;
  const expr = styleAttr.value.expression;
  if (!n.ObjectExpression.check(expr)) return result;

  for (const prop of expr.properties) {
    if (!n.ObjectProperty.check(prop) && !n.Property.check(prop)) continue;

    // Key: Identifier or StringLiteral
    let keyName: string | null = null;
    if (n.Identifier.check(prop.key)) {
      keyName = prop.key.name;
    } else if (n.StringLiteral.check(prop.key) || n.Literal.check(prop.key)) {
      keyName = typeof prop.key.value === "string" ? prop.key.value : null;
    }
    if (!keyName) continue;

    const cssProperty = camelToKebab(keyName);

    // Value: only static literals
    const val = (prop as any).value;
    if (n.StringLiteral.check(val) || n.Literal.check(val)) {
      if (typeof val.value === "string" || typeof val.value === "number") {
        result[cssProperty] = String(val.value);
      }
    } else if (n.NumericLiteral.check(val)) {
      result[cssProperty] = String(val.value);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Stub for non-JSX files
// ---------------------------------------------------------------------------

const STUB_RESULT: ComponentAuthoredStyles = {
  properties: {},
  rawClassName: "",
};

// ---------------------------------------------------------------------------
// Route factory
// ---------------------------------------------------------------------------

export function createComponentStylesRouter(projectRoot: string): Router {
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

    const openingElement = elementPath.node;

    // --- className ---
    const classNameAttr = findAttr(openingElement, "className");
    const rawClassName = extractStaticClassNames(classNameAttr?.value ?? null);

    // --- inline style ---
    const styleAttr = findAttr(openingElement, "style");
    const inlineStyles = extractInlineStyles(styleAttr);

    // --- Build properties map ---
    const properties: ComponentAuthoredStyles["properties"] = {};

    // Inline style entries (source = "inline-style")
    for (const [cssProp, value] of Object.entries(inlineStyles)) {
      properties[cssProp] = { value, source: "inline-style" };
    }

    // Tailwind class entries (source = "class")
    // Split by whitespace, skip empty tokens
    if (rawClassName) {
      for (const cls of rawClassName.split(/\s+/).filter(Boolean)) {
        // Use the class itself as the value placeholder — client resolves via tailwind-map
        properties[cls] = { value: cls, source: "class", tailwindClass: cls };
      }
    }

    const result: ComponentAuthoredStyles = {
      properties,
      rawClassName: rawClassName || undefined,
    };

    cache.set(cacheKey, { mtime, result });
    res.json(result);
  });

  return router;
}
