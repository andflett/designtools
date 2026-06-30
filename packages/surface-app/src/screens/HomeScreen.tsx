import { useState, useEffect } from "react";
import { commands } from "../lib/invoke.js";
import { fetchUser } from "../lib/github.js";
import type { RecentProject } from "../lib/types.js";

interface Props {
  token: string;
  onOpenRepo: () => void;
  onLaunch: (url: string) => void;
  onSignOut: () => void;
}

export function HomeScreen({ token, onOpenRepo, onLaunch, onSignOut }: Props) {
  const [recents, setRecents] = useState<RecentProject[]>([]);
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    commands.getRecentProjects().then(setRecents);
    fetchUser(token).then(setUser).catch(() => {});
  }, [token]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (url) onLaunch(url);
  };

  const handleRemove = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await commands.removeRecentProject(url);
    setRecents((prev) => prev.filter((r) => r.url !== url));
  };

  return (
    <div className="screen home-screen">
      <header className="home-header" data-tauri-drag-region>
        <div className="home-wordmark">
          <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="9" fill="var(--accent)" />
            <path d="M9 27V9h4.5l4.5 9 4.5-9H27v18h-4.5V18l-4.5 6.75L13.5 18v9H9z" fill="white" />
          </svg>
          <span>DesignTools</span>
        </div>
        <div className="home-user">
          {user && (
            <>
              <img className="home-avatar" src={user.avatar_url} alt={user.login} />
              <span className="home-username">{user.login}</span>
            </>
          )}
          <button className="home-signout" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main className="home-main">
        <section>
          <h2 className="home-section-title">Open a project</h2>
          <div className="home-open-actions">
            <button className="btn btn-primary" onClick={onOpenRepo}>
              Browse GitHub repos
            </button>
            <span className="home-or">or</span>
            <form onSubmit={handleUrlSubmit} className="home-url-form">
              <input
                className="home-url-input"
                placeholder="https://github.com/owner/repo"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                spellCheck={false}
              />
              <button type="submit" className="btn btn-secondary" disabled={!urlInput.trim()}>
                Open
              </button>
            </form>
          </div>
        </section>

        {recents.length > 0 && (
          <section>
            <h2 className="home-section-title">Recent</h2>
            <ul className="recent-list">
              {recents.map((p) => (
                <li key={p.url} className="recent-item" onClick={() => onLaunch(p.url)}>
                  <div className="recent-info">
                    <span className="recent-name">{p.owner}/{p.name}</span>
                    <span className="recent-date">
                      {new Date(p.lastOpened).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="recent-remove"
                    onClick={(e) => handleRemove(p.url, e)}
                    title="Remove from recents"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
