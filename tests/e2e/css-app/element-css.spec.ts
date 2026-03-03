/**
 * element-css.spec.ts
 * Element tab (plain CSS mode) → handleWriteStyle → POST /api/write-element type:cssProperty
 * Writes to: demos/css-app/src/styles.css (project stylesheet)
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STYLES_CSS = path.resolve(__dirname, "../../../demos/css-app/src/styles.css");

test("changing a CSS property on a plain-CSS element writes to the source stylesheet", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(STYLES_CSS);

  await surfacePage.selectElement(".card");
  await surfacePage.setScaleValue("border-radius", "20px");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(STYLES_CSS);
  expect(updated).toMatch(/\.card\s*\{[^}]*border-radius:\s*20px/s);
});
