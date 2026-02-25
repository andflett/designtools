"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Textarea } from "@/components/ui/textarea";

const doc = componentDocs["textarea"];

export default function TextareaPage() {
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
            <Textarea
              placeholder="Type your message here..."
              className="max-w-sm"
            />
          );
        },
        renderCode: () => {
          return `<Textarea placeholder="Type your message here..." />`;
        },
      }}
      props={doc.props}
    />
  );
}
