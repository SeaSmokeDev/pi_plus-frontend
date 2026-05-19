export default function ExpeditionSummaryPanel() {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h2 className="h6 mb-0 fw-bold">Detalles de los datáfonos vinculados</h2>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Estado</th>
                <th>Número de serie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-muted">Sin modelo</td>
                <td className="text-muted">Sin marca</td>
                <td className="text-muted">Sin estado</td>
                <td className="text-muted">Sin número de serie</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div className="text-muted small">
          Límite por vista: <span className="fw-semibold">50</span>
        </div>

        <div className="d-flex align-items-center gap-3 text-muted small">
          <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
            Ant.
          </button>
          <span>1 - 50 de 200</span>
          <button type="button" className="btn btn-sm btn-outline-secondary">
            Sig.
          </button>
        </div>
      </div>
    </section>
  );
}
