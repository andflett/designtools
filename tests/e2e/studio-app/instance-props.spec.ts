/**
 * instance-props.spec.ts
 * Instance tab → Props sub-tab → handleInstancePropChange → POST /api/write-element type:prop
 * Writes to: demos/studio-app/app/(marketing)/page.tsx (usage site)
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAGE_TSX = path.resolve(__dirname, "../../../demos/studio-app/app/(marketing)/page.tsx");

test("Instance tab Props sub-tab shows variant dropdowns for CVA components", async ({
  surfacePage,
}) => {
  await surfacePage.selectElement('[data-slot="badge"]');
  await surfacePage.switchSubTab("instance", "props");
  await expect(surfacePage.page.locator('[data-testid="instance-prop-variant"]')).toBeVisible();
  await expect(surfacePage.page.locator('[data-testid="instance-prop-size"]')).toBeVisible();
});

test("changing a variant prop writes to the usage site file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(PAGE_TSX);

  await surfacePage.selectElement('[data-slot="badge"]');
  await surfacePage.switchSubTab("instance", "props");

  // Current variant is "secondary" — change to "destructive"
  await surfacePage.selectInstanceProp("variant", "destructive");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(PAGE_TSX);
  expect(updated).toContain('variant="destructive"');
  expect(updated).not.toContain('variant="secondary"');
});

test("changing a size prop writes to the usage site file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(PAGE_TSX);

  await surfacePage.selectElement('[data-slot="badge"]');
  await surfacePage.switchSubTab("instance", "props");

  // Current size is "sm" — change to "lg"
  await surfacePage.selectInstanceProp("size", "lg");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(PAGE_TSX);
  expect(updated).toContain('size="lg"');
});
