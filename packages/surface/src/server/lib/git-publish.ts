import { spawn } from "child_process";

/**
 * Git helpers for the "publish to preview" flow. Stages the designer's edits,
 * commits them, and pushes to a preview branch — the deployment platform
 * (Vercel) then builds a preview for that branch.
 */

export const DEFAULT_PREVIEW_BRANCH = "designtools-preview";
export const DEFAULT_COMMIT_MESSAGE = "Design edits via designtools";

export interface GitPublishOptions {
  /** Branch to push to. Defaults to "designtools-preview". */
  branch?: string;
  /** Commit message. Defaults to "Design edits via designtools". */
  message?: string;
}

export interface GitPublishResult {
  branch: string;
  /** False when the working tree was already clean (nothing to commit). */
  committed: boolean;
  /** HEAD sha after the (possible) commit. */
  sha: string;
  pushed: boolean;
}

/** Run a git command, resolving trimmed stdout and rejecting with stderr. */
function git(args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(
          new Error(
            `git ${args.join(" ")} failed (code ${code}): ${stderr.trim() || stdout.trim()}`,
          ),
        );
      }
    });
  });
}

/** Current branch name (or "HEAD" when detached). */
export async function getCurrentBranch(projectRoot: string): Promise<string> {
  return git(["rev-parse", "--abbrev-ref", "HEAD"], projectRoot);
}

/** Raw URL of the `origin` remote, or null when there is none. */
export async function getRemoteUrl(projectRoot: string): Promise<string | null> {
  try {
    return await git(["remote", "get-url", "origin"], projectRoot);
  } catch {
    return null;
  }
}

/** True when the working tree has uncommitted changes. */
export async function hasChanges(projectRoot: string): Promise<boolean> {
  const status = await git(["status", "--porcelain"], projectRoot);
  return status.length > 0;
}

/**
 * Parse a github.com remote URL into { owner, repo }. Handles https and SSH
 * forms; returns null for anything else.
 */
export function parseGithubRemote(
  url: string,
): { owner: string; repo: string } | null {
  const cleaned = url.trim().replace(/\.git$/, "");
  // SSH: git@github.com:owner/repo
  const ssh = cleaned.match(/^git@github\.com:([^/]+)\/(.+)$/);
  if (ssh) return { owner: ssh[1], repo: ssh[2] };
  // https: https://github.com/owner/repo
  const https = cleaned.match(/^https?:\/\/github\.com\/([^/]+)\/(.+)$/);
  if (https) return { owner: https[1], repo: https[2] };
  return null;
}

/**
 * Stage all changes, commit (if anything changed), and push the current HEAD to
 * a preview branch. Re-publishing advances the preview branch to the new HEAD.
 */
export async function publishToBranch(
  projectRoot: string,
  opts: GitPublishOptions = {},
): Promise<GitPublishResult> {
  const branch = opts.branch || DEFAULT_PREVIEW_BRANCH;
  const message = opts.message || DEFAULT_COMMIT_MESSAGE;

  // Stage everything the designer touched.
  await git(["add", "-A"], projectRoot);

  // Commit only when there's something staged.
  let committed = false;
  const staged = await git(["diff", "--cached", "--name-only"], projectRoot);
  if (staged.length > 0) {
    await git(["commit", "-m", message], projectRoot);
    committed = true;
  }

  const sha = await git(["rev-parse", "HEAD"], projectRoot);

  // Push current HEAD to the preview branch, creating/advancing it.
  await git(["push", "origin", `HEAD:${branch}`], projectRoot);

  return { branch, committed, sha, pushed: true };
}
