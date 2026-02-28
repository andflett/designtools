import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({
  placeholder = "Search…",
  action = "Search",
}: {
  placeholder?: string;
  action?: string;
}) {
  return (
    <search data-slot="search-bar" className="flex items-center gap-2">
      <Input placeholder={placeholder} className="flex-1" />
      <Button variant="secondary" size="sm">{action}</Button>
    </search>
  );
}
