import { describe, it, expect } from "vitest";
import { parseSfc, findSfcElement } from "./sfc-parse.js";

describe("parseSfc — .astro", () => {
  const astroSource = `---
const title = "Hello";
---
<section class="hero">
  <h1>{title}</h1>
  <p class="subtitle">Welcome</p>
</section>
<style>
  .hero {
    padding: 2rem;
  }
</style>`;

  it("extracts elements with tag names and classes", async () => {
    const result = await parseSfc(astroSource, "test.astro");
    expect(result.elements.length).toBeGreaterThanOrEqual(3);

    const section = result.elements.find(e => e.tagName === "section");
    expect(section).toBeDefined();
    expect(section!.classes).toEqual(["hero"]);

    const h1 = result.elements.find(e => e.tagName === "h1");
    expect(h1).toBeDefined();
    expect(h1!.classes).toEqual([]);

    const p = result.elements.find(e => e.tagName === "p");
    expect(p).toBeDefined();
    expect(p!.classes).toEqual(["subtitle"]);
  });

  it("sets parent references correctly", async () => {
    const result = await parseSfc(astroSource, "test.astro");
    const h1 = result.elements.find(e => e.tagName === "h1");
    expect(h1!.parent).not.toBeNull();
    expect(h1!.parent!.tagName).toBe("section");
    expect(h1!.parent!.classes).toEqual(["hero"]);
  });

  it("extracts style blocks", async () => {
    const result = await parseSfc(astroSource, "test.astro");
    expect(result.styleBlocks).toHaveLength(1);
    expect(result.styleBlocks[0].isGlobal).toBe(false);
    expect(result.styleBlocks[0].css).toContain(".hero");
  });

  it("detects global style blocks", async () => {
    const source = `<div>hi</div>
<style is:global>
  body { margin: 0; }
</style>`;
    const result = await parseSfc(source, "test.astro");
    expect(result.styleBlocks).toHaveLength(1);
    expect(result.styleBlocks[0].isGlobal).toBe(true);
  });

  it("sets correct line/col positions", async () => {
    const result = await parseSfc(astroSource, "test.astro");
    const section = result.elements.find(e => e.tagName === "section");
    expect(section!.line).toBe(4);
  });
});

describe("parseSfc — .svelte", () => {
  const svelteSource = `<script>
  let title = "Hello";
</script>

<div class="card">
  <h1 class="heading">{title}</h1>
  <p>Welcome</p>
</div>

<style>
  .card {
    padding: 1rem;
  }
</style>`;

  it("extracts elements with tag names and classes", async () => {
    const result = await parseSfc(svelteSource, "test.svelte");
    expect(result.elements.length).toBeGreaterThanOrEqual(3);

    const div = result.elements.find(e => e.tagName === "div");
    expect(div).toBeDefined();
    expect(div!.classes).toEqual(["card"]);

    const h1 = result.elements.find(e => e.tagName === "h1");
    expect(h1).toBeDefined();
    expect(h1!.classes).toEqual(["heading"]);

    const p = result.elements.find(e => e.tagName === "p");
    expect(p).toBeDefined();
    expect(p!.classes).toEqual([]);
  });

  it("sets parent references correctly", async () => {
    const result = await parseSfc(svelteSource, "test.svelte");
    const h1 = result.elements.find(e => e.tagName === "h1");
    expect(h1!.parent).not.toBeNull();
    expect(h1!.parent!.tagName).toBe("div");
    expect(h1!.parent!.classes).toEqual(["card"]);
  });

  it("extracts style blocks", async () => {
    const result = await parseSfc(svelteSource, "test.svelte");
    expect(result.styleBlocks).toHaveLength(1);
    expect(result.styleBlocks[0].isGlobal).toBe(false);
    expect(result.styleBlocks[0].css).toContain(".card");
  });
});

describe("findSfcElement", () => {
  it("finds element by exact line and col", async () => {
    const source = `<div class="a">
  <span class="b">hi</span>
</div>`;
    const result = await parseSfc(source, "test.astro");
    const span = findSfcElement(result.elements, 2, 2);
    expect(span).not.toBeNull();
    expect(span!.tagName).toBe("span");
  });

  it("falls back to line match", async () => {
    const source = `<div class="a">
  <span class="b">hi</span>
</div>`;
    const result = await parseSfc(source, "test.astro");
    // Use a slightly off column
    const span = findSfcElement(result.elements, 2, 99);
    expect(span).not.toBeNull();
    expect(span!.tagName).toBe("span");
  });

  it("returns null when not found", async () => {
    const source = `<div>hi</div>`;
    const result = await parseSfc(source, "test.astro");
    expect(findSfcElement(result.elements, 99, 0)).toBeNull();
  });
});
