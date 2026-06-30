import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import {
  parseRepoUrl,
  detectPackageManager,
  detectDevScript,
  parsePortFromOutput,
  defaultProjectsDir,
} from "./project-launcher.js";

describe("parseRepoUrl", () => {
  it("parses an https URL", () => {
    expect(parseRepoUrl("https://github.com/andflett/designtools")).toEqual({
      owner: "andflett",
      name: "designtools",
      url: "https://github.com/andflett/designtools.git",
    });
  });

  it("strips a trailing .git", () => {
    expect(parseRepoUrl("https://github.com/owner/repo.git").name).toBe("repo");
  });

  it("strips a trailing slash", () => {
    expect(parseRepoUrl("https://github.com/owner/repo/").name).toBe("repo");
  });

  it("parses a branch from a /tree/ URL", () => {
    const r = parseRepoUrl("https://github.com/owner/repo/tree/main");
    expect(r.ref).toBe("main");
  });

  it("keeps slashes in branch names", () => {
    const r = parseRepoUrl("https://github.com/owner/repo/tree/feature/foo");
    expect(r.ref).toBe("feature/foo");
  });

  it("parses the SSH form", () => {
    expect(parseRepoUrl("git@github.com:owner/repo.git")).toEqual({
      owner: "owner",
      name: "repo",
      url: "https://github.com/owner/repo.git",
    });
  });

  it("parses a host-less github.com URL", () => {
    expect(parseRepoUrl("github.com/owner/repo").owner).toBe("owner");
  });

  it("parses the owner/repo shorthand", () => {
    expect(parseRepoUrl("owner/repo")).toEqual({
      owner: "owner",
      name: "repo",
      url: "https://github.com/owner/repo.git",
    });
  });

  it("rejects non-github hosts", () => {
    expect(() => parseRepoUrl("https://gitlab.com/owner/repo")).toThrow(
      "Only github.com",
    );
  });

  it("rejects an empty input", () => {
    expect(() => parseRepoUrl("")).toThrow("required");
  });

  it("rejects a single segment", () => {
    expect(() => parseRepoUrl("https://github.com/owner")).toThrow();
  });

  it("rejects path-traversal in the repo name", () => {
    // ".." fails the segment charset guard, protecting the derived clone dir.
    expect(() => parseRepoUrl("git@github.com:owner/..")).toThrow();
  });
});

describe("parsePortFromOutput", () => {
  it("reads a localhost port", () => {
    expect(parsePortFromOutput("  ➜  Local: http://localhost:5173/")).toBe(5173);
  });

  it("reads a 127.0.0.1 port", () => {
    expect(parsePortFromOutput("listening on http://127.0.0.1:3000")).toBe(3000);
  });

  it("reads a 0.0.0.0 port", () => {
    expect(parsePortFromOutput("ready - http://0.0.0.0:4321/")).toBe(4321);
  });

  it("returns null when no URL is present", () => {
    expect(parsePortFromOutput("compiling...")).toBeNull();
  });
});

describe("filesystem detection", () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "launcher-test-"));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const writePkg = (pkg: object) =>
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg));

  describe("detectPackageManager", () => {
    it("detects pnpm from its lockfile", async () => {
      fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "");
      expect(await detectPackageManager(dir)).toBe("pnpm");
    });

    it("detects yarn from its lockfile", async () => {
      fs.writeFileSync(path.join(dir, "yarn.lock"), "");
      expect(await detectPackageManager(dir)).toBe("yarn");
    });

    it("detects bun from bun.lockb", async () => {
      fs.writeFileSync(path.join(dir, "bun.lockb"), "");
      expect(await detectPackageManager(dir)).toBe("bun");
    });

    it("detects npm from package-lock.json", async () => {
      fs.writeFileSync(path.join(dir, "package-lock.json"), "{}");
      expect(await detectPackageManager(dir)).toBe("npm");
    });

    it("prefers bun over pnpm when both lockfiles exist", async () => {
      fs.writeFileSync(path.join(dir, "bun.lockb"), "");
      fs.writeFileSync(path.join(dir, "pnpm-lock.yaml"), "");
      expect(await detectPackageManager(dir)).toBe("bun");
    });

    it("honours a packageManager field when no lockfile exists", async () => {
      writePkg({ packageManager: "pnpm@9.0.0" });
      expect(await detectPackageManager(dir)).toBe("pnpm");
    });

    it("defaults to npm with no lockfile or field", async () => {
      writePkg({ name: "x" });
      expect(await detectPackageManager(dir)).toBe("npm");
    });
  });

  describe("detectDevScript", () => {
    it("prefers dev", async () => {
      writePkg({ scripts: { dev: "vite", start: "node server" } });
      expect(await detectDevScript(dir)).toBe("dev");
    });

    it("falls back to start", async () => {
      writePkg({ scripts: { start: "node server" } });
      expect(await detectDevScript(dir)).toBe("start");
    });

    it("returns null when no dev script exists", async () => {
      writePkg({ scripts: { build: "tsc" } });
      expect(await detectDevScript(dir)).toBeNull();
    });

    it("returns null with no package.json", async () => {
      expect(await detectDevScript(dir)).toBeNull();
    });
  });
});

describe("defaultProjectsDir", () => {
  it("lives under the home directory", () => {
    expect(defaultProjectsDir().startsWith(os.homedir())).toBe(true);
  });
});
