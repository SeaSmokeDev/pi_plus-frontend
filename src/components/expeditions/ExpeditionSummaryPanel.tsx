type ExpeditionTerminalSummaryItem = {
  model: string;
  entity: string;
  quantity: number;
};

type ExpeditionSummaryPanelProps = {
  items: ExpeditionTerminalSummaryItem[];
};

export default function ExpeditionSummaryPanel({ items }: ExpeditionSummaryPanelProps) {
  const total = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h2 className="h6 mb-0 fw-bold">Resumen de terminales vinculados</h2>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Modelo</th>
                <th>Entidad</th>
                <th className="text-end">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={`${item.model}-${index}`}>
                  <td>{item.model}</td>
                  <td>{item.entity}</td>
                  <td className="text-end">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="table-light">
                <td colSpan={2} className="fw-semibold text-end">
                  Cantidad total:
                </td>
                <td className="fw-bold text-end">{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}
