import { CodeBlock } from "@/components/docs/code-block";
import { Playground } from "@/components/docs/playground";
import type { PlaygroundProps } from "@/components/docs/playground";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDef } from "@/components/docs/props-table";

interface ComponentPageProps {
  title: string;
  description: string;
  importCode: string;
  playground: PlaygroundProps;
  props: PropDef[];
}

export function ComponentPage({
  title,
  description,
  importCode,
  playground,
  props,
}: ComponentPageProps) {
  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>

      {/* Installation */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Installation</h2>
        <div className="mt-4">
          <CodeBlock code={importCode} />
        </div>
      </section>

      {/* Playground */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">Playground</h2>
        <div className="mt-4">
          <Playground {...playground} />
        </div>
      </section>

      {/* API Reference */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">API Reference</h2>
        <div className="mt-4">
          <PropsTable props={props} />
        </div>
      </section>
    </div>
  );
}
