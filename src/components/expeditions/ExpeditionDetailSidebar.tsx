import type { ExpeditionDetailData } from "./types";

type ExpeditionDetailSidebarProps = {
  title: string;
  submitLabel: string;
  form: ExpeditionDetailData;
  onChange: (field: keyof ExpeditionDetailData, value: string) => void;
  onCancel: () => void;
};

export default function ExpeditionDetailSidebar({
  title,
  submitLabel,
  form,
  onChange,
  onCancel,
}: ExpeditionDetailSidebarProps) {
  return (
    <section className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h1 className="h5 mb-0 fw-bold">{title}</h1>
      </div>

      <div className="card-body d-flex flex-column gap-4">
        <div>
          <h2 className="h6 fw-bold mb-3">Nº Expedicion {form.expeditionNumber}</h2>
          <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
            <div className="fw-semibold text-primary-emphasis">
              Estado de la expedicion: {form.currentStatusLabel}
            </div>
            <div className="text-primary-emphasis">
              [{form.currentStatusDate} {form.assignedTo}]
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-12 col-xxl-6">
            <label className="form-label fw-semibold">Tipo Origen</label>
            <select
              className="form-select"
              value={form.originType}
              onChange={(event) => onChange("originType", event.target.value)}
              disabled
            >
              <option>Almacen</option>
              <option>Tienda</option>
              <option>Delegacion</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-12 col-xxl-6">
            <label className="form-label fw-semibold">Origen*</label>
            <div className="input-group">
              <input
                className="form-control"
                value={form.originCode}
                onChange={(event) => onChange("originCode", event.target.value)}
                readOnly
              />
              <span className="input-group-text">
                <span className="material-symbols-outlined">warehouse</span>
              </span>
            </div>
          </div>

          <div className="col-12">
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="fw-semibold text-primary-emphasis">{form.originInfoTitle}</div>
              <div className="text-primary-emphasis">{form.originInfoDescription}</div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-xl-12 col-xxl-6">
            <label className="form-label fw-semibold">Tipo Destino</label>
            <select
              className="form-select"
              value={form.destinationType}
              onChange={(event) => onChange("destinationType", event.target.value)}
              disabled
            >
              <option>Almacen</option>
              <option>Tienda</option>
              <option>Delegacion</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-xl-12 col-xxl-6">
            <label className="form-label fw-semibold">Destino*</label>
            <div className="input-group">
              <input
                className="form-control"
                value={form.destinationCode}
                onChange={(event) => onChange("destinationCode", event.target.value)}
                readOnly
              />
              <span className="input-group-text">
                <span className="material-symbols-outlined">location_on</span>
              </span>
            </div>
          </div>

          <div className="col-12">
            <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
              <div className="fw-semibold text-primary-emphasis">{form.destinationInfoTitle}</div>
              <div className="text-primary-emphasis">{form.destinationInfoDescription}</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Fecha/Hora de envio</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.sentAt}
              onChange={(event) => onChange("sentAt", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Fecha/Hora Prevista recepcion</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.expectedReceptionAt}
              onChange={(event) => onChange("expectedReceptionAt", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Bultos</label>
            <input
              className="form-control"
              value={form.packages}
              onChange={(event) => onChange("packages", event.target.value)}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label fw-semibold">Kilos</label>
            <input
              className="form-control"
              value={form.kilos}
              onChange={(event) => onChange("kilos", event.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Observaciones</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.observations}
              onChange={(event) => onChange("observations", event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-footer bg-white d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </section>
  );
}
