import "../../styles/DashboardModelsUsage.scss";

type ModelUsage = {
  modelo: string;
  total: number;
};

const COLOR_CLASSES = ["usage-primary", "usage-success", "usage-danger", "usage-info", "usage-warning"];

function buildConicGradient(items: ModelUsage[]): string {
  const total = items.reduce((sum, item) => sum + item.total, 0);
  if (total <= 0) {
    return "conic-gradient(#e2e8f0 0deg, #e2e8f0 360deg)";
  }

  let acc = 0;
  const segments = items.map((item, index) => {
    const start = (acc / total) * 360;
    acc += item.total;
    const end = (acc / total) * 360;
    const color =
      index === 0 ? "#2563eb" : index === 1 ? "#16a34a" : index === 2 ? "#dc2626" : index === 3 ? "#0891b2" : "#f59e0b";
    return `${color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

export default function ModelsUsageCard({
  loading,
  error,
  items,
}: {
  loading: boolean;
  error: string | null;
  items: ModelUsage[];
}) {
  const top = items.slice(0, 5);
  const total = top.reduce((sum, item) => sum + item.total, 0);
  const chartBg = buildConicGradient(top);

  return (
    <div className="card shadow-sm dashboard-models-usage h-100">
      <div className="card-body p-4">
        <h3 className="dashboard-models-usage__title">Modelos más usados en cajas</h3>
        <p className="dashboard-models-usage__subtitle">Overview</p>

        {loading ? (
          <div className="text-muted">Cargando...</div>
        ) : error ? (
          <div className="text-danger small">{error}</div>
        ) : top.length === 0 ? (
          <div className="text-muted">Sin modelos disponibles.</div>
        ) : (
          <>
            <div className="dashboard-models-usage__donut-wrap">
              <div className="dashboard-models-usage__donut" style={{ background: chartBg }}>
                <div className="dashboard-models-usage__donut-center">
                  <strong>{total}</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-models-usage__list">
              {top.map((item, index) => {
                const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
                const color = COLOR_CLASSES[index % COLOR_CLASSES.length];
                return (
                  <div key={item.modelo} className="dashboard-models-usage__item">
                    <div className={`dashboard-models-usage__icon ${color}`}>
                      <i className="bi bi-cpu" />
                    </div>
                    <div className="dashboard-models-usage__meta">
                      <h6>{item.modelo}</h6>
                      <p>en cajas registradas</p>
                    </div>
                    <span className={`dashboard-models-usage__badge ${color}`}>{pct}%</span>
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

