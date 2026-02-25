"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const noticeVariants = cva(
  "relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      intent: {
        default: "bg-primary text-primary-foreground",
        success: "bg-success text-success-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        warning: "bg-warning text-warning-foreground",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export interface NoticeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof noticeVariants> {
  onDismiss?: () => void;
}

const Notice = React.forwardRef<HTMLDivElement, NoticeProps>(
  ({ className, intent, onDismiss, children, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      data-slot="notice"
      className={cn(noticeVariants({ intent }), className)}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex shrink-0 items-center justify-center rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
);
Notice.displayName = "Notice";

export { Notice, noticeVariants };
