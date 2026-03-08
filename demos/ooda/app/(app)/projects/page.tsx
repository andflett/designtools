import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const projects = [
  { id: "alpha", name: "Project Alpha", status: "Active", tasks: 12 },
  { id: "beta", name: "Project Beta", status: "Paused", tasks: 5 },
  { id: "gamma", name: "Project Gamma", status: "Active", tasks: 8 },
];

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground">All active workstreams.</p>
        </div>
        <Button>New Project</Button>
      </div>

      <ul className="mt-6 flex flex-col divide-y rounded-lg border">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.tasks} tasks</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={p.status === "Active" ? "default" : "secondary"} size="sm">
                {p.status}
              </Badge>
              <a href={`/projects/${p.id}`}>
                <Button variant="ghost" size="sm">Open</Button>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
