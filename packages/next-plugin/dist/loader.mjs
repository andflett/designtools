import {
  __require
} from "./chunk-Y6FXYEAI.mjs";

// src/loader.ts
import path from "path";
function designtoolsLoader(source) {
  const callback = this.async();
  const opts = this.getOptions();
  const cwd = opts.cwd || this.rootContext || process.cwd();
  const relativePath = path.relative(cwd, this.resourcePath);
  if (relativePath.includes("node_modules")) {
    callback(null, source);
    return;
  }
  if (!source.includes("<")) {
    callback(null, source);
    return;
  }
  try {
    const babel = __require("@babel/core");
    const isTsx = this.resourcePath.endsWith(".tsx");
    const result = babel.transformSync(source, {
      filename: this.resourcePath,
      // No presets — we only want to parse and run our visitor, not compile
      presets: [],
      plugins: [
        function designtoolsSourcePlugin() {
          return {
            visitor: {
              JSXOpeningElement(nodePath) {
                const t = babel.types;
                const attrs = nodePath.node.attributes;
                if (attrs.some(
                  (a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name) && a.name.name === "data-source"
                )) return;
                const name = nodePath.node.name;
                if (t.isJSXIdentifier(name) && name.name === "Fragment") return;
                if (t.isJSXMemberExpression(name) && t.isJSXIdentifier(name.property) && name.property.name === "Fragment") return;
                const loc = nodePath.node.loc;
                if (!loc) return;
                const value = `${relativePath}:${loc.start.line}:${loc.start.column}`;
                attrs.push(
                  t.jsxAttribute(
                    t.jsxIdentifier("data-source"),
                    t.stringLiteral(value)
                  )
                );
              }
            }
          };
        }
      ],
      // Tell Babel's parser to handle JSX and TypeScript syntax
      parserOpts: {
        plugins: ["jsx", ...isTsx ? ["typescript"] : []]
      },
      // Preserve original formatting as much as possible
      retainLines: true,
      // Don't look for user's .babelrc or babel.config — isolation
      configFile: false,
      babelrc: false
    });
    callback(null, result?.code || source);
  } catch (err) {
    console.warn(`[designtools] Source annotation skipped for ${relativePath}: ${err.message}`);
    callback(null, source);
  }
}
export {
  designtoolsLoader as default
};
