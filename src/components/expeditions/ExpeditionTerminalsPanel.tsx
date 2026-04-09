import type { ExpeditionTerminalDetailItem } from "./types";

type ExpeditionTerminalsPanelProps = {
  source: "csv" | "ns";
  searchValue: string;
  terminals: ExpeditionTerminalDetailItem[];
  onSourceChange: (value: "csv" | "ns") => void;
  onSearchValueChange: (value: string) => void;
};

export default function ExpeditionTerminalsPanel({
  source,
  searchValue,
  terminals,
  onSourceChange,
  onSearchValueChange,
}: ExpeditionTerminalsPanelProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h2 className="h6 mb-0 fw-bold">Detalles de terminales vinculados a la expedicion</h2>
      </div>

      <div className="card-body d-flex flex-column gap-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-xl-3">
            <div className="form-check mb-2">
              <input
                id="terminal-source-csv"
                className="form-check-input"
                type="radio"
                checked={source === "csv"}
                onChange={() => onSourceChange("csv")}
              />
              <label className="form-check-label fw-semibold" htmlFor="terminal-source-csv">
                Desde CSV
              </label>
            </div>

            <button type="button" className="btn btn-outline-primary w-100">
              Elige un fichero
            </button>
          </div>

          <div className="col-12 col-xl-7">
            <div className="form-check mb-2">
              <input
                id="terminal-source-ns"
                className="form-check-input"
                type="radio"
                checked={source === "ns"}
                onChange={() => onSourceChange("ns")}
              />
              <label className="form-check-label fw-semibold" htmlFor="terminal-source-ns">
                N/S
              </label>
            </div>

            <input
              type="text"
              className="form-control"
              placeholder="Introduce numero de serie"
              value={searchValue}
              onChange={(event) => onSearchValueChange(event.target.value)}
            />
          </div>

          <div className="col-12 col-xl-2">
            <button type="button" className="btn btn-primary w-100">
              Agregar
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <h3 className="h5 mb-0 fw-bold">Terminales vinculados actualmente</h3>
          <span className="material-symbols-outlined text-primary">download</span>
        </div>

        <div className="text-center rounded-3 bg-info-subtle text-primary-emphasis px-3 py-2">
          Registros totales: {terminals.length}
        </div>

        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Modelo</th>
                <th>Entidad</th>
                <th>Estado</th>
                <th>Ubicacion</th>
                <th>Cobertura</th>
                <th>Nº Serie</th>
                <th className="text-end">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((terminal) => (
                <tr key={terminal.id}>
                  <td>{terminal.model}</td>
                  <td>{terminal.entity}</td>
                  <td>{terminal.status}</td>
                  <td>{terminal.location}</td>
                  <td>{terminal.coverage || "-"}</td>
                  <td>{terminal.serialNumber}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-sm btn-outline-danger">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
