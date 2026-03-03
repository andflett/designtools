import { describe, it, expect } from "vitest";
import { getEditability, type EditabilityTier } from "./editability.js";
import type { SelectedElementData } from "../../shared/protocol.js";

function makeElement(overrides: Partial<SelectedElementData> = {}): SelectedElementData {
  return {
    tag: "div",
    source: null,
    instanceSource: null,
    componentName: null,
    packageName: null,
    domPath: null,
    className: "",
    computed: {},
    parentComputed: {},
    boundingRect: { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 } as DOMRect,
    textContent: "",
    attributes: {},
    fiberProps: null,
    authored: {},
    activeBreakpoint: null,
    ...overrides,
  };
}

describe("getEditability", () => {
  it("returns inspect-only for null element", () => {
    expect(getEditability(null)).toBe("inspect-only");
  });

  it("returns full for element with local source", () => {
    const el = makeElement({
      source: { file: "src/components/card.tsx", line: 10, col: 5 },
    });
    expect(getEditability(el)).toBe("full");
  });

  it("returns instance-only for element with node_modules source but instanceSource", () => {
    const el = makeElement({
      source: { file: "node_modules/@radix-ui/react-dialog/dist/index.mjs", line: 1, col: 0 },
      instanceSource: { file: "src/app/page.tsx", line: 24, col: 8 },
      packageName: "@radix-ui/react-dialog",
    });
    expect(getEditability(el)).toBe("instance-only");
  });

  it("returns inspect-only for element with node_modules source and no instanceSource", () => {
    const el = makeElement({
      source: { file: "node_modules/@radix-ui/react-dialog/dist/index.mjs", line: 1, col: 0 },
      packageName: "@radix-ui/react-dialog",
    });
    expect(getEditability(el)).toBe("inspect-only");
  });

  it("returns instance-only for element with no source but instanceSource", () => {
    const el = makeElement({
      instanceSource: { file: "src/app/page.tsx", line: 24, col: 8 },
      packageName: "@radix-ui/react-dialog",
    });
    expect(getEditability(el)).toBe("instance-only");
  });

  it("returns inspect-only for element with neither source nor instanceSource", () => {
    const el = makeElement({
      packageName: "@radix-ui/react-dialog",
    });
    expect(getEditability(el)).toBe("inspect-only");
  });

  it("returns full for element with source not in node_modules", () => {
    const el = makeElement({
      source: { file: "packages/shared-ui/src/button.tsx", line: 5, col: 2 },
      instanceSource: { file: "src/app/page.tsx", line: 10, col: 4 },
    });
    expect(getEditability(el)).toBe("full");
  });
});
