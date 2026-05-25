export function GridCard({
  title,
  value,
  icon,
  loading,
  error,
}: {
  title: string;
  value: string;
  icon: string;
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-primary d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 32, height: 32, background: "#e7f1f6" }}
          >
            {icon}
          </span>
          {loading ? <h3 className="fw-bold mb-0">...</h3> : <h3 className="fw-bold mb-0">{value}</h3>}
        </div>
        <p className="card-text text-muted mb-0 fs-6">{title}</p>
        {error ? <div className="small text-danger mt-2">{error}</div> : null}
      </div>
    </div>
  );
}
