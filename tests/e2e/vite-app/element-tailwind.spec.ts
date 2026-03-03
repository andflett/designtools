/**
 * element-tailwind.spec.ts (vite-app)
 * Element tab (plain HTML element, Tailwind mode) → handleWriteElement replaceClass → POST /api/write-element
 * Writes to: demos/vite-app/src/App.tsx (element source via Vite plugin)
 *
 * Validates the Vite plugin write path is distinct from Next.js plugin.
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_TSX = path.resolve(__dirname, "../../../demos/vite-app/src/App.tsx");

test("replacing a Tailwind class in a Vite app writes to source file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(APP_TSX);

  // header > div has h-14 — change to h-16
  await surfacePage.frame.locator("header").click({ force: true });
  await surfacePage.page.waitForSelector('[data-testid="editor-element-name"]');

  await surfacePage.setScaleValue("height", "h-16");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(APP_TSX);
  expect(updated).toContain("h-16");
  expect(updated).not.toContain("h-14");
});
