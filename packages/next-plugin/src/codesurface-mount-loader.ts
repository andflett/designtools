/**
 * Webpack loader that auto-mounts <CodeSurface /> in the root layout.
 * Only runs in development. Injects the import and component into the JSX.
 *
 * Strategy: Simple string injection — find the {children} pattern in the layout
 * and add <CodeSurface /> alongside it.
 */

interface LoaderContext {
  resourcePath: string;
  callback(err: Error | null, content?: string): void;
  async(): (err: Error | null, content?: string) => void;
}

export default function codesurfaceMountLoader(this: LoaderContext, source: string): void {
  const callback = this.async();

  // Only inject into root layout (not nested layouts)
  // Root layout is detected by the presence of <html> tag
  if (!source.includes("<html")) {
    callback(null, source);
    return;
  }

  // Skip if already has CodeSurface import
  if (source.includes("CodeSurface")) {
    callback(null, source);
    return;
  }

  // Add import at the top (after "use client" or first import)
  // CodeSurface is a "use client" component — importing it from an RSC is fine in Next.js
  const importStatement = `import { CodeSurface } from "@designtools/next-plugin/codesurface";\n`;
  let modified = source;

  // Find a good insertion point for the import
  const firstImportIndex = source.indexOf("import ");
  if (firstImportIndex !== -1) {
    modified = source.slice(0, firstImportIndex) + importStatement + source.slice(firstImportIndex);
  } else {
    modified = importStatement + source;
  }

  // Add <CodeSurface /> just before {children}
  modified = modified.replace(
    /(\{children\})/,
    `<CodeSurface />\n          $1`
  );

  callback(null, modified);
}
