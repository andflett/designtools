"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

const doc = componentDocs["toast"];

export default function ToastPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: (variant) => (
          <Toast intent={variant as "default" | "success" | "destructive" | "warning"}>
            <ToastTitle>Event created</ToastTitle>
            <ToastDescription>
              Your event has been successfully scheduled.
            </ToastDescription>
          </Toast>
        ),
        renderCode: (variant) =>
          `<Toast${variant !== "default" ? ` intent="${variant}"` : ""}>
  <ToastTitle>Event created</ToastTitle>
  <ToastDescription>
    Your event has been successfully scheduled.
  </ToastDescription>
</Toast>`,
      }}
      props={doc.props}
    />
  );
}
