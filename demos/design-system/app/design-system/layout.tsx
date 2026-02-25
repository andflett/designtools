"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Palette,
  Type,
  Space,
  Layers,
  Component,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tokenPages = [
  { name: "Colors", href: "/design-system/tokens/colors", icon: Palette },
  { name: "Typography", href: "/design-system/tokens/typography", icon: Type },
  { name: "Spacing", href: "/design-system/tokens/spacing", icon: Space },
  { name: "Shadows", href: "/design-system/tokens/shadows", icon: Layers },
];

const componentPages = [
  "accordion",
  "alert",
  "alert-dialog",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "card",
  "checkbox",
  "dialog",
  "dropdown-menu",
  "input",
  "label",
  "notice",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "select",
  "separator",
  "skeleton",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toast",
  "tooltip",
];

function NavSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div data-slot="nav-section">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-canvas-foreground"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            !open && "-rotate-90"
          )}
        />
      </button>
      {open && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}

function NavItem({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-primary-subdued text-primary-subdued-foreground font-medium"
          : "text-muted-foreground hover:bg-neutral-subdued hover:text-canvas-foreground"
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </Link>
  );
}

function formatComponentName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-slot="design-system-layout" className="flex min-h-screen">
      <aside
        data-slot="sidebar"
        className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border bg-surface p-4"
      >
        <Link
          href="/design-system"
          className="flex items-center gap-2 px-3 py-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
            F
          </div>
          <span className="text-sm font-semibold">Flett</span>
        </Link>

        <nav className="flex flex-col gap-2">
          <NavSection title="Tokens">
            {tokenPages.map((page) => (
              <NavItem key={page.href} href={page.href} icon={page.icon}>
                {page.name}
              </NavItem>
            ))}
          </NavSection>

          <NavSection title="Components">
            {componentPages.map((name) => (
              <NavItem
                key={name}
                href={`/design-system/components/${name}`}
                icon={Component}
              >
                {formatComponentName(name)}
              </NavItem>
            ))}
          </NavSection>
        </nav>
      </aside>

      <main
        data-slot="main-content"
        className="flex-1 overflow-y-auto px-12 py-10"
      >
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
