export default function ExpeditionBoxesPanel() {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h2 className="h6 mb-0 fw-bold">Cajas vinculadas a la expedición</h2>
      </div>

      <div className="card-body d-flex flex-column gap-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Etiqueta</th>
                <th>Modelo del producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-semibold text-muted">Sin etiqueta</td>
                <td className="text-muted">Sin modelo vinculado</td>
                <td className="text-center text-muted">0</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    title="Eliminar caja"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border-top pt-4">
          <label htmlFor="box-label-input" className="form-label fw-semibold">
            Agregar caja por etiqueta
          </label>

          <div className="d-flex flex-column flex-md-row gap-2">
            <input
              id="box-label-input"
              type="text"
              className="form-control"
              placeholder="Introduce la etiqueta de la caja"
            />
            <button type="button" className="btn btn-primary px-4">
              Agregar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
