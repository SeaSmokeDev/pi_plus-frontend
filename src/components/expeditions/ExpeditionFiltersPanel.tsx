import { useMemo, useState } from "react";
import type { ExpeditionFilters, SecurityUser } from "../../types";

type ExpeditionFiltersPanelProps = {
  filters: ExpeditionFilters;
  users: SecurityUser[];
  loadingUsers?: boolean;
  onFilterChange: (field: keyof ExpeditionFilters, value: string) => void;
};

const USER_RESULTS_LIMIT = 5;

export default function ExpeditionFiltersPanel({
  filters,
  users,
  loadingUsers = false,
  onFilterChange,
}: ExpeditionFiltersPanelProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalized = filters.username.trim().toLowerCase();

    return users
      .filter((user) => user.username.toLowerCase().includes(normalized))
      .slice(0, USER_RESULTS_LIMIT);
  }, [filters.username, users]);

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
              Fecha creada
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

          <div className="col-12 col-md-6 col-xl-3 position-relative">
            <label htmlFor="filter-assigned-user" className="form-label">
              Usuario asignado
            </label>
            <input
              id="filter-assigned-user"
              type="text"
              className="form-control"
              placeholder="Buscar por username"
              value={filters.username}
              onFocus={() => setIsUserDropdownOpen(true)}
              onBlur={() => {
                window.setTimeout(() => setIsUserDropdownOpen(false), 150);
              }}
              onChange={(event) => {
                onFilterChange("username", event.target.value);
                setIsUserDropdownOpen(true);
              }}
            />

            {isUserDropdownOpen && (
              <div
                className="position-absolute start-0 end-0 mt-1 bg-white border rounded-3 shadow-sm overflow-auto"
                style={{ zIndex: 20, maxHeight: "220px" }}
              >
                {loadingUsers && (
                  <div className="px-3 py-2 text-muted small">Cargando usuarios...</div>
                )}

                {!loadingUsers && filteredUsers.length === 0 && (
                  <div className="px-3 py-2 text-muted small">
                    No hay usuarios que coincidan.
                  </div>
                )}

                {!loadingUsers &&
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="dropdown-item px-3 py-2"
                      onMouseDown={() => {
                        onFilterChange("username", user.username);
                        setIsUserDropdownOpen(false);
                      }}
                    >
                      <div className="fw-semibold">{user.username}</div>
                      <div className="small text-muted">{user.email}</div>
                    </button>
                  ))}
              </div>
            )}
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
          <div className="col-12 col-md-6 col-xl-3">
            <label htmlFor="filter-status" className="form-label">
              Estado
            </label>
            <input
              id="filter-status"
              type="text"
              className="form-control"
              placeholder="Ej: Madrid"
              value={filters.estado}
              onChange={(event) => onFilterChange("estado", event.target.value)}
            />
          </div>
        </div>
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mt-4">
          <div className="d-flex justify-content-start">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                onFilterChange("fechaCreacion", "");
                onFilterChange("fechaRecepcion", "");
                onFilterChange("username", "");
                onFilterChange("direccionDestino", "");
                onFilterChange("estado", "");
              }}
            >
              Limpiar filtros
            </button>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-dark"
            >
              Busqueda profunda
            </button>
            <button
              type="button"
              className="btn btn-primary"
            >
              Aplicar a la lista actual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
