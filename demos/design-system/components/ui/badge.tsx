import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-9 py-3.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "",
        outline: "border bg-transparent",
        subdued: "",
      },
      intent: {
        default: "",
        neutral: "",
        success: "",
        destructive: "",
        warning: "",
      },
    },
    compoundVariants: [
      // default (solid) x intents
      { variant: "default", intent: "default", className: "bg-primary text-primary-foreground" },
      { variant: "default", intent: "neutral", className: "bg-neutral text-neutral-foreground" },
      { variant: "default", intent: "success", className: "bg-success text-success-foreground" },
      { variant: "default", intent: "destructive", className: "bg-destructive text-destructive-foreground" },
      { variant: "default", intent: "warning", className: "bg-warning text-warning-foreground" },

      // outline x intents
      { variant: "outline", intent: "default", className: "border-primary text-primary" },
      { variant: "outline", intent: "neutral", className: "border-border text-neutral-subdued-foreground" },
      { variant: "outline", intent: "success", className: "border-success text-success" },
      { variant: "outline", intent: "destructive", className: "border-destructive text-destructive" },
      { variant: "outline", intent: "warning", className: "border-warning text-warning" },

      // subdued x intents
      { variant: "subdued", intent: "default", className: "bg-primary-subdued text-primary-subdued-foreground" },
      { variant: "subdued", intent: "neutral", className: "bg-neutral-subdued text-neutral-subdued-foreground" },
      { variant: "subdued", intent: "success", className: "bg-success-subdued text-success-subdued-foreground" },
      { variant: "subdued", intent: "destructive", className: "bg-destructive-subdued text-destructive-subdued-foreground" },
      { variant: "subdued", intent: "warning", className: "bg-warning-subdued text-warning-subdued-foreground" },
    ],
    defaultVariants: {
      variant: "default",
      intent: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, intent, ...props }, ref) => {
    return (
      <div
        data-slot="badge"
        ref={ref}
        className={cn(badgeVariants({ variant, intent, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
