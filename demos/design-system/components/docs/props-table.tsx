export interface PropDef {
  name: string;
  required?: boolean;
  default?: string;
  description: string;
  type: string;
}

export interface PropsTableProps {
  props: PropDef[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Prop
            </th>
            <th className="pb-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Required
            </th>
            <th className="pb-3 pr-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Default
            </th>
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border">
              <td className="py-3 pr-6 align-top">
                <code className="font-mono text-sm font-medium">
                  {prop.name}
                </code>
              </td>
              <td className="py-3 pr-6 align-top">
                {prop.required ? (
                  <span className="inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                    Required
                  </span>
                ) : (
                  <span className="inline-block rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    Optional
                  </span>
                )}
              </td>
              <td className="py-3 pr-6 align-top">
                {prop.default ? (
                  <code className="font-mono text-sm">{prop.default}</code>
                ) : (
                  <span className="text-muted-foreground">&mdash;</span>
                )}
              </td>
              <td className="py-3 align-top">
                <p className="text-sm text-foreground">{prop.description}</p>
                <span className="mt-1 inline-block rounded bg-warning-subdued px-1.5 py-0.5 font-mono text-xs text-warning-subdued-foreground">
                  {prop.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
