import "../scss/main.scss";

export const metadata = {
  title: "Elevation — Bootstrap Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark px-3">
          <a className="navbar-brand fw-semibold" href="/">
            Elevation Studio
          </a>
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <a className="nav-link active" href="/">
                Shadows
              </a>
            </li>
          </ul>
        </nav>
        <main className="container-fluid py-4 px-4">{children}</main>
      </body>
    </html>
  );
}
