import { useNavigate } from "react-router-dom";
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
    return "bg-warning-subtle text-warning-emphasis";
  }

  if (status === "en_transito") {
    return "bg-primary-subtle text-primary-emphasis";
  }

  return "bg-success-subtle text-success-emphasis";
}

function getStatusDotClassName(status: ExpeditionGroupList["estado"]): string {
  if (status === "abierta") {
    return "bg-warning";
  }

  if (status === "en_transito") {
    return "bg-primary";
  }

  return "bg-success";
}

function formatDateForView(value: string | null, fallback: string): string {
  if (!value) return fallback;

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-");

  if (!year || !month || !day) {
    return value;
  }

  const monthLabels = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const monthLabel = monthLabels[Number(month) - 1] || month;

  return `${Number(day)} ${monthLabel} ${year}`;
}

function getInitials(username: string): string {
  const words = username.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] || "";
  const second = words.length > 1 ? words[1]?.[0] || "" : words[0]?.[1] || "";

  return `${first}${second}`.toUpperCase() || "US";
}

export default function ExpeditionCard({ expedition, onQuickView }: ExpeditionCardProps) {
  const navigate = useNavigate();
  const canEdit = expedition.estado === "abierta";
  const envioLabel =
    expedition.estado === "abierta"
      ? "Pendiente"
      : formatDateForView(expedition.fechaEnvio, "Pendiente");
  const recepcionLabel = formatDateForView(expedition.fechaRecepcion, "Pendiente de recibir");

  return (
    <article className="card shadow-sm h-100">
      <div className="card-body p-3 d-flex flex-column gap-3">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h2 className="h6 mb-0 fw-bold font-monospace">
              {expedition.referenciaExpedicion}
            </h2>

            <span
              className={[
                "badge rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2",
                getStatusClassName(expedition.estado),
              ].join(" ")}
            >
              <span
                className={[
                  "rounded-circle d-inline-block",
                  getStatusDotClassName(expedition.estado),
                ].join(" ")}
                style={{ width: 7, height: 7 }}
              />
              {formatStatusLabel(expedition.estado)}
            </span>

            <span className="badge rounded-pill bg-light text-dark border">
              {getInitials(expedition.username)}
            </span>

            <span className="fw-semibold">{expedition.username}</span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
            onClick={() => navigate(`/expeditions/${expedition.referenciaExpedicion}/edit`)}
            disabled={!canEdit}
            title={canEdit ? "Editar lote" : "Solo se pueden editar expediciones abiertas"}
          >
            <span className="material-symbols-outlined">edit_square</span>
            Editar
          </button>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 text-muted small">
          <span className="d-inline-flex align-items-center gap-1">
            <span className="material-symbols-outlined">location_on</span>
            <span>Destino</span>
            <span className="text-dark fw-semibold">{expedition.direccionDestino}</span>
          </span>

          <span className="d-inline-flex align-items-center gap-1">
            <span className="material-symbols-outlined">calendar_today</span>
            <span>Creacion</span>
            <span className="text-dark fw-semibold">
              {formatDateForView(expedition.fechaCreacion, "Pendiente")}
            </span>
          </span>

          <span className="d-inline-flex align-items-center gap-1">
            <span className="material-symbols-outlined">send</span>
            <span>Envio</span>
            <span className="text-dark fw-semibold">{envioLabel}</span>
          </span>

          <span className="d-inline-flex align-items-center gap-1">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Recepcion</span>
            <span className="text-dark fw-semibold">{recepcionLabel}</span>
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-end gap-3 mt-auto">
          <span className="badge text-bg-light border">
            {expedition.totalExpediciones} expedicion
            {expedition.totalExpediciones === 1 ? "" : "es"}
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-2"
            onClick={() => onQuickView(expedition)}
          >
            <span className="material-symbols-outlined">visibility</span>
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}
