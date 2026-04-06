import type { Expedition } from "./types";

type ExpeditionCardProps = {
  expedition: Expedition;
  onEdit?: (expedition: Expedition) => void;
};

function formatStatusLabel(status: Expedition["status"]): string {
  return status === "en_transito" ? "En transito" : status === "abierta" ? "Abierta" : "Recibida";
}

function getStatusClassName(status: Expedition["status"]): string {
  if (status === "abierta") {
    return "text-bg-warning";
  }

  if (status === "en_transito") {
    return "bg-success-subtle text-success-emphasis";
  }

  return "bg-primary-subtle text-primary-emphasis";
}

export default function ExpeditionCard({ expedition, onEdit }: ExpeditionCardProps) {
  const canEdit = expedition.status === "abierta";

  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body p-3 d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="text-muted text-uppercase small fw-semibold mb-1">Expedicion</p>
            <h2 className="h5 mb-0 fw-bold">{expedition.expeditionNumber}</h2>
          </div>

          <div className="d-flex align-items-start gap-2">
            {canEdit && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit?.(expedition)}
              >
                Editar
              </button>
            )}
            <span
              className={[
                "badge rounded-pill px-3 py-2 align-self-start",
                getStatusClassName(expedition.status),
              ].join(" ")}
            >
              {formatStatusLabel(expedition.status)}
            </span>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Asignado a</div>
            <div className="fw-semibold">{expedition.assignedTo}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Destino</div>
            <div className="fw-semibold">{expedition.destination}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Fecha enviada</div>
            <div>{expedition.sentDate}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Fecha recibida</div>
            <div>{expedition.receivedDate || "Pendiente"}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
