type SNSearchDeleteConfirmModalProps = {
  isOpen: boolean;
  serialNumber?: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function SNSearchDeleteConfirmModal({
  isOpen,
  serialNumber,
  isDeleting,
  onCancel,
  onConfirm,
}: SNSearchDeleteConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
      <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h3 className="modal-title h5 mb-0">Confirmar eliminación</h3>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCancel} disabled={isDeleting} />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                ¿Seguro que quieres eliminar la terminal <strong>{serialNumber || ""}</strong>? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isDeleting}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
