"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatCard } from "@/components/stat-card";
import { UserRow } from "@/components/user-row";

/* ─────────────────────────────────────────────────────────────
   Section label — marks expected classification in the editor
   ───────────────────────────────────────────────────────────── */

function SectionLabel({
  chips,
  note,
}: {
  chips: { label: string; color: string; bg: string; border: string }[];
  note: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-5">
      {chips.map((c) => (
        <span
          key={c.label}
          className="text-[11px] font-mono px-2 py-0.5 rounded"
          style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
        >
          {c.label}
        </span>
      ))}
      <span className="text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

const LOOP_LOCAL = [
  { label: "inLoop", color: "#a78bfa", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)" },
  { label: "local", color: "#a78bfa", bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.2)" },
];
const LOOP_EXTERNAL = [
  { label: "inLoop", color: "#a78bfa", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)" },
  { label: "external", color: "#fb923c", bg: "rgba(249,115,22,0.07)", border: "rgba(249,115,22,0.2)" },
];
const DYNAMIC = [
  { label: "dynamic", color: "#2dd4bf", bg: "rgba(20,184,166,0.08)", border: "rgba(20,184,166,0.2)" },
];
const LOOP_DYNAMIC = [
  { label: "inLoop", color: "#a78bfa", bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)" },
  { label: "dynamic", color: "#2dd4bf", bg: "rgba(20,184,166,0.08)", border: "rgba(20,184,166,0.2)" },
];
const STATIC = [
  { label: "static", color: "#6b7280", bg: "rgba(107,114,128,0.07)", border: "rgba(107,114,128,0.2)" },
];
const COMPONENT = [
  { label: "data-slot", color: "#fb923c", bg: "rgba(249,115,22,0.07)", border: "rgba(249,115,22,0.2)" },
];

/* ─────────────────────────────────────────────────────────────
   1. LOCAL loop data — init is a literal ArrayExpression
      → inLoop: true, dataOrigin: "local"
   ───────────────────────────────────────────────────────────── */

const localStats = [
  { label: "Revenue", value: "$48,290", change: "+8%", progress: 62 },
  { label: "Users", value: "12,400", change: "+5%", progress: 55 },
  { label: "Uptime", value: "99.9%", change: "+0.1%", progress: 91 },
  { label: "Errors", value: "0.04%", change: "-12%", progress: 8 },
];

const localFeatures = [
  { title: "AST-level writes", desc: "Changes go directly to your source files, never inline styles." },
  { title: "Framework-agnostic", desc: "Works with Next.js, Vite, Remix, Astro, and SvelteKit." },
  { title: "Design token support", desc: "Edit CSS custom properties and see the cascade update live." },
];

const localNavLinks = [
  { href: "#", label: "Dashboard" },
  { href: "#", label: "Analytics" },
  { href: "#", label: "Reports" },
  { href: "#", label: "Settings" },
];

/* ─────────────────────────────────────────────────────────────
   2. EXTERNAL loop data — init is a CallExpression or state
      → inLoop: true, dataOrigin: "external"
   ───────────────────────────────────────────────────────────── */

function getTeamMembers() {
  return [
    { name: "Alex Chen", email: "alex@example.com", role: "Engineering", status: "active" as const },
    { name: "Priya Mehta", email: "priya@example.com", role: "Design", status: "active" as const },
    { name: "Jordan Lee", email: "jordan@example.com", role: "Product", status: "pending" as const },
  ];
}

/* ─────────────────────────────────────────────────────────────
   3. DYNAMIC CONTENT — non-literal JSX expression, not in loop
      → inLoop: false, hasDynamicContent: true
   ───────────────────────────────────────────────────────────── */

const currentUser = "Alex Chen";
const currentRole = "Senior Engineer";
const sessionStart = new Date().toLocaleTimeString();
const unreadCount = 3;
const completionRate = 74;

/* ─────────────────────────────────────────────────────────────
   4. LOOPED + DYNAMIC — loop over external data with dynamic text
      → inLoop: true, hasDynamicContent: true
   ───────────────────────────────────────────────────────────── */

function getActivity() {
  return [
    { actor: "Alex Chen", action: "merged", target: "PR #142", time: "5m ago" },
    { actor: "Priya Mehta", action: "commented on", target: "Issue #89", time: "32m ago" },
    { actor: "Jordan Lee", action: "opened", target: "PR #143", time: "1h ago" },
    { actor: "Alex Chen", action: "closed", target: "Issue #77", time: "2h ago" },
  ];
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */

export default function ClassificationTestPage() {
  const teamMembers = getTeamMembers();
  const activity = getActivity();

  const [filter, setFilter] = useState<"all" | "active">("all");
  const filteredTeam = filter === "active"
    ? teamMembers.filter((m) => m.status === "active")
    : teamMembers;

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 space-y-16">
      <header>
        <h1 className="text-2xl font-bold mb-1">Classification test page</h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Every section exercises a different element classification state. Select
          elements in Surface to verify the expected border colour, badge chips,
          and editor panel warning.
        </p>
      </header>

      {/* ── 1. STATIC elements ─────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">1. Static elements</h2>
        <SectionLabel chips={STATIC} note="inLoop: false · hasDynamicContent: false · plain blue border" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border bg-card p-5">
            <p className="text-sm font-medium mb-1">Plain card</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Static text. No expressions. No loops. Should show a standard
              blue selection border.
            </p>
          </div>
          <div className="rounded-lg border bg-muted p-5">
            <p className="text-sm font-semibold mb-2">Feature callout</p>
            <p className="text-xs text-muted-foreground">
              Another static block with no runtime values.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border p-5">
            <span className="text-xs font-mono text-muted-foreground">Status</span>
            <span className="text-lg font-bold">Operational</span>
            <span className="text-xs text-green-600 font-medium">All systems normal</span>
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 2. LOOPED / LOCAL ──────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">2. Looped — local data</h2>
        <SectionLabel
          chips={LOOP_LOCAL}
          note="inLoop: true · dataOrigin: local · purple dashed border"
        />

        {/* StatCard grid — uses StatCard component (data-slot) AND is looped */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            stats.map() over literal array — StatCard has data-slot (component + loop)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {localStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        {/* Feature cards — plain divs in a loop */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            localFeatures.map() over literal array — plain div elements
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {localFeatures.map((f) => (
              <div key={f.title} className="rounded-lg border p-4">
                <p className="text-sm font-semibold mb-1">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav links — inline elements in a loop */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            localNavLinks.map() — anchor elements
          </p>
          <nav className="flex gap-1">
            {localNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <Separator />

      {/* ── 3. LOOPED / EXTERNAL ───────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">3. Looped — external data</h2>
        <SectionLabel
          chips={LOOP_EXTERNAL}
          note="inLoop: true · dataOrigin: external · purple dashed border"
        />

        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            getTeamMembers().map() — function call init, not a literal array
          </p>
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
            >
              Active only
            </Button>
          </div>
          <Card>
            <CardContent className="pt-4">
              <ul className="list-none divide-y p-0">
                {filteredTeam.map((member) => (
                  <UserRow key={member.email} {...member} />
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            useState array — state init is a CallExpression
          </p>
          <ExternalStateLoop />
        </div>
      </section>

      <Separator />

      {/* ── 4. DYNAMIC CONTENT (no loop) ───────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">4. Dynamic content — no loop</h2>
        <SectionLabel
          chips={DYNAMIC}
          note="inLoop: false · hasDynamicContent: true · teal border"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User greeting */}
          <div className="rounded-lg border p-5">
            <p className="text-xs text-muted-foreground mb-2">User profile block</p>
            <h3 className="text-lg font-bold">{currentUser}</h3>
            <p className="text-sm text-muted-foreground">{currentRole}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Session started at {sessionStart}
            </p>
          </div>

          {/* Stat with runtime values */}
          <div className="rounded-lg border p-5 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Notifications</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{unreadCount}</span>
              <span className="text-sm text-muted-foreground">unread</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={completionRate} className="flex-1" />
              <span className="text-xs text-muted-foreground">{completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Alert with dynamic content */}
        <div className="mt-4">
          <Alert>
            <AlertTitle>Welcome back, {currentUser}</AlertTitle>
            <AlertDescription>
              You have {unreadCount} unread notifications since your last session.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* ── 5. LOOPED + DYNAMIC ────────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">5. Looped + dynamic content</h2>
        <SectionLabel
          chips={LOOP_DYNAMIC}
          note="inLoop: true · hasDynamicContent: true · purple dashed border (loop wins)"
        />
        <div>
          <p className="text-xs text-muted-foreground mb-3 font-mono">
            getActivity().map() — external data + {"{item.actor}"} dynamic children
          </p>
          <div className="rounded-lg border divide-y overflow-hidden">
            {activity.map((item) => (
              <div key={item.actor + item.time} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-[10px]">
                    {item.actor.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm flex-1">
                  <span className="font-medium">{item.actor}</span>
                  {" "}{item.action}{" "}
                  <span className="font-medium">{item.target}</span>
                </p>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── 6. CVA COMPONENTS (data-slot) ─────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">6. CVA components with data-slot</h2>
        <SectionLabel
          chips={COMPONENT}
          note="Component + Instance tabs in editor — edits scope to definition or usage site"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default" elevation="sm">
            <CardHeader>
              <CardTitle>Default card</CardTitle>
              <CardDescription>variant=default · elevation=sm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click CardTitle, CardDescription, or Card itself. Each has its own
                data-slot. The editor should show Component and Instance tabs.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Cancel</Button>
            </CardFooter>
          </Card>

          <Card variant="filled" elevation="none">
            <CardHeader>
              <CardTitle>Filled card</CardTitle>
              <CardDescription>variant=filled · elevation=none</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>default</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="outline">outline</Badge>
                <Badge variant="destructive">destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Standalone Button variants */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <Separator />

      {/* ── 7. LOOPED COMPONENTS (data-slot + inLoop) ─────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">7. Looped CVA components</h2>
        <SectionLabel
          chips={[...LOOP_LOCAL, ...COMPONENT]}
          note="inLoop + data-slot — component is both repeated and selectable"
        />
        <p className="text-xs text-muted-foreground mb-3 font-mono">
          localStats.map() → StatCard (data-slot component inside a loop)
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {localStats.slice(0, 3).map((stat) => (
            <Card key={stat.label} variant="outline">
              <CardHeader className="pb-2">
                <CardDescription>{stat.label}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={stat.change.startsWith("+") ? "default" : "destructive"}>
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── 8. SPREAD PROPS in loop ────────────────────────────── */}
      <section>
        <h2 className="text-base font-semibold mb-1">8. Spread props in loop</h2>
        <SectionLabel
          chips={LOOP_EXTERNAL}
          note="inLoop: true · spread {...item} — prop classification gap (all props external)"
        />
        <p className="text-xs text-muted-foreground mb-3 font-mono">
          {"teamMembers.map(m => <UserRow {...m} />) — spread attributes skipped by classifyProps()"}
        </p>
        <Card>
          <CardContent className="pt-4">
            <ul className="list-none divide-y p-0">
              {teamMembers.map((member) => (
                <UserRow key={member.email} {...member} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   ExternalStateLoop — separate component so useState is legal
   in a "use client" page. Array in state = external origin.
   ───────────────────────────────────────────────────────────── */
function ExternalStateLoop() {
  const [notifications] = useState([
    { id: 1, title: "Build passed", badge: "CI", time: "2m ago" },
    { id: 2, title: "PR review requested", badge: "GitHub", time: "15m ago" },
    { id: 3, title: "Deploy complete", badge: "Vercel", time: "1h ago" },
  ]);

  return (
    <div className="rounded-lg border divide-y overflow-hidden">
      {notifications.map((n) => (
        <div key={n.id} className="flex items-center gap-3 px-4 py-3">
          <Badge variant="outline" className="shrink-0 text-xs">
            {n.badge}
          </Badge>
          <span className="text-sm flex-1">{n.title}</span>
          <span className="text-xs text-muted-foreground">{n.time}</span>
        </div>
      ))}
    </div>
  );
}
