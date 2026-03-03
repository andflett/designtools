/**
 * selection.spec.ts — Smoke: iframe click → panel shows element + correct tab auto-selected.
 * No file writes. Validates the core postMessage protocol and tab auto-selection logic.
 */
import { test, expect } from "../shared/fixtures.js";

test("clicking a CVA component shows its name and activates the Instance tab", async ({ surfacePage }) => {
  await surfacePage.selectElement('[data-slot="alert"]');
  const name = await surfacePage.getElementName();
  expect(name.toLowerCase()).toContain("alert");
  await expect(surfacePage.page.locator('[data-testid="editor-tab-instance"]')).toHaveClass(/active/);
});

test("clicking a plain HTML element shows <tag> format", async ({ surfacePage }) => {
  await surfacePage.selectElement("main");
  const name = await surfacePage.getElementName();
  expect(name).toMatch(/^<\w+>$/);
});

test("clicking different elements updates the panel", async ({ surfacePage }) => {
  await surfacePage.selectElement("main");
  const first = await surfacePage.getElementName();
  await surfacePage.selectElement('[data-slot="alert"]');
  const second = await surfacePage.getElementName();
  expect(first).not.toBe(second);
});

test("Component tab is only shown for CVA components", async ({ surfacePage }) => {
  await surfacePage.selectElement("main");
  await expect(surfacePage.page.locator('[data-testid="editor-tab-component"]')).not.toBeVisible();

  await surfacePage.selectElement('[data-slot="alert"]');
  await expect(surfacePage.page.locator('[data-testid="editor-tab-component"]')).toBeVisible();
});
