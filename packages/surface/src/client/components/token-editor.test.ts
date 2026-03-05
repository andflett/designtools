import { describe, it, expect } from "vitest";
import { suggestNextName } from "./token-editor.js";

describe("suggestNextName", () => {
  it("returns fallback-1 for empty list", () => {
    expect(suggestNextName([], "color")).toBe("color-1");
  });

  it("suggests next number in a numeric sequence", () => {
    expect(suggestNextName(["--space-1", "--space-2", "--space-3"], "space")).toBe("space-4");
  });

  it("suggests next number with gaps", () => {
    expect(suggestNextName(["--radius-1", "--radius-5"], "radius")).toBe("radius-6");
  });

  it("suggests prefix with trailing dash for t-shirt sizes", () => {
    expect(suggestNextName(["--radius-sm", "--radius-md", "--radius-lg"], "radius")).toBe("radius-");
  });

  it("suggests prefix with trailing dash for semantic names", () => {
    expect(suggestNextName(["--color-primary", "--color-secondary"], "color")).toBe("color-");
  });

  it("handles single token with number", () => {
    expect(suggestNextName(["--shadow-1"], "shadow")).toBe("shadow-2");
  });

  it("handles tokens without common prefix", () => {
    expect(suggestNextName(["--foo", "--bar"], "fallback")).toBe("fallback-");
  });

  it("strips -- prefix from names", () => {
    expect(suggestNextName(["--border-1", "--border-2"], "border")).toBe("border-3");
  });
});
