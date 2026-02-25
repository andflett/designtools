"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Progress } from "@/components/ui/progress";

const doc = componentDocs["progress"];

export default function ProgressPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: () => <Progress value={60} className="w-[60%]" />,
        renderCode: () => `<Progress value={60} className="w-[60%]" />`,
      }}
      props={doc.props}
    />
  );
}
