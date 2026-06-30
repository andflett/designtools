import fs from "fs";
import path from "path";
import os from "os";
import { spawn, type ChildProcess } from "child_process";

/**
 * Project launcher — the headless engine behind "open a codebase from git".
 *
 * Given a GitHub URL it clones the repo, detects the package manager, installs
 * dependencies, starts the dev server, and waits for it to become reachable.
 * It is intentionally free of any CLI/UI concerns so the same code can be
 * driven by the `surface open` command today and by the desktop app later.
 */

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export interface ParsedRepo {
  owner: string;
  name: string;
  /** Normalized https clone URL, e.g. https://github.com/owner/repo.git */
  url: string;
  /** Optional branch/ref parsed from a /tree/<ref> URL. */
  ref?: string;
}

export type LaunchPhase = "clone" | "install" | "start" | "ready";

export interface LaunchProgress {
  phase: LaunchPhase;
  message: string;
}

export interface LaunchOptions {
  /** Directory under which repos are cloned. Defaults to ~/DesignTools/projects. */
  projectsDir?: string;
  /** Branch/ref to check out (overrides any ref parsed from the URL). */
  ref?: string;
  /** Force a specific dev server port instead of auto-detecting from stdout. */
  port?: number;
  /** Skip the dependency install step (e.g. when node_modules already exists). */
  skipInstall?: boolean;
  /** Progress callback for CLI/UI feedback. */
  onProgress?: (event: LaunchProgress) => void;
  /** How long to wait for the dev server to print a URL / become reachable, ms. */
  readyTimeoutMs?: number;
}

export interface LaunchResult {
  /** Absolute path to the cloned repository. */
  projectRoot: string;
  /** Detected (or forced) dev server port. */
  port: number;
  /** Reachable dev server URL, e.g. http://localhost:5173. */
  url: string;
  /** Package manager used for install + dev. */
  packageManager: PackageManager;
  /** The running dev server process. The caller owns its lifecycle. */
  devProcess: ChildProcess;
  /** Convenience killer for the dev server process. */
  stop: () => void;
}

/** Default location where repos are cloned. */
export function defaultProjectsDir(): string {
  return path.join(os.homedir(), "DesignTools", "projects");
}

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * Parse a GitHub repository reference into its parts.
 *
 * Accepts:
 *   - https://github.com/owner/repo
 *   - https://github.com/owner/repo.git
 *   - https://github.com/owner/repo/tree/some/branch
 *   - git@github.com:owner/repo.git
 *   - github.com/owner/repo
 *   - owner/repo   (shorthand → github.com)
 *
 * Throws on anything that isn't a github.com repo, or whose owner/name
 * contain unexpected characters (defends the derived clone directory).
 */
export function parseRepoUrl(input: string): ParsedRepo {
  const raw = (input ?? "").trim();
  if (!raw) {
    throw new Error("A repository URL is required");
  }

  let owner: string | undefined;
  let name: string | undefined;
  let ref: string | undefined;

  // SSH form: git@github.com:owner/repo(.git)?
  const ssh = raw.match(/^git@github\.com:([^/]+)\/(.+?)(?:\.git)?$/);
  if (ssh) {
    owner = ssh[1];
    name = ssh[2];
  } else {
    // Strip protocol and a leading github.com/ if present.
    let rest = raw
      .replace(/^https?:\/\//, "")
      .replace(/^git\+https?:\/\//, "")
      .replace(/^www\./, "");

    if (rest.startsWith("github.com/")) {
      rest = rest.slice("github.com/".length);
    } else if (/^[^/]+\.[^/]+\//.test(rest)) {
      // Looks like a host we don't support (gitlab.com/..., bitbucket.org/...).
      throw new Error(
        `Only github.com repositories are supported right now (got: ${raw})`,
      );
    }

    const segments = rest.split("/").filter(Boolean);
    if (segments.length < 2) {
      throw new Error(`Could not parse a GitHub owner/repo from: ${raw}`);
    }
    owner = segments[0];
    name = segments[1].replace(/\.git$/, "");

    // owner/repo/tree/<branch...> — branch names may contain slashes.
    if (segments[2] === "tree" && segments.length > 3) {
      ref = segments.slice(3).join("/");
    }
  }

  if (!owner || !name || !SEGMENT.test(owner) || !SEGMENT.test(name)) {
    throw new Error(`Invalid GitHub repository reference: ${raw}`);
  }

  return {
    owner,
    name,
    url: `https://github.com/${owner}/${name}.git`,
    ...(ref ? { ref } : {}),
  };
}

/**
 * Detect the package manager for a project from its lockfile, falling back to
 * npm when no lockfile is present.
 */
export async function detectPackageManager(
  projectRoot: string,
): Promise<PackageManager> {
  const has = (file: string) => fs.existsSync(path.join(projectRoot, file));

  if (has("bun.lockb") || has("bun.lock")) return "bun";
  if (has("pnpm-lock.yaml")) return "pnpm";
  if (has("yarn.lock")) return "yarn";
  if (has("package-lock.json")) return "npm";

  // No lockfile — honour a packageManager field if present, else default npm.
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8"),
    );
    const declared: string | undefined = pkg.packageManager;
    if (typeof declared === "string") {
      if (declared.startsWith("pnpm")) return "pnpm";
      if (declared.startsWith("yarn")) return "yarn";
      if (declared.startsWith("bun")) return "bun";
    }
  } catch {
    // ignore — fall through to npm
  }

  return "npm";
}

/**
 * Pick the dev script to run, preferring "dev" then "start". Returns null when
 * the project has no recognizable dev script.
 */
export async function detectDevScript(
  projectRoot: string,
): Promise<string | null> {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8"),
    );
    const scripts = pkg.scripts ?? {};
    for (const candidate of ["dev", "start", "develop"]) {
      if (typeof scripts[candidate] === "string") return candidate;
    }
  } catch {
    // no/invalid package.json
  }
  return null;
}

/** Resolve a package-manager binary name, accounting for Windows .cmd shims. */
function pmBinary(pm: PackageManager): string {
  return process.platform === "win32" ? `${pm}.cmd` : pm;
}

/** True if the directory is a git working tree (has a .git entry). */
function isGitRepo(dir: string): boolean {
  return fs.existsSync(path.join(dir, ".git"));
}

/** True if dependencies appear to be installed already. */
function hasNodeModules(dir: string): boolean {
  return fs.existsSync(path.join(dir, "node_modules"));
}

/**
 * Run a command to completion, rejecting on a non-zero exit. Stdout/stderr are
 * not forwarded to the console — callers use onProgress for user-facing output.
 */
function run(
  command: string,
  args: string[],
  cwd?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr?.on("data", (d) => {
      stderr += d.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        const detail = stderr.trim().split("\n").slice(-5).join("\n");
        reject(
          new Error(
            `\`${command} ${args.join(" ")}\` exited with code ${code}` +
              (detail ? `:\n${detail}` : ""),
          ),
        );
      }
    });
  });
}

const LOCAL_URL_RE =
  /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::\]):(\d+)/i;

/** Extract the first localhost port a dev server prints, if any. */
export function parsePortFromOutput(output: string): number | null {
  const match = output.match(LOCAL_URL_RE);
  return match ? parseInt(match[1], 10) : null;
}

/** Poll an http URL until it responds or the timeout elapses. */
async function waitForServer(port: number, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  const url = `http://localhost:${port}`;
  while (Date.now() < deadline) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(1500) });
      return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/**
 * Clone (or reuse) a GitHub repo, install dependencies, start its dev server,
 * and resolve once the server is reachable.
 *
 * The returned devProcess keeps running — the caller is responsible for
 * stopping it (or calling result.stop()).
 */
export async function launchProject(
  input: string,
  opts: LaunchOptions = {},
): Promise<LaunchResult> {
  const emit = (phase: LaunchPhase, message: string) =>
    opts.onProgress?.({ phase, message });

  const repo = parseRepoUrl(input);
  const ref = opts.ref ?? repo.ref;
  const projectsDir = opts.projectsDir ?? defaultProjectsDir();
  const projectRoot = path.join(projectsDir, repo.name);
  const readyTimeoutMs = opts.readyTimeoutMs ?? 90_000;

  // 1. Clone, or reuse an existing clone.
  fs.mkdirSync(projectsDir, { recursive: true });
  if (isGitRepo(projectRoot)) {
    emit("clone", `Using existing clone at ${projectRoot}`);
  } else {
    emit("clone", `Cloning ${repo.owner}/${repo.name}…`);
    const cloneArgs = ["clone", "--depth", "1"];
    if (ref) cloneArgs.push("--branch", ref);
    cloneArgs.push(repo.url, projectRoot);
    await run("git", cloneArgs);
  }

  // 2. Detect package manager.
  const pm = await detectPackageManager(projectRoot);

  // 3. Install dependencies (unless already present or skipped).
  if (!opts.skipInstall && !hasNodeModules(projectRoot)) {
    emit("install", `Installing dependencies with ${pm}…`);
    await run(pmBinary(pm), ["install"], projectRoot);
  }

  // 4. Find the dev script.
  const script = await detectDevScript(projectRoot);
  if (!script) {
    throw new Error(
      `No "dev" or "start" script found in ${repo.name}'s package.json — ` +
        `can't start a dev server automatically.`,
    );
  }

  // 5. Start the dev server.
  emit("start", `Starting dev server (${pm} run ${script})…`);
  const devProcess = spawn(pmBinary(pm), ["run", script], {
    cwd: projectRoot,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...(opts.port ? { PORT: String(opts.port) } : {}) },
  });
  const stop = () => {
    try {
      devProcess.kill();
    } catch {
      // already gone
    }
  };

  // Watch stdout for the port the server actually bound to.
  let detectedPort: number | null = opts.port ?? null;
  const portFromOutput = new Promise<number>((resolve) => {
    const onData = (chunk: Buffer) => {
      const port = parsePortFromOutput(chunk.toString());
      if (port !== null) {
        devProcess.stdout?.off("data", onData);
        resolve(port);
      }
    };
    devProcess.stdout?.on("data", onData);
  });

  // Reject early if the dev server dies before it ever serves.
  const earlyExit = new Promise<never>((_, reject) => {
    devProcess.on("exit", (code) => {
      reject(
        new Error(`Dev server exited before becoming ready (code ${code}).`),
      );
    });
    devProcess.on("error", reject);
  });

  if (detectedPort === null) {
    const portDeadline = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), readyTimeoutMs),
    );
    detectedPort = await Promise.race([
      portFromOutput,
      portDeadline,
      earlyExit,
    ]);
  }

  if (detectedPort === null) {
    stop();
    throw new Error(
      `Dev server started but never printed a local URL within ` +
        `${Math.round(readyTimeoutMs / 1000)}s. Pass a port explicitly if it ` +
        `uses a non-standard startup banner.`,
    );
  }

  // 6. Wait until it actually answers requests.
  const reachable = await Promise.race([
    waitForServer(detectedPort, readyTimeoutMs),
    earlyExit,
  ]);
  if (!reachable) {
    stop();
    throw new Error(
      `Dev server on port ${detectedPort} did not become reachable in time.`,
    );
  }

  const url = `http://localhost:${detectedPort}`;
  emit("ready", `Dev server ready at ${url}`);

  return {
    projectRoot,
    port: detectedPort,
    url,
    packageManager: pm,
    devProcess,
    stop,
  };
}
