"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Notice } from "@/components/ui/notice";

const doc = componentDocs["notice"];

export default function NoticePage() {
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
            <Notice intent={variant as any} className="max-w-lg">
              This is a {variant} notice with an important message for the user.
            </Notice>
          );
        },
        renderCode: (variant) => {
          return `<Notice intent="${variant}">
  This is a ${variant} notice with an important message for the user.
</Notice>`;
        },
      }}
      props={doc.props}
    />
  );
}
