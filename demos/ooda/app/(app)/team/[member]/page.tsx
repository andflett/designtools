import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data: Record<string, { name: string; role: string; email: string; joined: string }> = {
  alice: { name: "Alice Kim", role: "Engineering", email: "alice@example.com", joined: "Jan 2024" },
  bob: { name: "Bob Torres", role: "Design", email: "bob@example.com", joined: "Mar 2024" },
  carol: { name: "Carol White", role: "Product", email: "carol@example.com", joined: "Jun 2023" },
  dave: { name: "Dave Park", role: "Engineering", email: "dave@example.com", joined: "Sep 2023" },
};

export default async function MemberPage({ params }: { params: Promise<{ member: string }> }) {
  const { member } = await params;
  const person = data[member] ?? { name: member, role: "Unknown", email: "—", joined: "—" };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center gap-3">
        <a href="/team" className="text-sm text-muted-foreground hover:text-foreground">
          ← Team
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{person.name}</h1>
        <Badge variant="secondary">{person.role}</Badge>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{person.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Joined</span>
            <span>{person.joined}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-2">
        <Button>Message</Button>
        <Button variant="outline">Remove from Team</Button>
      </div>
    </div>
  );
}
