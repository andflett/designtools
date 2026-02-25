"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const doc = componentDocs["card"];

export default function CardPage() {
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
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>
                  Card description with supporting text.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This is the main content area of the card. You can place any
                  content here.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" intent="neutral" size="sm">
                  Cancel
                </Button>
                <Button size="sm" className="ml-auto">
                  Save
                </Button>
              </CardFooter>
            </Card>
          );
        },
        renderCode: () => {
          return `<Card className="w-[350px]">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>
      Card description with supporting text.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the main content area of the card.</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline" intent="neutral" size="sm">Cancel</Button>
    <Button size="sm" className="ml-auto">Save</Button>
  </CardFooter>
</Card>`;
        },
      }}
      props={doc.props}
    />
  );
}
