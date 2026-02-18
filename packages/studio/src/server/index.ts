import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createToolServer } from "@designtools/core/server";
import { createTokensRouter } from "./api/write-tokens.js";
import { createComponentRouter } from "./api/write-component.js";
import { createElementRouter } from "./api/write-element.js";
import { createStudioScanRouter } from "./scanner/index.js";
import type { PreflightResult } from "@designtools/core/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Find package root
const packageRoot = fs.existsSync(path.join(__dirname, "../package.json"))
  ? path.resolve(__dirname, "..")
  : path.resolve(__dirname, "../..");

export async function startStudioServer(preflight: PreflightResult) {
  const clientRoot = path.join(packageRoot, "src/client");
  const injectScriptPath = path.join(packageRoot, "../core/src/inject/selection.ts");

  // For production, use compiled injection script
  const compiledInject = path.join(packageRoot, "dist/inject/selection.js");
  const actualInjectPath = fs.existsSync(compiledInject) ? compiledInject : injectScriptPath;

  const { app, wss, projectRoot } = await createToolServer({
    targetPort: preflight.targetPort,
    toolPort: preflight.toolPort,
    clientRoot,
    injectScriptPath: actualInjectPath,
  });

  // Studio-specific API routes
  app.use("/api/tokens", createTokensRouter(projectRoot));
  app.use("/api/component", createComponentRouter(projectRoot));
  app.use("/api/element", createElementRouter(projectRoot));

  // Studio-specific scanner routes
  app.use("/scan", createStudioScanRouter(projectRoot));

  return { app, wss, projectRoot };
}
