"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Slider } from "@/components/ui/slider";

const doc = componentDocs["slider"];

export default function SliderPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: () => (
          <Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />
        ),
        renderCode: () =>
          `<Slider defaultValue={[50]} max={100} step={1} className="w-[300px]" />`,
      }}
      props={doc.props}
    />
  );
}
