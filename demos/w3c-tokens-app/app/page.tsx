const kpis = [
  { label: "Shadow Tokens", value: "5", delta: "W3C format", up: true },
  { label: "Elevation Levels", value: "4", delta: "none to highest", up: true },
  { label: "Avg. Layers", value: "2.3", delta: "Per token", up: true },
  { label: "Token File", value: "1", delta: "shadows.tokens.json", up: true },
];

const tokenScale = [
  { name: "shadow.none", cssVar: "--shadow-none", elevation: "Flat", layers: "0" },
  { name: "shadow.low", cssVar: "--shadow-low", elevation: "Resting", layers: "1" },
  { name: "shadow.medium", cssVar: "--shadow-medium", elevation: "Raised", layers: "2" },
  { name: "shadow.high", cssVar: "--shadow-high", elevation: "Floating", layers: "2" },
  { name: "shadow.highest", cssVar: "--shadow-highest", elevation: "Overlay", layers: "2" },
];

const changelog = [
  { text: "Tuned shadow.low for crisper card edges", severity: "success" },
  { text: "shadow.high spread reduced to -4px", severity: "info" },
  { text: "Exported updated tokens to JSON", severity: "success" },
];

export default function DashboardPage() {
  return (
    <>
      {/* KPI row — low elevation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card card-low" style={{ border: "none" }}>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{kpi.value}</div>
            <span
              className="badge"
              style={{
                background: kpi.up ? "#ecfdf5" : "#fef2f2",
                color: kpi.up ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {kpi.delta}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Token table — medium elevation */}
        <div className="card card-medium" style={{ border: "none", padding: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>Token Scale</span>
            <button className="btn btn-outline" style={{ fontSize: 12, padding: "4px 12px" }}>
              Edit Tokens
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={{ padding: "10px 20px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Token Path
                </th>
                <th style={{ padding: "10px 20px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  CSS Variable
                </th>
                <th style={{ padding: "10px 20px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Elevation
                </th>
                <th style={{ padding: "10px 20px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Layers
                </th>
              </tr>
            </thead>
            <tbody>
              {tokenScale.map((t) => (
                <tr key={t.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 13 }}>
                    {t.name}
                  </td>
                  <td style={{ padding: "10px 20px", fontFamily: "monospace", fontSize: 13, color: "var(--color-text-secondary)" }}>
                    {t.cssVar}
                  </td>
                  <td style={{ padding: "10px 20px" }}>{t.elevation}</td>
                  <td style={{ padding: "10px 20px" }}>{t.layers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Changelog — high elevation */}
          <div className="card card-high" style={{ border: "none" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Recent Edits</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {changelog.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: "var(--radius)",
                    background:
                      a.severity === "warning"
                        ? "#fffbeb"
                        : a.severity === "success"
                          ? "#ecfdf5"
                          : "#eff6ff",
                    fontSize: 13,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        a.severity === "warning"
                          ? "var(--color-warning)"
                          : a.severity === "success"
                            ? "var(--color-success)"
                            : "var(--color-accent)",
                    }}
                  />
                  {a.text}
                </div>
              ))}
            </div>
          </div>

          {/* Presets — highest elevation */}
          <div
            className="card card-highest"
            style={{
              border: "none",
              background: "var(--color-accent)",
              color: "var(--color-accent-text)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
              Shadow Presets
            </div>
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>
              Apply a curated shadow style to your entire token scale in one click.
            </div>
            <button
              className="btn"
              style={{
                background: "white",
                color: "var(--color-accent)",
                width: "100%",
                fontWeight: 600,
              }}
            >
              Browse Presets
            </button>
          </div>

          {/* Elevation preview cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["low", "medium", "high", "highest"].map((level) => (
              <div
                key={level}
                className={`card card-${level}`}
                style={{
                  border: "none",
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500 }}>{level}</span>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "monospace" }}>
                  shadow-{level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
