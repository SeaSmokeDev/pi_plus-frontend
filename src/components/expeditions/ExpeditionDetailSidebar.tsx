import type { ExpeditionDetailFormData } from "../../types";

type ExpeditionDetailSidebarProps = {
  title: string;
  reference?: string | null;
  form: ExpeditionDetailFormData;
  onChange: (field: keyof ExpeditionDetailFormData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onConfirm: () => void;
  saving?: boolean;
  confirming?: boolean;
};

export default function ExpeditionDetailSidebar({
  title,
  reference,
  form,
  onChange,
  onSave,
  onConfirm,
  onCancel,
  saving = false,
  confirming = false,
}: ExpeditionDetailSidebarProps) {
  const isSubmitting = saving || confirming;

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h1 className="h5 mb-0 fw-bold">{title}</h1>
      </div>

      <div className="card-body d-flex flex-column gap-4">
        <h2 className="h6 fw-bold mb-1">
          N. Expedicion: {reference || "Pendiente de generar"}
        </h2>

        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Usuario asignado</label>
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="text-primary-emphasis">{form.username || "Sin usuario"}</div>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Origen</label>
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="text-primary-emphasis">Almacen AL-1</div>
            </div>
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Destino</label>
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="text-primary-emphasis">{form.direccionDestino}</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Bultos</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.paquetes ?? ""}
              onChange={(event) => onChange("paquetes", event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Kilos</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={form.peso ?? ""}
              onChange={(event) => onChange("peso", event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Observaciones</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.notas ?? ""}
              onChange={(event) => onChange("notas", event.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      <div className="card-footer bg-white d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </button>

        <button type="button" className="btn btn-outline-primary" onClick={onSave} disabled={isSubmitting}>
          {saving ? "Guardando..." : "Guardar expedicion"}
        </button>

        <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={isSubmitting}>
          {confirming ? "Confirmando..." : "Confirmar expedicion"}
        </button>
      </div>
    </section>
  );
}
