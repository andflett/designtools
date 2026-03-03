/**
 * token-color.spec.ts
 * Token tab → color token edit → saveToken() → POST /api/tokens
 * Writes to: demos/design-system/app/globals.css
 */
import { test, expect } from "../shared/fixtures.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS = path.resolve(
  __dirname,
  "../../../demos/design-system/app/globals.css"
);

test("Token tab shows color token rows without an element selected", async ({ surfacePage }) => {
  // Token rows are rendered in the default (no-selection) state
  await expect(
    surfacePage.page.locator('[data-testid^="token-row-"]').first()
  ).toBeVisible({ timeout: 10_000 });
});

test("editing a color token writes the updated value to the CSS file", async ({
  surfacePage, sourceFile,
}) => {
  await sourceFile.track(GLOBALS_CSS);

  const tokenRow = surfacePage.page.locator('[data-testid="token-row-primary-500"]');
  await tokenRow.waitFor({ timeout: 10_000 });

  // Open the color picker via the swatch button
  await tokenRow.locator('button').first().click();

  // Find the hex input inside the color picker popover and update it
  const hexInput = surfacePage.page.locator('.studio-popover input[type="text"]').last();
  await hexInput.fill("#ff1234");
  await hexInput.press("Enter");

  await surfacePage.waitForSave();

  const updated = await sourceFile.read(GLOBALS_CSS);
  expect(updated).toContain("#ff1234");
});
