"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Separator } from "@/components/ui/separator";

const doc = componentDocs["separator"];

export default function SeparatorPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: () => {
          return (
            <div className="w-full max-w-sm">
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">
                  Design System
                </h4>
                <p className="text-sm text-muted-foreground">
                  An open-source UI component library.
                </p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">
                  Documentation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Learn how to use and customize components.
                </p>
              </div>
            </div>
          );
        },
        renderCode: () => {
          return `<div>
  <div className="space-y-1">
    <h4 className="text-sm font-medium">Design System</h4>
    <p className="text-sm text-muted-foreground">
      An open-source UI component library.
    </p>
  </div>
  <Separator className="my-4" />
  <div className="space-y-1">
    <h4 className="text-sm font-medium">Documentation</h4>
    <p className="text-sm text-muted-foreground">
      Learn how to use and customize components.
    </p>
  </div>
</div>`;
        },
      }}
      props={doc.props}
    />
  );
}
