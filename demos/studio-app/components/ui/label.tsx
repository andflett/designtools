import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    data-slot="label"
    className={cn(
      "text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pt-6 pr-0.5 pb-2 pl-6",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
