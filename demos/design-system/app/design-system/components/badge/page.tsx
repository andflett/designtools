"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Badge } from "@/components/ui/badge";

const doc = componentDocs["badge"];

export default function BadgePage() {
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
            <Badge intent={variant as any}>Badge</Badge>
          );
        },
        renderCode: (variant) => {
          return `<Badge intent="${variant}">Badge</Badge>`;
        },
      }}
      props={doc.props}
    />
  );
}
