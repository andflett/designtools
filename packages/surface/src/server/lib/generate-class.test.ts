import { describe, it, expect } from "vitest";
import { generateClassName } from "./generate-class.js";

describe("generateClassName", () => {
  it("generates surface-{parent}-{tag}-{hash} format", () => {
    const name = generateClassName("h1", ["hero"], "page.astro", 5, 2);
    expect(name).toMatch(/^surface-hero-h1-[a-f0-9]{5}$/);
  });

  it("uses 'root' when no parent classes", () => {
    const name = generateClassName("div", [], "page.astro", 1, 0);
    expect(name).toMatch(/^surface-root-div-[a-f0-9]{5}$/);
  });

  it("uses the first parent class only", () => {
    const name = generateClassName("p", ["card", "active"], "page.astro", 3, 4);
    expect(name).toMatch(/^surface-card-p-[a-f0-9]{5}$/);
  });

  it("produces consistent hashes for the same input", () => {
    const a = generateClassName("h1", ["hero"], "page.astro", 5, 2);
    const b = generateClassName("h1", ["hero"], "page.astro", 5, 2);
    expect(a).toBe(b);
  });

  it("produces different hashes for different positions", () => {
    const a = generateClassName("h1", ["hero"], "page.astro", 5, 2);
    const b = generateClassName("h1", ["hero"], "page.astro", 10, 2);
    expect(a).not.toBe(b);
  });
});
