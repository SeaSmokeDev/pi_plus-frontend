import type { ExpeditionGroupList } from "../../types";

type ExpeditionCardProps = {
  expedition: ExpeditionGroupList;
  onQuickView: (expedition: ExpeditionGroupList) => void;
};

function formatStatusLabel(status: ExpeditionGroupList["estado"]): string {
  return status === "en_transito" ? "En transito" : status === "abierta" ? "Abierta" : "Recibida";
}

function getStatusClassName(status: ExpeditionGroupList["estado"]): string {
  if (status === "abierta") {
    return "text-bg-warning";
  }

  if (status === "en_transito") {
    return "bg-success-subtle text-success-emphasis";
  }

  return "bg-primary-subtle text-primary-emphasis";
}

function formatDateForView(value: string | null): string {
  if (!value) {
    return "Pendiente";
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export default function ExpeditionCard({ expedition, onQuickView }: ExpeditionCardProps) {
  

// console.log("ExpeditionCard render", { expedition, canEdit });
  return (
    <article className="card border-0 shadow-sm h-100">
      <div className="card-body p-3 d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div>
            <p className="text-muted text-uppercase small fw-semibold mb-1">Expedicion</p>
            <h2 className="h5 mb-0 fw-bold">#{expedition.referenciaExpedicion}</h2>
          </div>

          <div className="d-flex align-items-start gap-2">
            <span
              className={[
                "badge rounded-pill px-3 py-2 align-self-start",
                getStatusClassName(expedition.estado),
              ].join(" ")}
            >
              {formatStatusLabel(expedition.estado)}
            </span>
          </div>
        </div>

        <div className="row g-2">
          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Usuario asignado</div>
            <div className="fw-semibold">{expedition.username}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Destino</div>
            <div className="fw-semibold">{expedition.direccionDestino}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Fecha creacion</div>
            <div>{formatDateForView(expedition.fechaCreacion)}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Fecha recibida</div>
            <div>{formatDateForView(expedition.fechaRecepcion)}</div>
          </div>

          <div className="col-12 col-md-6">
            <div className="text-muted small mb-1">Fecha envio</div>
            <div>{formatDateForView(expedition.fechaEnvio)}</div>
          </div>
          <div className="col-12 col-md-6 mt-4">
            <div className="text-muted small mb-1">Total expediciones: {expedition.totalExpediciones}</div>
          </div>
        </div>
       <div className="d-flex justify-content-end border-top pt-3">
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => onQuickView(expedition)}
          >
            Vista rápida
          </button>
        </div>
      </div>
    </article>
  );
}
