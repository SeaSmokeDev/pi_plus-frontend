type ExpeditionSearchBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  showAdvancedFilters: boolean;
  onToggleAdvancedFilters: () => void;
};

export default function ExpeditionSearchBar({
  searchValue,
  onSearchChange,
  showAdvancedFilters,
  onToggleAdvancedFilters,
}: ExpeditionSearchBarProps) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg">
            <label htmlFor="expedition-search" className="form-label fw-semibold">
              Buscar expedicion
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                id="expedition-search"
                type="text"
                className="form-control"
                placeholder="Buscar por numero de expedicion"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 d-inline-flex align-items-center justify-content-center gap-2"
              onClick={onToggleAdvancedFilters}
            >
              <span className="material-symbols-outlined">tune</span>
              {showAdvancedFilters ? "Ocultar filtros" : "Mas opciones"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
