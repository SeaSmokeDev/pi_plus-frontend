import type { BoxExpeditionDetail, PaymentBoxDetail } from "../../types";


type ExpeditionPaymentsPanelProps = {
  boxes: BoxExpeditionDetail[];
};

type PaymentWithBox = PaymentBoxDetail & {
  boxId: number;
  boxLabel: string;
};

function formatPaymentStatus(status: PaymentBoxDetail["estado"]): string {
  const labels: Record<PaymentBoxDetail["estado"], string> = {
    en_transito: "En transito",
    pendiente_transito: "Pendiente transito",
    pendiente_revision: "Pendiente revision",
    operativo: "Operativo",
    pendiente_laboratorio: "Pendiente laboratorio",
    nivel_1: "Nivel 1",
  };

  return labels[status] ?? status;
}

export default function ExpeditionPaymentsPanel({
  boxes,
}: ExpeditionPaymentsPanelProps) {
  const payments: PaymentWithBox[] = boxes.flatMap((box) =>
    box.terminales.map((terminal) => ({
      ...terminal,
      boxId: box.id,
      boxLabel: box.etiqueta,
    })),
  );

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <div>
          <h2 className="h6 mb-1 fw-bold">
            Detalles de los datáfonos vinculados
          </h2>
        </div>
      </div>

      <div className="card-body p-2">
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
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    Todavía no hay datáfonos vinculados. Añade una caja para ver
                    sus terminales.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={`${payment.boxId}-${payment.numeroSerie}`}>
                    <td>
                      <div className="fw-semibold">{payment.modelo}</div>
                      <div className="text-muted small">
                        Caja: {payment.boxLabel}
                      </div>
                    </td>

                    <td>{payment.marca}</td>

                    <td>
                      <span className="badge bg-success-subtle text-success-emphasis rounded-pill px-3 py-2">
                        {formatPaymentStatus(payment.estado)}
                      </span>
                    </td>

                    <td>
                      <code>{payment.numeroSerie}</code>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-footer bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div className="text-muted small">
          Cajas vinculadas: <span className="fw-semibold">{boxes.length}</span>
        </div>

        <div className="text-muted small">
          Total datáfonos:{" "}
          <span className="fw-semibold">{payments.length}</span>
        </div>
      </div>
    </section>
  );
}
