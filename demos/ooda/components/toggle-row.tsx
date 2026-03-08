"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  size = "default",
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <fieldset data-slot="toggle-row" className="flex items-center justify-between text-[text-lg]">
      <Label>
        {label}
        {description && (
          <span data-slot="toggle-description" className="block text-xs font-normal text-muted-foreground">{description}</span>
        )}
      </Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} size={size} />
    </fieldset>
  );
}
