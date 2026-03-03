/**
 * element-tailwind.spec.ts
 * Element tab (plain HTML element, Tailwind mode) → handleWriteElement replaceClass → POST /api/write-element
 * Writes to: demos/studio-app/app/(marketing)/page.tsx (element source via Next.js plugin)
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE_TSX = path.resolve(__dirname, "../../../demos/studio-app/app/(marketing)/page.tsx");

test("Element tab is shown for plain HTML elements (no Component tab)", async ({ surfacePage }) => {
  await surfacePage.selectElement("main");
  const name = await surfacePage.getElementName();
  expect(name).toBe("<main>");
  await expect(surfacePage.page.locator('[data-testid="editor-tab-component"]')).not.toBeVisible();
});

test("replacing a Tailwind class on a plain element writes to source file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(PAGE_TSX);

  // main has px-4 — change to px-6
  await surfacePage.selectElement("main");
  await surfacePage.setScaleValue("padding-left", "px-6");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(PAGE_TSX);
  expect(updated).toContain("px-6");
  expect(updated).not.toContain("px-4");
});
