type TerminalEditableFormProps = {
  isCreateMode: boolean;
};

function TerminalEditableForm({ isCreateMode }: TerminalEditableFormProps) {
  return (
    <div className="mb-3">
      <h2 className="h6 mb-2">Datos editables</h2>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Estado</label>
          <select className="form-select" defaultValue={isCreateMode ? "Pend_Revisar" : "Pend_Revisar"}>
            <option value="Pend_Revisar">Pend. Revisar</option>
            <option value="Pend_Laboratorio">Pend. Laboratorio</option>
            <option value="Nivel_1">Nivel 1</option>
            <option value="Operativo">Operativo</option>
            <option value="Operativo_Pend_Acc">Operativo-Pend. Accesorios</option>
          </select>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Almacen</label>
          <input type="text" className="form-control" placeholder="Ej: AL1" defaultValue={isCreateMode ? "" : "AL1"} />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Ubicación</label>
          <input type="text" className="form-control" placeholder="Ej: A32S21" defaultValue={isCreateMode ? "" : "A32S21"} />
          <div className="form-text">Formato recomendado: Pasillo-Columna-Entidad-Altura-Caja (ej. A32S21).</div>
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label mb-1">Caja</label>
          <input type="text" className="form-control" placeholder="Ej: Caja 12" defaultValue={isCreateMode ? "" : "Caja 12"} />
        </div>

        <div className="col-12">
          <label className="form-label mb-1">Observaciones</label>
          <textarea
            className="form-control"
            rows={4}
            placeholder="Añade notas sobre el estado del equipo, incidencias, accesorios, etc."
            defaultValue={isCreateMode ? "" : "Pantalla con pequeñas marcas. Revisar cargador."}
          />
        </div>
      </div>
    </div>
  );
}

export default TerminalEditableForm;
