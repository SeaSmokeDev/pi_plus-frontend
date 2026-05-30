import type { PaymentFormData } from "../../types";
import { editableTerminalStatusOptions } from "../../types";

type TerminalEditableFormProps = {
  isCreateMode: boolean;
  form: PaymentFormData;
  onChange: (field: keyof PaymentFormData, value: string) => void;
};

function TerminalEditableForm({ isCreateMode, form, onChange }: TerminalEditableFormProps) {
  return (
    <div className="mb-3">
      <h2 className="h6 mb-2">Datos editables</h2>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Estado</label>
          <select
            className="form-select"
            value={form.estado}
            onChange={(event) => onChange("estado", event.target.value)}
          >
            {editableTerminalStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Caja</label>
          <select className="form-select" value="" disabled>
            <option value="">
              {isCreateMode ? "Disponible despues de crear el terminal" : "Pendiente de conectar"}
            </option>
          </select>
        </div>

        <div className="col-12">
          <label className="form-label mb-1">Observaciones</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Añade notas sobre el estado del equipo, incidencias, accesorios, etc."
            value={form.notas}
            maxLength={250}
            onChange={(event) => onChange("notas", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default TerminalEditableForm;
