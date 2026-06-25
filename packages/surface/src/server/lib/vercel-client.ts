import fs from "fs";
import path from "path";

/**
 * Thin wrapper over the Vercel REST API for resolving the preview deployment
 * that a pushed branch produces. Intentionally minimal — we read the linked
 * project from `.vercel/project.json` and poll the deployments endpoint.
 */

export interface VercelProjectLink {
  projectId: string;
  orgId: string;
}

export interface PreviewDeployment {
  /** Full https URL to the preview. */
  url: string;
  /** READY | BUILDING | QUEUED | ERROR | CANCELED | UNKNOWN. */
  state: string;
  /** Vercel dashboard URL for the deployment, when provided. */
  inspectorUrl?: string;
}

export interface GetPreviewOptions {
  token: string;
  projectId: string;
  /** Team id for team-owned projects (orgId starting with "team_"). */
  teamId?: string;
  /** Branch the deployment was built from. */
  branch: string;
  /** Commit sha to prefer when multiple deployments match the branch. */
  sha?: string;
}

/**
 * Read the linked Vercel project from `.vercel/project.json`. Returns null when
 * the repo isn't linked (in which case we can't auto-resolve the preview URL).
 */
export function readVercelProject(projectRoot: string): VercelProjectLink | null {
  try {
    const raw = fs.readFileSync(
      path.join(projectRoot, ".vercel", "project.json"),
      "utf-8",
    );
    const json = JSON.parse(raw);
    if (json.projectId) {
      return { projectId: json.projectId, orgId: json.orgId };
    }
  } catch {
    // not linked
  }
  return null;
}

/** Derive the teamId query param from an orgId (only team_ ids are teams). */
export function teamIdFromOrg(orgId: string | undefined): string | undefined {
  return orgId && orgId.startsWith("team_") ? orgId : undefined;
}

/**
 * Fetch the most relevant preview deployment for a branch. Prefers a deployment
 * matching `sha` when given, else the most recent. Returns null when none exist
 * yet (Vercel may not have received the git webhook).
 */
export async function getPreviewDeployment(
  opts: GetPreviewOptions,
): Promise<PreviewDeployment | null> {
  const params = new URLSearchParams({
    projectId: opts.projectId,
    target: "preview",
    limit: "10",
    "meta-githubCommitRef": opts.branch,
  });
  if (opts.teamId) params.set("teamId", opts.teamId);

  const res = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
    headers: { Authorization: `Bearer ${opts.token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Vercel API responded ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as { deployments?: VercelDeployment[] };
  const deployments = data.deployments ?? [];
  if (deployments.length === 0) return null;

  let chosen = deployments[0];
  if (opts.sha) {
    const match = deployments.find((d) => d.meta?.githubCommitSha === opts.sha);
    if (match) chosen = match;
  }

  return toPreview(chosen);
}

/**
 * Poll for the preview deployment until one appears (it can lag the push by a
 * few seconds). Returns null if none shows up within the attempt budget.
 */
export async function waitForPreviewDeployment(
  opts: GetPreviewOptions,
  poll: { attempts?: number; intervalMs?: number } = {},
): Promise<PreviewDeployment | null> {
  const attempts = poll.attempts ?? 8;
  const intervalMs = poll.intervalMs ?? 2000;
  for (let i = 0; i < attempts; i++) {
    const deployment = await getPreviewDeployment(opts);
    if (deployment) return deployment;
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return null;
}

interface VercelDeployment {
  url: string;
  state?: string;
  readyState?: string;
  inspectorUrl?: string;
  meta?: { githubCommitSha?: string; githubCommitRef?: string };
}

function toPreview(d: VercelDeployment): PreviewDeployment {
  return {
    url: d.url.startsWith("http") ? d.url : `https://${d.url}`,
    state: d.readyState || d.state || "UNKNOWN",
    inspectorUrl: d.inspectorUrl,
  };
}
