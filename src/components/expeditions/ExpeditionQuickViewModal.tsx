import { useEffect } from "react";
import { useExpeditionQuickView } from "../../hooks/useExpeditionQuickView";

type ExpeditionQuickViewModalProps = {
  reference: string;
  onClose: () => void;
};

function formatDateForView(value: string | null): string {
  if (!value) return "Pendiente";

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

export default function ExpeditionQuickViewModal({
  reference,
  onClose,
}: ExpeditionQuickViewModalProps) {
  const {
    quickView,
    loading,
    error,
    loadQuickView,
    clearQuickView,
  } = useExpeditionQuickView();

  useEffect(() => {
    void loadQuickView(reference);

    return () => {
      clearQuickView();
    };
  }, [reference]);

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <div>
              <h2 className="modal-title h5 fw-bold">
                Vista rápida de expedición
              </h2>
              <div className="text-muted small">Referencia: {reference}</div>
            </div>

            <button
              type="button"
              className="btn-close"
              aria-label="Cerrar"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {loading && (
              <div className="text-muted">Cargando información...</div>
            )}

            {error && (
              <div className="alert alert-danger mb-0">{error}</div>
            )}

            {!loading && !error && quickView && (
              <div className="d-flex flex-column gap-4">
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Usuario</div>
                      <div className="fw-semibold">{quickView.username}</div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Fecha envío</div>
                      <div className="fw-semibold">
                        {formatDateForView(quickView.fechaEnvio)}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Destino</div>
                      <div className="fw-semibold">
                        {quickView.direccionDestino}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Paquetes</div>
                      <div className="fw-semibold">
                        {quickView.paquetes ?? "Sin indicar"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Peso</div>
                      <div className="fw-semibold">
                        {quickView.peso != null
                          ? `${quickView.peso} kg`
                          : "Sin indicar"}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="border rounded-3 p-3 h-100">
                      <div className="text-muted small mb-1">Terminales</div>
                      <div className="fw-semibold">
                        {quickView.totalTerminales}
                      </div>
                    </div>
                  </div>

                  {quickView.notas && (
                    <div className="col-12">
                      <div className="border rounded-3 p-3">
                        <div className="text-muted small mb-1">Notas</div>
                        <div>{quickView.notas}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="h6 fw-bold mb-3">Terminales enviados</h3>

                  <div className="table-responsive border rounded-3">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Modelo</th>
                          <th>Marca</th>
                          <th>Estado</th>
                          <th>Número de serie</th>
                        </tr>
                      </thead>

                      <tbody>
                        {quickView.terminales.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center text-muted py-4"
                            >
                              No hay terminales asociados.
                            </td>
                          </tr>
                        ) : (
                          quickView.terminales.map((terminal) => (
                            <tr key={terminal.numeroSerie}>
                              <td>{terminal.modelo}</td>
                              <td>{terminal.marca}</td>
                              <td>
                                <span className="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2">
                                  {terminal.estado}
                                </span>
                              </td>
                              <td>
                                <code>{terminal.numeroSerie}</code>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}