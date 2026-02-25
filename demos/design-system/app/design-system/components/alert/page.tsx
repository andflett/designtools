"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const doc = componentDocs["alert"];

export default function AlertPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: (variant) => {
          return (
            <Alert intent={variant as any} className="max-w-lg">
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This is a {variant} alert to show important information to the
                user.
              </AlertDescription>
            </Alert>
          );
        },
        renderCode: (variant) => {
          return `<Alert intent="${variant}">
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    This is a ${variant} alert to show important information to the user.
  </AlertDescription>
</Alert>`;
        },
      }}
      props={doc.props}
    />
  );
}
