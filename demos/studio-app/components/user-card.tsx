import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function UserCard({
  initials,
  name,
  role,
  status = "online",
  size = "default",
  shape = "circle",
}: {
  initials: string;
  name: string;
  role: string;
  status?: "online" | "away" | "offline";
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  shape?: "circle" | "square";
}) {
  const statusColor = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-muted",
  }[status];

  return (
    <figure data-slot="user-card" data-status={status} data-size={size} className="flex items-center gap-3">
      <Avatar size={size} shape={shape}>
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <figcaption>
        <p data-slot="user-name" className="text-sm font-semibold">{name}</p>
        <p data-slot="user-role" className="text-xs text-muted-foreground">{role}</p>
      </figcaption>
      <span data-slot="status-dot" className={`h-2 w-2 rounded-full ${statusColor}`} />
    </figure>
  );
}
