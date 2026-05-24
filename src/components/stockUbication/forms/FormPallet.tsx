import { useState } from "react";
import type { PalletMaterial, PalletType } from "../../../services/palletService";

interface NuevoPalePayload {
  descripcion: string;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas: number;
}

interface FormPalletProps {
  idHueco: number;
  onSubmit: (data: NuevoPalePayload) => Promise<void> | void;
  onCancel: () => void;
  canSubmit?: boolean;
  blockedMessage?: string;
}

const CAPACIDAD_FIJA = 8;

export default function FormPallet({ idHueco, onSubmit, onCancel, canSubmit = true, blockedMessage }: FormPalletProps) {
  const [descripcion, setDescripcion] = useState("");
  const [material, setMaterial] = useState<PalletMaterial | "">("");
  const [tipo, setTipo] = useState<PalletType | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!material || !tipo) {
      setErrorMessage("Selecciona material y tipo.");
      return;
    }
    if (!canSubmit) {
      setErrorMessage(blockedMessage || "La ubicación seleccionada no tiene ID real de almacén");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await onSubmit({
        descripcion: descripcion.trim(),
        material,
        tipo,
        capacidadMaxCajas: CAPACIDAD_FIJA,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo crear el palé.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stock-pallet-form">
      <h4 className="mb-3 stock-pallet-form__title">Añadir palé al hueco</h4>

      <div className="mb-3 stock-pallet-form__group" key={`idUbicacionAlmacen-${idHueco}`}>
        <label className="form-label">Material</label>
        <select className="form-select" value={material} onChange={(e) => setMaterial(e.target.value as PalletMaterial | "")} required>
          <option value="">Selecciona un material</option>
          <option value="madera">Madera</option>
          <option value="plastico">Plástico</option>
        </select>
      </div>

      <div className="mb-3 stock-pallet-form__group">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value as PalletType | "")} required>
          <option value="">Selecciona un tipo</option>
          <option value="europeo">Europeo</option>
          <option value="americano">Americano</option>
        </select>
      </div>

      <div className="mb-3 stock-pallet-form__group">
        <label className="form-label">Capacidad máxima de cajas</label>
        <input className="form-control" value={CAPACIDAD_FIJA} readOnly />
      </div>

      <div className="mb-3 stock-pallet-form__group">
        <label className="form-label">Descripción (opcional)</label>
        <input
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Palet recepción Verifone"
        />
      </div>

      {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
      {!canSubmit && blockedMessage && <div className="alert alert-warning py-2">{blockedMessage}</div>}

      <div className="d-flex gap-2 stock-pallet-form__actions">
        <button type="submit" className="btn stock-pallet-form__btn stock-pallet-form__btn--save" disabled={isSubmitting || !canSubmit}>
          <i className="bi bi-check2-circle" aria-hidden="true" />
          {isSubmitting ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn stock-pallet-form__btn stock-pallet-form__btn--cancel" onClick={onCancel} disabled={isSubmitting}>
          <i className="bi bi-x-circle" aria-hidden="true" />
          Cancelar
        </button>
      </div>
    </form>
  );
}
