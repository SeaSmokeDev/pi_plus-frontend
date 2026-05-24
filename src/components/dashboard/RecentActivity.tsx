import type { ExpeditionList } from "../../types";
import "../../styles/DashboardRecentActivity.scss";

type StatusItem = {
  key: string;
  label: string;
  icon: string;
  colorClass: string;
  total: number;
};

function toDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDayKey(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
}

function getLast7DaysSeries(expediciones: ExpeditionList[]): number[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  const byDay = new Map<string, number>();

  for (let i = 0; i < 7; i += 1) {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    byDay.set(getDayKey(day), 0);
  }

  expediciones.forEach((item) => {
    const date = toDate(item.fechaModificacion || item.fechaCreacion);
    if (!date) return;
    const key = getDayKey(date);
    if (byDay.has(key)) {
      byDay.set(key, (byDay.get(key) ?? 0) + 1);
    }
  });

  return Array.from(byDay.values());
}

function buildPath(values: number[], width = 640, height = 180): string {
  if (values.length === 0) return "";
  const max = Math.max(...values, 1);
  const stepX = width / Math.max(1, values.length - 1);

  const points = values.map((value, i) => {
    const x = i * stepX;
    const y = height - (value / max) * (height - 12) - 6;
    return [x, y] as const;
  });

  return points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
}

function buildStatusItems(expediciones: ExpeditionList[]): StatusItem[] {
  const counts = expediciones.reduce<Record<string, number>>((acc, item) => {
    acc[item.estado] = (acc[item.estado] ?? 0) + 1;
    return acc;
  }, {});

  const base: Array<Omit<StatusItem, "total">> = [
    { key: "abierta", label: "Abiertas", icon: "bi-folder2-open", colorClass: "status-primary" },
    { key: "en_transito", label: "En tránsito", icon: "bi-truck", colorClass: "status-info" },
    { key: "recibida", label: "Recibidas", icon: "bi-check2-circle", colorClass: "status-success" },
  ];

  const items = base.map((item) => ({
    ...item,
    total: counts[item.key] ?? 0,
  }));

  return items.sort((a, b) => b.total - a.total);
}

export default function RecentActivity({
  expediciones,
  loading,
  error,
}: {
  expediciones: ExpeditionList[];
  loading: boolean;
  error: string | null;
}) {
  const trend = getLast7DaysSeries(expediciones);
  const trendPath = buildPath(trend);
  const totalWeek = trend.reduce((sum, value) => sum + value, 0);
  const statuses = buildStatusItems(expediciones);

  return (
    <div className="card shadow-sm dashboard-recent-activity">
      <div className="card-body p-4">
        <h3 className="dashboard-recent-activity__title">Expediciones recientes</h3>
        <p className="dashboard-recent-activity__subtitle">Últimos 7 días</p>
        {loading ? (
          <div className="text-muted">Cargando...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : expediciones.length === 0 ? (
          <div className="text-muted">Sin expediciones recientes.</div>
        ) : (
          <div className="dashboard-recent-activity__content">
            <div className="dashboard-recent-activity__chart-wrap">
              <svg viewBox="0 0 640 180" role="img" aria-label="Tendencia semanal de expediciones">
                <path d={trendPath} />
              </svg>
              <div className="dashboard-recent-activity__chart-total">
                Total semana: <strong>{totalWeek}</strong>
              </div>
            </div>

            <div className="dashboard-recent-activity__list">
              {statuses.map((item) => (
                <div key={item.key} className="dashboard-recent-activity__item">
                  <div className={`dashboard-recent-activity__icon ${item.colorClass}`}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div className="dashboard-recent-activity__meta">
                    <h6>{item.label}</h6>
                    <p>Estado de expediciones</p>
                  </div>
                  <span className={`dashboard-recent-activity__badge ${item.colorClass}`}>+{item.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
