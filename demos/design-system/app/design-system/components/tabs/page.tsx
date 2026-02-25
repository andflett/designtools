"use client";

import { ComponentPage } from "@/components/docs/component-page";
import { componentDocs } from "@/lib/component-docs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const doc = componentDocs["tabs"];

export default function TabsPage() {
  return (
    <ComponentPage
      title={doc.title}
      description={doc.description}
      importCode={doc.importCode}
      playground={{
        variants: doc.variants,
        defaultVariant: doc.variants[0]?.name,
        renderPreview: () => (
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p className="text-sm text-muted-foreground">
                Make changes to your account here. Click save when you are done.
              </p>
            </TabsContent>
            <TabsContent value="password">
              <p className="text-sm text-muted-foreground">
                Change your password here. After saving, you will be logged out.
              </p>
            </TabsContent>
            <TabsContent value="notifications">
              <p className="text-sm text-muted-foreground">
                Configure how you receive notifications and alerts.
              </p>
            </TabsContent>
          </Tabs>
        ),
        renderCode: () =>
          `<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p className="text-sm text-muted-foreground">
      Make changes to your account here. Click save when you are done.
    </p>
  </TabsContent>
  <TabsContent value="password">
    <p className="text-sm text-muted-foreground">
      Change your password here. After saving, you will be logged out.
    </p>
  </TabsContent>
  <TabsContent value="notifications">
    <p className="text-sm text-muted-foreground">
      Configure how you receive notifications and alerts.
    </p>
  </TabsContent>
</Tabs>`,
      }}
      props={doc.props}
    />
  );
}
