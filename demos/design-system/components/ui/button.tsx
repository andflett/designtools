"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline: "border bg-transparent",
        ghost: "bg-transparent",
        text: "bg-transparent underline-offset-4 hover:underline",
      },
      intent: {
        default: "",
        neutral: "",
        success: "",
        destructive: "",
        warning: "",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    compoundVariants: [
      // default variant (solid) x intents
      { variant: "default", intent: "default", className: "bg-primary text-primary-foreground hover:bg-primary-highlight" },
      { variant: "default", intent: "neutral", className: "bg-neutral text-neutral-foreground hover:bg-neutral-highlight hover:text-neutral-highlight-foreground" },
      { variant: "default", intent: "success", className: "bg-success text-success-foreground hover:bg-success-highlight" },
      { variant: "default", intent: "destructive", className: "bg-destructive text-destructive-foreground hover:bg-destructive-highlight" },
      { variant: "default", intent: "warning", className: "bg-warning text-warning-foreground hover:bg-warning-highlight" },

      // outline variant x intents
      { variant: "outline", intent: "default", className: "border-primary text-primary hover:bg-primary-subdued" },
      { variant: "outline", intent: "neutral", className: "border-border text-neutral-subdued-foreground hover:bg-neutral-subdued" },
      { variant: "outline", intent: "success", className: "border-success text-success hover:bg-success-subdued" },
      { variant: "outline", intent: "destructive", className: "border-destructive text-destructive hover:bg-destructive-subdued" },
      { variant: "outline", intent: "warning", className: "border-warning text-warning hover:bg-warning-subdued" },

      // ghost variant x intents
      { variant: "ghost", intent: "default", className: "text-primary hover:bg-primary-subdued" },
      { variant: "ghost", intent: "neutral", className: "text-neutral-subdued-foreground hover:bg-neutral-subdued" },
      { variant: "ghost", intent: "success", className: "text-success hover:bg-success-subdued" },
      { variant: "ghost", intent: "destructive", className: "text-destructive hover:bg-destructive-subdued" },
      { variant: "ghost", intent: "warning", className: "text-warning hover:bg-warning-subdued" },

      // text variant x intents
      { variant: "text", intent: "default", className: "text-primary" },
      { variant: "text", intent: "neutral", className: "text-neutral-subdued-foreground" },
      { variant: "text", intent: "success", className: "text-success" },
      { variant: "text", intent: "destructive", className: "text-destructive" },
      { variant: "text", intent: "warning", className: "text-warning" },
    ],
    defaultVariants: {
      variant: "default",
      intent: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, intent, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
