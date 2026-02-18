import "./globals.css";

export const metadata = {
  title: "Shadow Tokens — CSS Variables Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside className="sidebar">
          <div className="sidebar-brand">Shadow Studio</div>
          <ul className="sidebar-nav">
            <li>
              <a href="/" className="sidebar-link active">
                Tokens
              </a>
            </li>
            <li>
              <a href="/" className="sidebar-link">
                Presets
              </a>
            </li>
            <li>
              <a href="/" className="sidebar-link">
                Settings
              </a>
            </li>
          </ul>
        </aside>
        <div className="main">{children}</div>
      </body>
    </html>
  );
}
