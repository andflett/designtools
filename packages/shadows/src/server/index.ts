import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createToolServer } from "@designtools/core/server";
import { createShadowsRouter } from "./api/write-shadows.js";
import { createShadowsScanRouter } from "./scanner/index.js";
import type { PreflightResult } from "@designtools/core/cli";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const packageRoot = fs.existsSync(path.join(__dirname, "../package.json"))
  ? path.resolve(__dirname, "..")
  : path.resolve(__dirname, "../..");

export async function startShadowsServer(preflight: PreflightResult) {
  const clientRoot = path.join(packageRoot, "src/client");
  const injectScriptPath = path.join(packageRoot, "../core/src/inject/selection.ts");

  const compiledInject = path.join(packageRoot, "dist/inject/selection.js");
  const actualInjectPath = fs.existsSync(compiledInject) ? compiledInject : injectScriptPath;

  const { app, wss, projectRoot } = await createToolServer({
    targetPort: preflight.targetPort,
    toolPort: preflight.toolPort,
    clientRoot,
    injectScriptPath: actualInjectPath,
  });

  // Shadow-specific API routes
  app.use("/api/shadows", createShadowsRouter(projectRoot));

  // Shadow-specific scanner routes
  app.use("/scan", createShadowsScanRouter(projectRoot));

  return { app, wss, projectRoot };
}
