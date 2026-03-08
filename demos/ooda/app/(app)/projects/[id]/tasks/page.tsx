import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tasksByProject: Record<string, { id: number; title: string; status: string }[]> = {
  alpha: [
    { id: 1, title: "Set up CI pipeline", status: "Done" },
    { id: 2, title: "Migrate to Postgres 16", status: "In Progress" },
    { id: 3, title: "Add rate limiting", status: "Pending" },
  ],
  beta: [
    { id: 1, title: "New homepage wireframes", status: "Done" },
    { id: 2, title: "Copy review", status: "Pending" },
  ],
  gamma: [
    { id: 1, title: "Onboarding flow", status: "In Progress" },
    { id: 2, title: "Push notifications", status: "Pending" },
    { id: 3, title: "Offline mode", status: "Pending" },
  ],
};

export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tasks = tasksByProject[id] ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <a href="/projects" className="hover:text-foreground">Projects</a>
        <span>/</span>
        <a href={`/projects/${id}`} className="hover:text-foreground capitalize">{id}</a>
        <span>/</span>
        <span className="text-foreground">Tasks</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button>Add Task</Button>
      </div>

      <ul className="mt-6 flex flex-col divide-y rounded-lg border">
        {tasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between px-4 py-3">
            <p className="text-sm font-medium">{task.title}</p>
            <div className="flex items-center gap-3">
              <Badge
                variant={task.status === "Done" ? "default" : task.status === "In Progress" ? "secondary" : "outline"}
                size="sm"
              >
                {task.status}
              </Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">No tasks yet.</li>
        )}
      </ul>
    </div>
  );
}
