/**
 * element-css-modules.spec.ts
 * Element tab (CSS Modules mode) → handleWriteStyle → POST /api/write-element type:cssProperty
 * Writes to: demos/css-modules-app/src/App.module.css
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_MODULE_CSS = path.resolve(
  __dirname,
  "../../../demos/css-modules-app/src/App.module.css"
);

test("changing padding in a CSS Module element writes to .module.css", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(APP_MODULE_CSS);

  // .page element (rendered with CSS Module class)
  await surfacePage.frame.locator('[class*="page"]').first().click({ force: true });
  await surfacePage.page.waitForSelector('[data-testid="editor-element-name"]');

  await surfacePage.setScaleValue("padding", "48px");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(APP_MODULE_CSS);
  expect(updated).toMatch(/\.page\s*\{[^}]*padding:\s*48px/s);
});
