import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const projects: Record<string, { name: string; status: string; desc: string; tasks: number }> = {
  alpha: { name: "Project Alpha", status: "Active", desc: "Core platform infrastructure work.", tasks: 12 },
  beta: { name: "Project Beta", status: "Paused", desc: "Marketing site redesign, on hold.", tasks: 5 },
  gamma: { name: "Project Gamma", status: "Active", desc: "Mobile app v2 feature development.", tasks: 8 },
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects[id] ?? { name: id, status: "Unknown", desc: "No details.", tasks: 0 };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <a href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
        ← Projects
      </a>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <Badge variant={project.status === "Active" ? "default" : "secondary"}>{project.status}</Badge>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">{project.desc}</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>{project.tasks} tasks in this project</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <a href={`/projects/${id}/tasks`}>
            <Button>View Tasks</Button>
          </a>
          <Button variant="outline">Edit Project</Button>
        </CardContent>
      </Card>
    </div>
  );
}
