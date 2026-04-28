import type { ExpeditionFilters } from "../../types";

type ExpeditionFiltersPanelProps = {
  filters: ExpeditionFilters;
  onFilterChange: (field: keyof ExpeditionFilters, value: string) => void;
};

export default function ExpeditionFiltersPanel({
  filters,
  onFilterChange,
}: ExpeditionFiltersPanelProps) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">filter_alt</span>
          <h2 className="h6 mb-0 fw-bold">Filtros avanzados</h2>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="filter-sent-date" className="form-label">
              Fecha enviada
            </label>
            <input
              id="filter-sent-date"
              type="date"
              className="form-control"
              value={filters.fechaCreacion}
              onChange={(event) => onFilterChange("fechaCreacion", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="filter-received-date" className="form-label">
              Fecha recibida
            </label>
            <input
              id="filter-received-date"
              type="date"
              className="form-control"
              value={filters.fechaRecepcion}
              onChange={(event) => onFilterChange("fechaRecepcion", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="filter-assigned-user" className="form-label">
              Usuario asignado
            </label>
            <input
              id="filter-assigned-user"
              type="number"
              className="form-control"
              placeholder="Ej: 2"
              value={filters.userId}
              onChange={(event) => onFilterChange("userId", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="filter-destination" className="form-label">
              Destino
            </label>
            <input
              id="filter-destination"
              type="text"
              className="form-control"
              placeholder="Ej: Madrid"
              value={filters.direccionDestino}
              onChange={(event) => onFilterChange("direccionDestino", event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
