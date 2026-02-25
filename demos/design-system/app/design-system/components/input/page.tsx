"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Input } from "@/components/ui/input";

const doc = componentDocs["input"];

export default function InputPage() {
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
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-sm"
            />
          );
        },
        renderCode: () => {
          return `<Input type="email" placeholder="Enter your email" />`;
        },
      }}
      props={doc.props}
    />
  );
}
