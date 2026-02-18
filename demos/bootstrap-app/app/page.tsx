const stats = [
  { label: "Shadow Tokens", value: "6", change: "+2 new", up: true },
  { label: "Components", value: "42", change: "All elevated", up: true },
  { label: "Depth Levels", value: "4", change: "sm to xl", up: true },
  { label: "Avg. Layers", value: "2.5", change: "Per token", up: true },
];

const elevations = [
  { name: "shadow-sm", usage: "Cards, list items", layers: 2, status: "Active" },
  { name: "shadow", usage: "Dropdowns, popovers", layers: 3, status: "Active" },
  { name: "shadow-lg", usage: "Modals, drawers", layers: 3, status: "Active" },
  { name: "shadow-inset", usage: "Input fields, wells", layers: 1, status: "Active" },
  { name: "shadow-none", usage: "Flat surfaces", layers: 0, status: "Unused" },
];

export default function HomePage() {
  return (
    <>
      {/* Stat cards — shadow-sm */}
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="col-sm-6 col-xl-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <p className="text-muted small mb-1">{s.label}</p>
                <h4 className="fw-bold mb-1">{s.value}</h4>
                <span className={`badge ${s.up ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                  {s.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Elevation table — default shadow */}
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">
              <h6 className="mb-0 fw-semibold">Elevation Scale</h6>
              <button className="btn btn-sm btn-outline-primary">Edit Tokens</button>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Token</th>
                    <th>Usage</th>
                    <th>Layers</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {elevations.map((e) => (
                    <tr key={e.name}>
                      <td className="fw-medium font-monospace" style={{ fontSize: 13 }}>{e.name}</td>
                      <td>{e.usage}</td>
                      <td className="text-muted">{e.layers}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            e.status === "Active"
                              ? "bg-success-subtle text-success"
                              : "bg-warning-subtle text-warning"
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar widgets — shadow-lg */}
        <div className="col-lg-4 d-flex flex-column gap-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-primary">Apply Preset</button>
                <button className="btn btn-outline-secondary">Export CSS</button>
                <button className="btn btn-outline-secondary">Compare Presets</button>
              </div>
            </div>
          </div>

          <div className="card shadow border-0">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Recent Changes</h6>
              <ul className="list-unstyled mb-0">
                {[
                  "Switched shadow-sm to crisp 3-layer",
                  "Reduced shadow-lg opacity to 0.06",
                  "Added tinted shadow color for cards",
                  "Updated inset shadow blur radius",
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`py-2 small ${i < 3 ? "border-bottom" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inset shadow example */}
          <div
            className="card border-0"
            style={{ boxShadow: "var(--bs-box-shadow-inset, inset 0 1px 2px rgba(0,0,0,.075))" }}
          >
            <div className="card-body text-center">
              <small className="text-muted">Inset shadow preview</small>
              <p className="mb-0 fw-semibold">shadow-inset</p>
              <small className="text-muted">For wells and input fields</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
