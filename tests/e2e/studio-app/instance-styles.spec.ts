/**
 * instance-styles.spec.ts
 * Instance tab → Styles sub-tab → handleInstanceOverride → POST /api/write-element type:instanceOverride
 * Writes to: demos/studio-app/app/(marketing)/page.tsx (usage site)
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE_TSX = path.resolve(__dirname, "../../../demos/studio-app/app/(marketing)/page.tsx");

test("Instance tab Styles sub-tab shows the property panel", async ({ surfacePage }) => {
  await surfacePage.selectElement('[data-slot="badge"]');
  await surfacePage.switchSubTab("instance", "styles");
  await expect(surfacePage.page.locator(".studio-section-hdr").first()).toBeVisible();
});

test("adding a class override writes instanceOverride to the usage site file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(PAGE_TSX);

  await surfacePage.selectElement('[data-slot="badge"]');
  await surfacePage.switchSubTab("instance", "styles");

  // Add a margin-top override on this Badge instance
  await surfacePage.setScaleValue("margin-top", "mt-2");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(PAGE_TSX);
  expect(updated).toContain("mt-2");
});
