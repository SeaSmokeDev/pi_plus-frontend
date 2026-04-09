import { useState } from "react";

type CreateExpeditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
};

type FormState = {
  originType: string;
  origin: string;
  destinationType: string;
  destination: string;
  sentAt: string;
  expectedReceptionAt: string;
  packages: string;
  kilos: string;
  observations: string;
};

const initialFormState: FormState = {
  originType: "Almacen",
  origin: "AL1",
  destinationType: "Almacen",
  destination: "al48-lectus",
  sentAt: "2026-04-06T08:30",
  expectedReceptionAt: "2026-04-06T17:00",
  packages: "",
  kilos: "",
  observations: "",
};

const originInfo = {
  title: "AL1 - ALMACEN DE ALICANTE (Alicante)",
  description: "ALMACEN@NECOMPLUS.COM",
};

const destinationInfo = {
  title: "al48-lectus - Lectus (Barcelona)",
  description: "f.l.martinez@hotmail.es · a.amezcua.rodriguez@gmail.com · lectus2012sl@gmail.com",
};

export default function CreateExpeditionModal({
  isOpen,
  onClose,
  onContinue,
}: CreateExpeditionModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setForm(initialFormState);
    setShowConfirmation(false);
    onClose();
  };

  const handleSave = () => {
    setShowConfirmation(true);
  };

  const handleConfirmContinue = () => {
    setForm(initialFormState);
    setShowConfirmation(false);
    onContinue();
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h2 className="modal-title h5 mb-0">Creacion de expedicion</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={handleCancel}
              />
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <label htmlFor="origin-type" className="form-label fw-semibold">
                    Tipo Origen
                  </label>
                  <select
                    id="origin-type"
                    className="form-select"
                    value={form.originType}
                    onChange={(event) => handleChange("originType", event.target.value)}
                  >
                    <option>Almacen</option>
                    <option>Tienda</option>
                    <option>Delegacion</option>
                  </select>
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="origin" className="form-label fw-semibold">
                    Origen*
                  </label>
                  <div className="input-group">
                    <input
                      id="origin"
                      type="text"
                      className="form-control"
                      value={form.origin}
                      onChange={(event) => handleChange("origin", event.target.value)}
                    />
                    <span className="input-group-text">
                      <span className="material-symbols-outlined">warehouse</span>
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
                    <div className="fw-semibold text-primary-emphasis">{originInfo.title}</div>
                    <div className="text-primary-emphasis">{originInfo.description}</div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="destination-type" className="form-label fw-semibold">
                    Tipo Destino
                  </label>
                  <select
                    id="destination-type"
                    className="form-select"
                    value={form.destinationType}
                    onChange={(event) => handleChange("destinationType", event.target.value)}
                  >
                    <option>Almacen</option>
                    <option>Tienda</option>
                    <option>Delegacion</option>
                  </select>
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="destination" className="form-label fw-semibold">
                    Destino*
                  </label>
                  <div className="input-group">
                    <input
                      id="destination"
                      type="text"
                      className="form-control"
                      value={form.destination}
                      onChange={(event) => handleChange("destination", event.target.value)}
                    />
                    <span className="input-group-text">
                      <span className="material-symbols-outlined">location_on</span>
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
                    <div className="fw-semibold text-primary-emphasis">{destinationInfo.title}</div>
                    <div className="text-primary-emphasis">{destinationInfo.description}</div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="sent-at" className="form-label fw-semibold">
                    Fecha/Hora de envio
                  </label>
                  <input
                    id="sent-at"
                    type="datetime-local"
                    className="form-control"
                    value={form.sentAt}
                    onChange={(event) => handleChange("sentAt", event.target.value)}
                  />
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="expected-reception-at" className="form-label fw-semibold">
                    Fecha/Hora prevista recepcion
                  </label>
                  <input
                    id="expected-reception-at"
                    type="datetime-local"
                    className="form-control"
                    value={form.expectedReceptionAt}
                    onChange={(event) => handleChange("expectedReceptionAt", event.target.value)}
                  />
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="packages" className="form-label fw-semibold">
                    Bultos
                  </label>
                  <input
                    id="packages"
                    type="number"
                    min="0"
                    className="form-control"
                    value={form.packages}
                    onChange={(event) => handleChange("packages", event.target.value)}
                  />
                </div>

                <div className="col-12 col-lg-6">
                  <label htmlFor="kilos" className="form-label fw-semibold">
                    Kilos
                  </label>
                  <input
                    id="kilos"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={form.kilos}
                    onChange={(event) => handleChange("kilos", event.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="observations" className="form-label fw-semibold">
                    Observaciones
                  </label>
                  <textarea
                    id="observations"
                    className="form-control"
                    rows={4}
                    value={form.observations}
                    onChange={(event) => handleChange("observations", event.target.value)}
                    placeholder="Anade aqui cualquier detalle relevante para la expedicion"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-success px-4" onClick={handleSave}>
                Crear
              </button>
              <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1060 }} />
          <div
            className="modal d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ zIndex: 1070 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">Confirmar origen y destino</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setShowConfirmation(false)}
                  />
                </div>

                <div className="modal-body">
                  <p className="mb-3">
                    Confirma que el origen y el destino son correctos. Despues no se podran cambiar.
                  </p>

                  <div className="rounded-3 bg-light border px-3 py-3 d-flex flex-column gap-2">
                    <div>
                      <span className="fw-semibold">Origen:</span> {form.origin}
                    </div>
                    <div>
                      <span className="fw-semibold">Destino:</span> {form.destination}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Revisar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleConfirmContinue}
                  >
                    Confirmar y continuar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
