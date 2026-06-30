import type { GitHubRepo } from "./types.js";

const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export async function fetchUser(
  token: string
): Promise<{ login: string; avatar_url: string; name: string | null }> {
  const res = await fetch("https://api.github.com/user", {
    headers: GH_HEADERS(token),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=pushed&visibility=all",
    { headers: GH_HEADERS(token) }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}
