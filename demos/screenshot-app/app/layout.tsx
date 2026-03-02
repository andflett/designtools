import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workspace",
  description: "Team workspace dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="mx-auto flex h-12 max-w-5xl items-center gap-6 px-6">
            <a href="/" className="text-sm font-semibold tracking-tight text-foreground">
              Acme
            </a>
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Workspace
            </a>
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Deployments
            </a>
            <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Settings
            </a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
