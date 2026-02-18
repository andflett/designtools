const metrics = [
  { label: "Design Tokens", value: "24", sub: "6 shadow tokens" },
  { label: "Components", value: "18", sub: "All using elevation" },
  { label: "Surfaces", value: "4", sub: "Depth levels" },
  { label: "Updated", value: "3", sub: "Tokens changed today" },
];

const tokens = [
  { name: "--shadow-xs", usage: "Inputs, toggles", layers: "1 layer", status: "Active" },
  { name: "--shadow-sm", usage: "Cards, panels", layers: "2 layers", status: "Active" },
  { name: "--shadow-md", usage: "Dropdowns, tooltips", layers: "2 layers", status: "Active" },
  { name: "--shadow-lg", usage: "Modals, drawers", layers: "2 layers", status: "Active" },
  { name: "--shadow-xl", usage: "Floating actions", layers: "2 layers", status: "Active" },
];

const activity = [
  "Updated shadow-sm to use 3-layer crisp approach",
  "Adjusted shadow-lg blur radius for softer edges",
  "Added shadow-inner token for input fields",
  "Changed shadow color from black to tinted hue",
  "Exported tokens to design-tokens.json",
];

export default function ProjectsPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Shadow Tokens</h1>
        <button className="btn btn-primary">Export Tokens</button>
      </div>

      {/* Stat cards — xs shadow */}
      <div className="grid-4 mb-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="card"
            style={{ boxShadow: "var(--shadow-xs)", border: "none" }}
          >
            <div className="card-body">
              <div className="text-sm text-muted" style={{ marginBottom: 4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2 }}>{m.value}</div>
              <div className="text-sm text-muted">{m.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2-1 mb-6">
        {/* Token table — sm shadow */}
        <div className="card" style={{ boxShadow: "var(--shadow-sm)", border: "none" }}>
          <div className="card-header">
            <span className="card-title">Token Scale</span>
            <button className="btn btn-ghost btn-sm">Edit All</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Usage</th>
                <th>Layers</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => (
                <tr key={t.name}>
                  <td className="text-bold" style={{ fontFamily: "monospace", fontSize: 13 }}>{t.name}</td>
                  <td>{t.usage}</td>
                  <td className="text-sm text-muted">{t.layers}</td>
                  <td>
                    <span className="badge badge-green">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex-col gap-16">
          {/* Activity — md shadow */}
          <div className="card" style={{ boxShadow: "var(--shadow-md)", border: "none" }}>
            <div className="card-header">
              <span className="card-title">Recent Edits</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {activity.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: "10px 20px",
                    fontSize: 13,
                    borderBottom: i < activity.length - 1 ? "1px solid var(--gray-200)" : "none",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Presets panel — lg shadow */}
          <div className="card" style={{ boxShadow: "var(--shadow-lg)", border: "none" }}>
            <div className="card-body" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                Apply Preset
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <button className="btn btn-ghost btn-sm">Crisp</button>
                <button className="btn btn-ghost btn-sm">Soft</button>
                <button className="btn btn-ghost btn-sm">Chunky</button>
                <button className="btn btn-ghost btn-sm">Material</button>
              </div>
            </div>
          </div>

          {/* Elevation preview — xl shadow + inner shadow */}
          <div className="card" style={{ boxShadow: "var(--shadow-xl)", border: "none" }}>
            <div className="card-body">
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Depth Coverage
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: "var(--radius-full)",
                  boxShadow: "var(--shadow-inner)",
                  background: "var(--gray-100)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "83%",
                    height: "100%",
                    background: "var(--indigo-500)",
                    borderRadius: "var(--radius-full)",
                  }}
                />
              </div>
              <div className="text-sm text-muted" style={{ marginTop: 8 }}>
                5 of 6 shadow tokens in use
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
