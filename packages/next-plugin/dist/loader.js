"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/loader.ts
var loader_exports = {};
__export(loader_exports, {
  default: () => designtoolsLoader
});
module.exports = __toCommonJS(loader_exports);
var import_path = __toESM(require("path"));
function designtoolsLoader(source) {
  const callback = this.async();
  const opts = this.getOptions();
  const cwd = opts.cwd || this.rootContext || process.cwd();
  const relativePath = import_path.default.relative(cwd, this.resourcePath);
  if (relativePath.includes("node_modules")) {
    callback(null, source);
    return;
  }
  if (!source.includes("<")) {
    callback(null, source);
    return;
  }
  try {
    const babel = require("@babel/core");
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
