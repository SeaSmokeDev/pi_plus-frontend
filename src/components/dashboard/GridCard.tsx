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
    <div className="card h-100 border rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span
            className="material-symbols-outlined text-primary d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 32, height: 32, background: "var(--color-primary-light)" }}
          >
            {icon}
          </span>
        <p className="card-text text-muted mb-0 fs-6">{title}</p>
        {error ? <div className="small text-danger mt-2">{error}</div> : null}
        </div>
          {loading ? (
            <h3 className="fw-bold mb-0" style={{ color: "var(--color-text-primary)" }}>
              ...
            </h3>
          ) : (
            <h3 className="fw-bold mb-0 text-end" style={{ color: "var(--color-text-primary)" }}>
              {value}
            </h3>
          )}
      </div>
    </div>
  );
}
