import type { PaymentFormData, TerminalCurrentBox } from "../../types";
import { editableTerminalStatusOptions } from "../../types";

type TerminalEditableFormProps = {
  isCreateMode: boolean;
  form: PaymentFormData;
  currentBox?: TerminalCurrentBox | null;
  onChange: (field: keyof PaymentFormData, value: string) => void;
};

function formatCurrentBox(box: TerminalCurrentBox | null | undefined): string {
  return box ? `${box.etiqueta} - ${box.modeloProducto}` : "Sin caja asignada";
}

function TerminalEditableForm({ isCreateMode, form, currentBox, onChange }: TerminalEditableFormProps) {
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

        {!isCreateMode && (
          <div className="col-12 col-md-6">
            <label className="form-label mb-1">Caja</label>
            <input className="form-control" value={formatCurrentBox(currentBox)} readOnly />
          </div>
        )}

        <div className="col-12">
          <label className="form-label mb-1">Observaciones</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Anade notas sobre el estado del equipo, incidencias, accesorios, etc."
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
