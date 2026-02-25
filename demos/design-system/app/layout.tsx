import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flett Design System",
  description: "Design system documentation and component library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
