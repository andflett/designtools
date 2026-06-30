import { Router } from "express";
import {
  publishToBranch,
  getCurrentBranch,
  DEFAULT_PREVIEW_BRANCH,
} from "../lib/git-publish.js";
import {
  readVercelProject,
  teamIdFromOrg,
  waitForPreviewDeployment,
} from "../lib/vercel-client.js";

/**
 * POST /api/publish-preview
 *
 * Commits the designer's edits, pushes them to a preview branch, and (when the
 * repo is linked to Vercel) resolves the resulting preview deployment URL.
 *
 * The git push and the Vercel lookup are decoupled: a successful push always
 * returns ok, even if the preview URL can't be resolved (no Vercel link or no
 * token) — in that case `preview` is null and `previewNote` explains why.
 */
export function createPublishPreviewRouter(projectRoot: string) {
  const router = Router();

  router.post("/", async (req, res) => {
    const {
      branch: branchOverride,
      message,
      token: bodyToken,
    } = (req.body ?? {}) as {
      branch?: string;
      message?: string;
      token?: string;
    };

    const branch = branchOverride || DEFAULT_PREVIEW_BRANCH;

    // 1. Commit + push. A failure here is fatal — surface it.
    let result;
    try {
      result = await publishToBranch(projectRoot, { branch, message });
    } catch (err: any) {
      console.error("publish-preview git error:", err);
      res.status(500).json({ error: err.message });
      return;
    }

    // 2. Resolve the Vercel preview URL (best-effort).
    let preview = null;
    let previewNote: string | undefined;
    const token = bodyToken || process.env.VERCEL_TOKEN;
    const link = readVercelProject(projectRoot);

    if (!link) {
      previewNote =
        "Repo isn't linked to Vercel (.vercel/project.json not found). Pushed to the preview branch — connect Vercel to get a preview URL.";
    } else if (!token) {
      previewNote =
        "No Vercel token. Set VERCEL_TOKEN to auto-resolve the preview URL. The branch was pushed.";
    } else {
      try {
        preview = await waitForPreviewDeployment({
          token,
          projectId: link.projectId,
          teamId: teamIdFromOrg(link.orgId),
          branch: result.branch,
          sha: result.sha,
        });
        if (!preview) {
          previewNote =
            "Pushed, but no preview deployment has appeared yet. It may still be building — check Vercel in a moment.";
        }
      } catch (err: any) {
        console.error("publish-preview vercel error:", err);
        previewNote = `Pushed, but the Vercel lookup failed: ${err.message}`;
      }
    }

    res.json({
      ok: true,
      branch: result.branch,
      sha: result.sha,
      committed: result.committed,
      sourceBranch: await getCurrentBranch(projectRoot).catch(() => null),
      preview,
      previewNote,
    });
  });

  return router;
}
