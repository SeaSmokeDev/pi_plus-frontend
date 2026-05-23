import type { FormEvent } from "react";
import SNSearchActionButton from "./bottons/SNSearchActionButton";

type SNSearchSearchCardProps = {
  searchSN: string;
  onSearchSNChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  onAdd: () => void;
  isSearching: boolean;
};

export default function SNSearchSearchCard({
  searchSN,
  onSearchSNChange,
  onSubmit,
  onClear,
  onAdd,
  isSearching,
}: SNSearchSearchCardProps) {
  return (
    <section className="card border sn-search-toolbar-card mb-4">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-start align-items-lg-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Búsqueda por Serie Numérica</h1>
            <p className="text-muted mb-0">Escanea o introduce el SN para localizar el equipo.</p>
          </div>
          <SNSearchActionButton
            type="button"
            className="sn-search-main-btn px-4 d-none d-lg-inline-flex"
            onClick={onAdd}
            label={
              <span className="d-inline-flex align-items-center gap-2">
                <i className="bi bi-plus-lg" aria-hidden="true" />
                Agregar Equipo
              </span>
            }
          />
        </div>

        <form onSubmit={onSubmit}>
          <div className="d-flex flex-column flex-lg-row gap-3 align-items-stretch">
            <div className="input-group sn-search-input-group flex-grow-1">
              <span className="input-group-text bg-transparent border-0">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Buscar por serie numérica..."
                value={searchSN}
                onChange={(event) => onSearchSNChange(event.target.value)}
              />
              <SNSearchActionButton
                type="button"
                variant="light"
                className="px-4 border-start rounded-0"
                onClick={onClear}
                label="Limpiar"
              />
            </div>

            <SNSearchActionButton
              type="submit"
              className="sn-search-main-btn sn-search-submit-btn px-4 d-none d-lg-inline-flex"
              isLoading={isSearching}
              loadingLabel="Buscando..."
              label="Buscar"
            />
          </div>

          <div className="d-flex d-lg-none gap-2 mt-3">
            <SNSearchActionButton
              type="button"
              className="sn-search-main-btn flex-fill"
              onClick={onAdd}
              label={
                <span className="d-inline-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-plus-lg" aria-hidden="true" />
                  Agregar
                </span>
              }
            />
            <SNSearchActionButton
              type="submit"
              className="sn-search-main-btn flex-fill"
              isLoading={isSearching}
              loadingLabel="Buscando..."
              label="Buscar"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
