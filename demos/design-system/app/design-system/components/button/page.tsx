"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Button } from "@/components/ui/button";

const doc = componentDocs["button"];

export default function ButtonPage() {
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
            <Button intent={variant as any}>Click me</Button>
          );
        },
        renderCode: (variant) => {
          return `<Button intent="${variant}">Click me</Button>`;
        },
      }}
      props={doc.props}
    />
  );
}
