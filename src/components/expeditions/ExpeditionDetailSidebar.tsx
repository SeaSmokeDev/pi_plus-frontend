import type { ExpeditionDraftData } from "../../types";

type ExpeditionDetailSidebarProps = {
  title: string;
  submitLabel: string;
  form: ExpeditionDraftData;
  onChange: (field: keyof ExpeditionDraftData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function ExpeditionDetailSidebar({
  title,
  submitLabel,
  form,
  onChange,
  onSubmit,
  onCancel,
}: ExpeditionDetailSidebarProps) {

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h1 className="h5 mb-0 fw-bold">{title}</h1>
      </div>

      <div className="card-body d-flex flex-column gap-4">
        <h2 className="h6 fw-bold mb-1">Nº Expedicion: 123</h2>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label fw-semibold">Usuario Asignado</label>
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="text-primary-emphasis">{form.username}</div>
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
              <div className="text-primary-emphasis">
                {form.direccionDestino}
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">
              Fecha/Hora de envio
            </label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.fechaEnvio ?? ""}
              onChange={(event) => onChange("fechaEnvio", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Bultos</label>
            <input
              className="form-control"
              value={form.paquetes ?? ""}
              onChange={(event) => onChange("paquetes", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Kilos</label>
            <input
              className="form-control"
              value={form.peso ?? ""}
              onChange={(event) => onChange("peso", event.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Observaciones</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.notas ?? ""}
              onChange={(event) => onChange("notas", event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-footer bg-white d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          {submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
