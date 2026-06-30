import { useState, useEffect } from "react";
import { fetchUserRepos } from "../lib/github.js";
import type { GitHubRepo } from "../lib/types.js";

interface Props {
  token: string;
  onSelect: (url: string) => void;
  onBack: () => void;
}

export function RepoPickerScreen({ token, onSelect, onBack }: Props) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRepos(token)
      .then(setRepos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = repos.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      (r.description ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="screen repopicker-screen">
      <header className="picker-header" data-tauri-drag-region>
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2 className="picker-title">Choose a repository</h2>
      </header>

      <div className="picker-search">
        <input
          className="picker-search-input"
          placeholder="Filter repositories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <div className="picker-list">
        {loading && (
          <div className="picker-status">
            <div className="spinner" />
            <span>Loading repositories…</span>
          </div>
        )}
        {error && <div className="picker-error">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="picker-empty">
            {query ? `No repositories match "${query}"` : "No repositories found"}
          </div>
        )}
        {filtered.map((repo) => (
          <button
            key={repo.full_name}
            className="picker-item"
            onClick={() => onSelect(repo.html_url)}
          >
            <span className="picker-item-name">
              {repo.private ? "🔒 " : ""}
              {repo.full_name}
            </span>
            {repo.description && (
              <span className="picker-item-desc">{repo.description}</span>
            )}
            {repo.language && (
              <span className="picker-item-lang">{repo.language}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
