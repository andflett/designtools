/**
 * component-props.spec.ts
 * Component tab → Props sub-tab → handleComponentClassChange → POST /api/component
 * Writes to: demos/studio-app/components/ui/alert.tsx (component definition file)
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALERT_TSX = path.resolve(__dirname, "../../../demos/studio-app/components/ui/alert.tsx");

test("Component tab Props sub-tab is active by default", async ({ surfacePage }) => {
  await surfacePage.selectElement('[data-slot="alert"]');
  await surfacePage.switchTab("Component");
  await expect(surfacePage.page.locator('[data-testid="component-subtab-props"]')).toHaveClass(/active/);
});

test("Component tab Props sub-tab shows variant dimension sections", async ({ surfacePage }) => {
  await surfacePage.selectElement('[data-slot="alert"]');
  await surfacePage.switchTab("Component");
  await expect(surfacePage.page.locator('[data-testid="component-variant-section-variant"]')).toBeVisible();
  await expect(surfacePage.page.locator('[data-testid="component-variant-section-size"]')).toBeVisible();
});

test("editing a variant option class writes to the component definition file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(ALERT_TSX);

  await surfacePage.selectElement('[data-slot="alert"]');
  await surfacePage.switchTab("Component");
  await surfacePage.switchSubTab("component", "props");

  await surfacePage.expandComponentVariantSection("variant");
  await surfacePage.expandVariantOption("warning");

  // Change padding-top within the warning variant
  await surfacePage.setScaleValue("padding-top", "pt-3");
  await surfacePage.waitForSave();

  const updated = await sourceFile.read(ALERT_TSX);
  expect(updated).toContain("pt-3");
});
