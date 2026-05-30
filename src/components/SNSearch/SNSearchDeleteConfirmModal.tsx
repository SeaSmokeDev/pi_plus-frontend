type SNSearchDeleteConfirmModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SNSearchDeleteConfirmModal({
  isOpen,
  isLoading,
  title = "Confirmar acción",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "danger",
  onCancel,
  onConfirm,
}: SNSearchDeleteConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  const backdropZIndex = 2300;
  const modalZIndex = 2310;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: backdropZIndex }} />
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ zIndex: modalZIndex }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h3 className="modal-title h5 mb-0">{title}</h3>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancel} disabled={isLoading} />
            </div>

            <div className="modal-body">
              <p className="mb-0">{message}</p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isLoading}>
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`btn ${confirmVariant === "danger" ? "btn-danger" : "btn-primary"}`}
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
