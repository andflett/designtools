import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const members = [
  { slug: "alice", name: "Alice Kim", role: "Engineering", status: "Active" },
  { slug: "bob", name: "Bob Torres", role: "Design", status: "Active" },
  { slug: "carol", name: "Carol White", role: "Product", status: "Away" },
  { slug: "dave", name: "Dave Park", role: "Engineering", status: "Active" },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-sm text-muted-foreground">All workspace members.</p>
        </div>
        <Button>Invite Member</Button>
      </div>

      <ul className="mt-6 flex flex-col divide-y rounded-lg border">
        {members.map((m) => (
          <li key={m.slug} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.role}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={m.status === "Active" ? "default" : "secondary"} size="sm">
                {m.status}
              </Badge>
              <a href={`/team/${m.slug}`}>
                <Button variant="ghost" size="sm">View</Button>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
