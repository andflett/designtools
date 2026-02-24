import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    title: "Visual Token Editing",
    description: "Edit colors, spacing, and radii at the system level.",
    detail:
      "Changes propagate everywhere instantly via CSS custom properties and HMR.",
    badge: "Tokens",
  },
  {
    title: "Component Inspector",
    description: "Modify component definitions across all instances.",
    detail:
      "Edit Tailwind classes within CVA variant definitions using a structured property panel.",
    badge: "Components",
  },
  {
    title: "Instance Overrides",
    description: "Tweak individual component usages on a page.",
    detail:
      "Change variant props, toggle booleans, or add className overrides to specific instances.",
    badge: "Instances",
  },
];

const stats = [
  { value: "50+", label: "CSS Properties" },
  { value: "<1s", label: "Write Latency" },
  { value: "0", label: "Config Required" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <section className="flex flex-col items-center gap-5 text-center">
        <Badge variant="secondary">Now in Beta</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Build better interfaces,
          <br />
          visually.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A visual editing tool that runs alongside your dev server. Select any
          element, tweak styles, and changes write back to your source files
          instantly.
        </p>
        <div className="flex gap-3 mt-2">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">
            View Docs
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-16 grid grid-cols-3 gap-8 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Feature Cards */}
      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="mb-2">
                <Badge variant="outline">{feature.badge}</Badge>
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-lg border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Ready to try it?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Run{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
            npx @designtools/codesurface
          </code>{" "}
          next to your dev server.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button>Install Now</Button>
          <Button variant="ghost">Learn More</Button>
        </div>
      </section>
    </div>
  );
}
