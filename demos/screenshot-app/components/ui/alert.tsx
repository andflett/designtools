import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg text-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border border-border",
        destructive: "border border-destructive/30 text-destructive bg-destructive/5 [&>svg]:text-destructive",
        success: "border border-primary/20 bg-primary/5 text-foreground [&>svg]:text-primary",
        warning: "border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 [&>svg]:text-yellow-500",
      },
      size: {
        sm: "px-4 py-3",
        default: "px-5 py-4",
        lg: "px-6 py-5",
      },
      border: {
        default: "",
        thick: "border-2",
        left: "border-l-4 border-y-0 border-r-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      border: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, size, border, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    data-slot="alert"
    className={cn(alertVariants({ variant, size, border }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn("text-xs font-semibold uppercase tracking-wide mb-1", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="alert-description"
    className={cn("text-sm text-muted-foreground [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
