import "../../styles/DashboardOperationalAlerts.scss";

type AlertItem = {
  estado: string;
  total: number;
};

const BAR_COLORS = ["#2563eb", "#16a34a", "#d97706", "#dc2626", "#0891b2", "#7c3aed"];

function normalizeLabel(value: string): string {
  return value.replaceAll("_", " ");
}

export default function OperationalAlertsChart({
  loading,
  error,
  items,
}: {
  loading: boolean;
  error: string | null;
  items: AlertItem[];
}) {
  const top = items.slice(0, 6);
  const max = Math.max(...top.map((item) => item.total), 1);

  return (
    <div className="card shadow-sm dashboard-operational-alerts h-100">
      <div className="card-body p-4">
        <h3 className="dashboard-operational-alerts__title">Alertas operativas</h3>
        <p className="dashboard-operational-alerts__subtitle">Terminales por estado</p>

        {loading ? (
          <div className="text-muted">Cargando...</div>
        ) : error ? (
          <div className="text-danger small">{error}</div>
        ) : top.length === 0 ? (
          <div className="text-muted">Sin datos de terminales.</div>
        ) : (
          <>
            <div className="dashboard-operational-alerts__chart">
              {top.map((item, index) => {
                const height = (item.total / max) * 100;
                return (
                  <div key={item.estado} className="dashboard-operational-alerts__bar-col">
                    <div
                      className="dashboard-operational-alerts__bar"
                      style={{ height: `${Math.max(height, 8)}%`, backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }}
                    />
                    <span className="dashboard-operational-alerts__bar-value">{item.total}</span>
                    <span className="dashboard-operational-alerts__bar-label">{normalizeLabel(item.estado)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

