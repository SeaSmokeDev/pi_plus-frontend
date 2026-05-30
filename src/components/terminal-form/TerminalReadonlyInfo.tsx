import type { PaymentFormData } from "../../types";

type TerminalReadonlyInfoProps = {
  isCreateMode: boolean;
  terminalSN?: string;
  form: PaymentFormData;
  brands: string[];
  models: string[];
  loadingBrands?: boolean;
  loadingModels?: boolean;
  onChange: (field: keyof PaymentFormData, value: string) => void;
};

function TerminalReadonlyInfo({
  isCreateMode,
  terminalSN,
  form,
  brands,
  models,
  loadingBrands = false,
  loadingModels = false,
  onChange,
}: TerminalReadonlyInfoProps) {
  return (
    <div className="mb-4">
      <h2 className="h6 mb-3">Informacion del equipo</h2>

      {!isCreateMode && terminalSN && (
        <div className="rounded-3 border bg-light-subtle p-3 mb-3">
          <div className="text-muted small mb-1">Numero de serie</div>
          <div className="h4 fw-bold mb-0 font-monospace">{terminalSN}</div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Marca</label>
          {isCreateMode ? (
            <select
              className="form-select"
              value={form.marca}
              onChange={(event) => onChange("marca", event.target.value)}
              disabled={loadingBrands}
            >
              <option value="">{loadingBrands ? "Cargando marcas..." : "Selecciona marca"}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          ) : (
            <input type="text" className="form-control" value={form.marca} readOnly />
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Modelo</label>
          {isCreateMode ? (
            <select
              className="form-select"
              value={form.modelo}
              onChange={(event) => onChange("modelo", event.target.value)}
              disabled={!form.marca || loadingModels}
            >
              <option value="">
                {!form.marca ? "Selecciona una marca primero" : loadingModels ? "Cargando modelos..." : "Selecciona modelo"}
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          ) : (
            <input type="text" className="form-control" value={form.modelo} readOnly />
          )}
        </div>
      </div>
    </div>
  );
}

export default TerminalReadonlyInfo;
