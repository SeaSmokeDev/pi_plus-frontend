import "../../styles/DashboardWarehouseOccupation.scss";

type OccupationSummary = {
  total: number;
  ocupados: number;
  libres: number;
  media: number;
};

type PasilloDistribution = {
  pasillo: number;
  total: number;
  ocupados: number;
  libres: number;
};

export default function WarehouseOccupationChart({
  loading,
  error,
  ocupacion,
  distribucionPasillo,
}: {
  loading: boolean;
  error: string | null;
  ocupacion: OccupationSummary;
  distribucionPasillo: PasilloDistribution[];
}) {
  const max = Math.max(1, ...distribucionPasillo.map((item) => Math.max(item.ocupados, item.libres)));

  return (
    <div className="card shadow-sm dashboard-warehouse-occupation">
      <div className="card-body p-4">
        <div className="dashboard-warehouse-occupation__header">
          <h3 className="dashboard-warehouse-occupation__title">Ocupación almacén</h3>
          <p className="dashboard-warehouse-occupation__subtitle">Distribución por pasillo</p>
        </div>

        {loading ? (
          <div className="text-muted">Cargando...</div>
        ) : error ? (
          <div className="text-danger small">{error}</div>
        ) : (
          <>
            <div className="dashboard-warehouse-occupation__stats">
              <div className="dashboard-warehouse-occupation__stat">
                <span>Huecos totales</span>
                <strong>{ocupacion.total}</strong>
              </div>
              <div className="dashboard-warehouse-occupation__stat">
                <span>Ocupados</span>
                <strong>{ocupacion.ocupados}</strong>
              </div>
              <div className="dashboard-warehouse-occupation__stat">
                <span>Libres</span>
                <strong>{ocupacion.libres}</strong>
              </div>
              <div className="dashboard-warehouse-occupation__stat">
                <span>Ocupación media</span>
                <strong>{ocupacion.media}%</strong>
              </div>
            </div>

            {distribucionPasillo.length === 0 ? (
              <div className="text-muted">Sin datos de pasillos.</div>
            ) : (
              <div className="dashboard-warehouse-occupation__chart">
                {distribucionPasillo.map((item) => {
                  const hOcupados = Math.max(6, (item.ocupados / max) * 100);
                  const hLibres = Math.max(6, (item.libres / max) * 100);

                  return (
                    <div key={item.pasillo} className="dashboard-warehouse-occupation__col">
                      <div className="dashboard-warehouse-occupation__bars">
                        <div className="dashboard-warehouse-occupation__bar dashboard-warehouse-occupation__bar--ocupados" style={{ height: `${hOcupados}%` }} title={`Ocupados: ${item.ocupados}`} />
                        <div className="dashboard-warehouse-occupation__bar dashboard-warehouse-occupation__bar--libres" style={{ height: `${hLibres}%` }} title={`Libres: ${item.libres}`} />
                      </div>
                      <div className="dashboard-warehouse-occupation__label">P{item.pasillo}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

