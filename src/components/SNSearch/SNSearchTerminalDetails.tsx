import SNSearchActionButton from "./bottons/SNSearchActionButton";
import {
  formatTerminalStatus,
  isTerminalLockedForManualActions,
  type Payment,
} from "../../types";

type SNSearchTerminalDetailsProps = {
  terminal: Payment;
  isDeleting: boolean;
  onDelete: () => void;
  onEdit: () => void;
  areActionsDisabled: boolean;
};

function getAvailabilityLabel(terminal: Payment): string {
  if (terminal.estado === "operativo") return "Libre";
  return formatTerminalStatus(terminal.estado);
}

function getAvailabilityDotClassName(terminal: Payment): string {
  if (terminal.estado === "operativo") return "bg-success";
  if (terminal.estado === "en_transito" || terminal.estado === "pendiente_transito") return "bg-warning";
  return "bg-secondary";
}

export default function SNSearchTerminalDetails({
  terminal,
  isDeleting,
  onDelete,
  onEdit,
  areActionsDisabled,
}: SNSearchTerminalDetailsProps) {
  const lockedReason = isTerminalLockedForManualActions(terminal.estado)
    ? "Terminal en flujo de expedicion: no se puede editar ni eliminar"
    : undefined;

  return (
    <section className="row g-4 align-items-stretch">
      <div className="col-12 col-xl-4 order-1 order-xl-2">
        <div className="sn-search-side-layout d-flex gap-3 h-100">
          <div className="card p-0 overflow-hidden sn-search-side-item">
            <img
              src="https://www.bbva.com.co/content/dam/public-web/colombia/images/blog/empresas/datafono-tradicional-bbva.im1767820150035im.jpg?imwidth=1176"
              alt="Terminal BBVA"
              className="sn-search-terminal-image"
            />
          </div>

          <div className="card p-4 sn-search-side-item d-flex justify-content-center">
            <div>
              <p className="text-uppercase text-muted fw-bold small mb-3">Estado del terminal</p>
              <p className="h4 fw-bold mb-2 d-flex align-items-center gap-2">
                <span className={`sn-search-status-dot ${getAvailabilityDotClassName(terminal)}`} />
                {getAvailabilityLabel(terminal)}
              </p>
              <p className="text-muted small mb-0">{formatTerminalStatus(terminal.estado)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-xl-8 order-2 order-xl-1">
        <div className="card h-100">
          <div className="card-header bg-transparent py-4 px-4 border-bottom">
            <h2 className="h4 fw-bold mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-terminal" aria-hidden="true" />
              Informacion del equipo
            </h2>
          </div>

          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Marca</label>
                <div className="form-control bg-light-subtle">{terminal.marca}</div>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Modelo</label>
                <div className="form-control bg-light-subtle">{terminal.modelo}</div>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Numero de serie (SN)</label>
                <div className="form-control bg-light-subtle">{terminal.numeroSerie}</div>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Estado</label>
                <div className="form-control bg-light-subtle">{formatTerminalStatus(terminal.estado)}</div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-end gap-3 mt-5">
              <SNSearchActionButton
                type="button"
                variant="outline-danger"
                className="px-4"
                onClick={onDelete}
                disabled={isDeleting || areActionsDisabled}
                title={lockedReason || "Eliminar equipo"}
                isLoading={isDeleting}
                loadingLabel="Eliminando..."
                label={
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-trash" aria-hidden="true" />
                    Eliminar
                  </span>
                }
              />
              <SNSearchActionButton
                type="button"
                className="sn-search-main-btn px-4"
                onClick={onEdit}
                disabled={isDeleting || areActionsDisabled}
                title={lockedReason || "Editar equipo"}
                label={
                  <span className="d-inline-flex align-items-center gap-2">
                    <i className="bi bi-pencil" aria-hidden="true" />
                    Editar
                  </span>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
