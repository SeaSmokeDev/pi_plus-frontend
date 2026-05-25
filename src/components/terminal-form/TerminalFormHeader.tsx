import { useNavigate } from "react-router-dom";

type TerminalFormHeaderProps = {
  isCreateMode: boolean;
};

function TerminalFormHeader({ isCreateMode }: TerminalFormHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="card-body border-bottom">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h1 className="h4 mb-1">Ficha equipo</h1>
          <p className="text-muted mb-0">
            {isCreateMode
              ? "Completa los campos para registrar un nuevo terminal."
              : "Revisa la información del terminal y actualiza los campos editables."}
          </p>
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TerminalFormHeader;
