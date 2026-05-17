import { useEffect, useState } from "react";
import {
  getAuthenticatedUser,
  getAuthUserFromCookie,
  type AuthUser,
} from "../../auth/session";
import { useUserId } from "../../hooks/useUserId";

type CreateExpeditionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
};

type FormState = {
  direccionDestino: string;
  fechaEnvio: string;
  paquetes: string;
  peso: string;
  notas: string;
};

const initialForm: FormState = {
  direccionDestino: "",
  fechaEnvio: "",
  paquetes: "",
  peso: "",
  notas: "",
};

const PENDING_EXPEDITION_STORAGE_KEY = "pending_expedition";

const originInfo = {
  title: "AL1 - ALMACEN DE ALICANTE (Alicante)",
  description: "ALMACEN@NECOMPLUS.COM",
};

export default function CreateExpeditionModal({
  isOpen,
  onClose,
  onContinue,
}: CreateExpeditionModalProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [destinationError, setDestinationError] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(() =>
    getAuthUserFromCookie(),
  );

  const {
    user,
    loadUserId,
  } = useUserId(authUser?.username);

  useEffect(() => {
    if (authUser) {
      return;
    }
    let isMounted = true;
    const loadUser = async () => {
      const user = await getAuthenticatedUser();
      if (isMounted && user) {
        setAuthUser(user);
      }
    };
    void loadUser();
    return () => {
      isMounted = false;
    };
  }, [authUser]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (field === "direccionDestino" && value.trim()) {
      setDestinationError("");
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setDestinationError("");
    onClose();
  };

  const handleSave = () => {
    if (!form.direccionDestino.trim()) {
      setDestinationError("El destino es obligatorio.");
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmContinue = async () => {
    if (!authUser?.username) {
      setDestinationError("No se ha encontrado el usuario autenticado.");
      return;
    }

    const resolvedUser = user ?? (await loadUserId(authUser.username));

    if (!resolvedUser) {
      setDestinationError("No se ha podido obtener el usuario.");
      return;
    }

    const pendingExpedition = {
      usuarioId: resolvedUser.id,
      direccionDestino: form.direccionDestino.trim(),
      peso: form.peso ? Number(form.peso) : null,
      paquetes: form.paquetes ? Number(form.paquetes) : null,
      notas: form.notas.trim() || null,
      fechaEnvio: form.fechaEnvio || null,
    };

    sessionStorage.setItem(
      PENDING_EXPEDITION_STORAGE_KEY,
      JSON.stringify(pendingExpedition),
    );



    setShowConfirmation(false);
    onContinue();
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h2 className="modal-title h5 mb-0">Creacion de expedicion</h2>
              <div className="ms-auto me-3 text-end">
                <div className="text-muted small">Creada por</div>
                <div className="fw-semibold">
                  {authUser?.username || "Usuario"}
                </div>
              </div>
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
                  <label htmlFor="origin" className="form-label fw-semibold">
                    Origen*
                  </label>
                </div>

                <div className="col-12 mt-0">
                  <div className="rounded-3 px-3 py-3 border border-info-subtle bg-info-subtle">
                    <div className="fw-semibold text-primary-emphasis">
                      {originInfo.title}
                    </div>
                    <div className="text-primary-emphasis">
                      {originInfo.description}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <label
                    htmlFor="destination"
                    className="form-label fw-semibold"
                  >
                    Destino*
                  </label>
                  <div className="input-group">
                    <input
                      id="destination"
                      type="text"
                      className={`form-control${destinationError ? " is-invalid" : ""}`}
                      placeholder="Introduce el destino de la expedicion"
                      value={form.direccionDestino}
                      onChange={(event) =>
                        handleChange("direccionDestino", event.target.value)
                      }
                    />
                    <span className="input-group-text">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                    </span>
                    {destinationError && (
                      <div className="invalid-feedback">{destinationError}</div>
                    )}
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
                    value={form.fechaEnvio}
                    onChange={(event) =>
                      handleChange("fechaEnvio", event.target.value)
                    }
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
                    placeholder="2"
                    value={form.paquetes}
                    onChange={(event) =>
                      handleChange("paquetes", event.target.value)
                    }
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
                    placeholder="0.00"
                    value={form.peso}
                    onChange={(event) =>
                      handleChange("peso", event.target.value)
                    }
                  />
                </div>

                <div className="col-12">
                  <label
                    htmlFor="observations"
                    className="form-label fw-semibold"
                  >
                    Observaciones
                  </label>
                  <textarea
                    id="observations"
                    className="form-control"
                    rows={4}
                    value={form.notas}
                    onChange={(event) =>
                      handleChange("notas", event.target.value)
                    }
                    placeholder="Añade aqui cualquier detalle relevante para la expedicion"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-success px-4"
                onClick={handleSave}
              >
                Crear
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={handleCancel}
              >
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
                  <h3 className="modal-title h5 mb-0">Confirmar destino</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setShowConfirmation(false)}
                  />
                </div>

                <div className="modal-body">
                  <p className="mb-3">
                    Confirma que el destino es correcto. Despues no se podra
                    cambiar.
                  </p>

                  <div className="rounded-3 bg-light border px-3 py-3 d-flex flex-column gap-2">
                    <div>
                      <span className="fw-semibold">Destino:</span>{" "}
                      {form.direccionDestino}
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
