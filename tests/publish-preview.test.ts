/**
 * Integration tests for the publish-preview API router.
 *
 * Sets up a throwaway git repo with a *local* bare remote (so push works with
 * no network), mounts the router with supertest, and mocks the Vercel fetch.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import express from "express";
import request from "supertest";
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";

import { createPublishPreviewRouter } from "../packages/surface/src/server/api/publish-preview.js";

function git(args: string[], cwd: string) {
  execFileSync("git", args, { cwd, stdio: "pipe" });
}

let workDir: string;
let bareDir: string;

beforeEach(() => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "publish-test-"));
  workDir = path.join(tmp, "work");
  bareDir = path.join(tmp, "remote.git");
  fs.mkdirSync(workDir, { recursive: true });

  // Bare remote to push into.
  git(["init", "--bare", "--initial-branch=main", bareDir], os.tmpdir());

  // Working repo with one commit and an origin pointing at the bare remote.
  git(["init", "--initial-branch=main", workDir], os.tmpdir());
  git(["config", "user.email", "test@example.com"], workDir);
  git(["config", "user.name", "Test"], workDir);
  fs.writeFileSync(path.join(workDir, "package.json"), '{"name":"x"}\n');
  git(["add", "-A"], workDir);
  git(["commit", "-m", "init"], workDir);
  git(["remote", "add", "origin", bareDir], workDir);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  fs.rmSync(path.dirname(workDir), { recursive: true, force: true });
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/publish-preview", createPublishPreviewRouter(workDir));
  return app;
}

/** A fake Vercel deployments response. */
function stubVercelFetch(deployment: object | null) {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ deployments: deployment ? [deployment] : [] }),
    text: async () => "",
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("POST /api/publish-preview", () => {
  it("commits and pushes the edit to the preview branch", async () => {
    fs.writeFileSync(path.join(workDir, "edited.txt"), "designer change\n");
    stubVercelFetch(null);

    const res = await request(createApp()).post("/api/publish-preview").send({});

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.committed).toBe(true);
    expect(res.body.branch).toBe("designtools-preview");

    // The bare remote should now have the preview branch at the pushed sha.
    const remoteSha = execFileSync(
      "git",
      ["rev-parse", "designtools-preview"],
      { cwd: bareDir },
    )
      .toString()
      .trim();
    expect(remoteSha).toBe(res.body.sha);
  });

  it("reports committed=false when there is nothing to commit", async () => {
    stubVercelFetch(null);
    const res = await request(createApp()).post("/api/publish-preview").send({});
    expect(res.status).toBe(200);
    expect(res.body.committed).toBe(false);
    // Still pushes the current HEAD to the preview branch.
    expect(res.body.branch).toBe("designtools-preview");
  });

  it("notes when the repo isn't linked to Vercel", async () => {
    fs.writeFileSync(path.join(workDir, "edited.txt"), "x\n");
    stubVercelFetch(null);

    const res = await request(createApp()).post("/api/publish-preview").send({});

    expect(res.body.preview).toBeNull();
    expect(res.body.previewNote).toMatch(/isn't linked to Vercel/);
  });

  it("resolves the preview URL when linked and a token is supplied", async () => {
    fs.writeFileSync(path.join(workDir, "edited.txt"), "x\n");
    fs.mkdirSync(path.join(workDir, ".vercel"), { recursive: true });
    fs.writeFileSync(
      path.join(workDir, ".vercel", "project.json"),
      JSON.stringify({ projectId: "prj_123", orgId: "team_abc" }),
    );

    const fetchMock = stubVercelFetch({
      url: "myapp-git-designtools-preview-team.vercel.app",
      readyState: "READY",
      inspectorUrl: "https://vercel.com/team/myapp/abc",
      meta: { githubCommitRef: "designtools-preview" },
    });

    const res = await request(createApp())
      .post("/api/publish-preview")
      .send({ token: "tok_secret" });

    expect(res.body.preview).not.toBeNull();
    expect(res.body.preview.url).toBe(
      "https://myapp-git-designtools-preview-team.vercel.app",
    );
    expect(res.body.preview.state).toBe("READY");

    // The Vercel call carried the token, project id, team id, and branch.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("projectId=prj_123");
    expect(url).toContain("teamId=team_abc");
    expect(url).toContain("meta-githubCommitRef=designtools-preview");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer tok_secret",
    );
  });
});
