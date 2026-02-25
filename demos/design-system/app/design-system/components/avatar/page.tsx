"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const doc = componentDocs["avatar"];

export default function AvatarPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: () => (
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        ),
        renderCode: () =>
          `<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`,
      }}
      props={doc.props}
    />
  );
}
