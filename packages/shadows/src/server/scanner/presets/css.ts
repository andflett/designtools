/**
 * Utilities for parsing raw CSS box-shadow declarations.
 */

export interface CssShadowDeclaration {
  selector: string;
  property: string;
  value: string;
  filePath: string;
  line: number;
}

/**
 * Find all box-shadow declarations in a CSS string.
 */
export function findBoxShadowDeclarations(css: string, filePath: string): CssShadowDeclaration[] {
  const declarations: CssShadowDeclaration[] = [];
  const lines = css.split("\n");

  let currentSelector = "";
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track selector context
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;

    if (braceDepth === 0 && openBraces > 0) {
      const selectorMatch = line.match(/^([^{]+)\{/);
      if (selectorMatch) {
        currentSelector = selectorMatch[1].trim();
      }
    }

    braceDepth += openBraces - closeBraces;

    // Find box-shadow declarations
    const shadowMatch = line.match(/box-shadow\s*:\s*([^;]+)/);
    if (shadowMatch) {
      declarations.push({
        selector: currentSelector,
        property: "box-shadow",
        value: shadowMatch[1].trim(),
        filePath,
        line: i + 1,
      });
    }
  }

  return declarations;
}
