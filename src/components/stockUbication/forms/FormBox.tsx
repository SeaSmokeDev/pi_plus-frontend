import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { WarehouseMapItem } from "../../../types/warehouseMap.types";
import { getMaxCapacityByModel, getTerminalBrands, getTerminalModelsByBrand } from "../../../services/terminalCatalogService";

export type FormBoxMode = "registered" | "manual";

export interface NuevaCajaPayload {
  etiqueta: string;
  modelo: string;
  marca: string;
  unidades: number;
  capacidadTotal: number;
  idPale: number | null;
}

interface FormBoxProps {
  hueco: WarehouseMapItem;
  mode: FormBoxMode;
  onSubmit: (data: NuevaCajaPayload) => Promise<void>;
  onCancel: () => void;
  onBack: () => void;
}

type FormState = {
  etiqueta: string;
  marca: string;
  modelo: string;
  unidades: number;
  capacidadTotal: number | null;
  idPale: number | null;
};

function buildEtiqueta(hueco: WarehouseMapItem): string {
  const numeroPasillo = String(hueco.pasillo.numero);
  const estanteria = String(hueco.estanteria.descripcion ?? "").trim().toUpperCase();
  const nivel = String(hueco.estanteria.nivel);
  const numeroCaja = String((hueco.cajas?.length ?? 0) + 1);
  return `${numeroPasillo}-${estanteria}-${nivel}-${numeroCaja}`;
}

function FormBox({ hueco, mode, onSubmit, onCancel, onBack }: FormBoxProps) {
  const [form, setForm] = useState<FormState>({
    etiqueta: buildEtiqueta(hueco),
    marca: "",
    modelo: "",
    unidades: 0,
    capacidadTotal: null,
    idPale: hueco.pale?.id ?? null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [catalogError, setCatalogError] = useState("");
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelosPorMarca, setModelosPorMarca] = useState<string[]>([]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      etiqueta: buildEtiqueta(hueco),
    }));
  }, [hueco]);

  useEffect(() => {
    let cancelled = false;

    const loadBrands = async () => {
      try {
        setIsLoadingCatalog(true);
        setCatalogError("");
        const brands = await getTerminalBrands();
        if (!cancelled) {
          setMarcas(brands);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "No se pudieron cargar las marcas.";
          setCatalogError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCatalog(false);
        }
      }
    };

    void loadBrands();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadModels = async () => {
      if (!form.marca) {
        setModelosPorMarca([]);
        return;
      }

      try {
        setIsLoadingCatalog(true);
        setCatalogError("");
        const models = await getTerminalModelsByBrand(form.marca);
        if (!cancelled) {
          setModelosPorMarca(models);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "No se pudieron cargar los modelos.";
          setCatalogError(message);
          setModelosPorMarca([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCatalog(false);
        }
      }
    };

    void loadModels();

    return () => {
      cancelled = true;
    };
  }, [form.marca]);

  useEffect(() => {
    let cancelled = false;

    const loadMaxCapacity = async () => {
      if (!form.modelo || mode === "manual") {
        setForm((prev) => ({ ...prev, capacidadTotal: null }));
        return;
      }

      try {
        setIsLoadingCatalog(true);
        const maxCapacity = await getMaxCapacityByModel(form.modelo);
        if (!cancelled) {
          setForm((prev) => ({ ...prev, capacidadTotal: maxCapacity }));
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "No se pudo obtener la capacidad máxima.";
          setCatalogError(message);
          setForm((prev) => ({ ...prev, capacidadTotal: null }));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCatalog(false);
        }
      }
    };

    void loadMaxCapacity();

    return () => {
      cancelled = true;
    };
  }, [form.modelo, mode]);

  const handleMarcaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const marca = event.target.value;
    setForm((prev) => ({
      ...prev,
      marca,
      modelo: "",
      capacidadTotal: prev.capacidadTotal,
    }));
  };

  const handleModeloChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const modelo = event.target.value;
    setForm((prev) => ({
      ...prev,
      modelo,
    }));
  };

  const handleUnidadesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const normalized = rawValue.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
    const value = Number(normalized);
    setForm((prev) => ({
      ...prev,
      unidades: normalized === "" ? 0 : Number.isFinite(value) ? value : 0,
    }));
  };

  const capacidadActual = form.capacidadTotal;
  const unidadesInvalidas = mode === "registered" && capacidadActual !== null && form.unidades > capacidadActual;

  const canSubmit =
    Boolean(form.etiqueta.trim()) &&
    Boolean(form.marca.trim()) &&
    Boolean(form.modelo.trim()) &&
    capacidadActual !== null &&
    capacidadActual > 0 &&
    (mode === "manual" || form.unidades >= 0) &&
    !unidadesInvalidas;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!canSubmit || capacidadActual === null) {
      setErrorMessage("Revisa los datos obligatorios antes de guardar.");
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({
        etiqueta: form.etiqueta.trim(),
        modelo: form.modelo.trim(),
        marca: form.marca.trim(),
        unidades: mode === "manual" ? 0 : form.unidades,
        capacidadTotal: capacidadActual,
        idPale: form.idPale,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la caja.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stock-box-form">
      <div className="mb-3 stock-box-form__group">
        <label className="form-label">Etiqueta</label>
        <input className="form-control" value={form.etiqueta} readOnly required />
        <div className="form-text">Formato: Pasillo-Estantería-Nivel-NºCaja (ej: 2-C-1-3)</div>
      </div>

      <div className="mb-3 stock-box-form__group">
        <label className="form-label">Marca</label>
        <select className="form-select" value={form.marca} onChange={handleMarcaChange} required disabled={isLoadingCatalog || marcas.length === 0}>
          <option value="">{isLoadingCatalog ? "Cargando marcas..." : "Selecciona una marca"}</option>
          {marcas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 stock-box-form__group">
        <label className="form-label">Modelo</label>
        <select className="form-select" value={form.modelo} onChange={handleModeloChange} required disabled={!form.marca || isLoadingCatalog}>
          <option value="">{form.marca ? "Selecciona un modelo" : "Selecciona una marca primero"}</option>
          {modelosPorMarca.map((modelo) => (
            <option key={modelo} value={modelo}>
              {modelo}
            </option>
          ))}
        </select>
      </div>

      {mode === "registered" && (
        <div className="mb-3 stock-box-form__group">
          <label className="form-label">Unidades</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={`form-control ${unidadesInvalidas ? "is-invalid" : ""}`}
            value={String(form.unidades)}
            onChange={handleUnidadesChange}
            aria-label="Unidades"
          />
          {unidadesInvalidas && <div className="invalid-feedback">No puede superar la capacidad máxima ({capacidadActual})</div>}
        </div>
      )}

      <div className="mb-3 stock-box-form__group">
        <label className="form-label">Capacidad máxima</label>
        {mode === "registered" ? (
          <input
            type="number"
            className="form-control"
            value={form.capacidadTotal ?? ""}
            readOnly
            placeholder={form.modelo ? "Calculando capacidad..." : "Selecciona un modelo"}
            required={false}
          />
        ) : (
          <input
            type="number"
            className="form-control"
            value={form.capacidadTotal ?? ""}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                capacidadTotal: Number.isFinite(Number(event.target.value)) ? Number(event.target.value) : null,
              }))
            }
            min={1}
            placeholder="Introduce capacidad máxima"
            required
          />
        )}
      </div>

      {catalogError && <div className="alert alert-warning py-2">{catalogError}</div>}
      {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}

      <div className="d-flex gap-2 stock-box-form__actions">
        <button className="btn stock-box-form__btn stock-box-form__btn--back" type="button" onClick={onBack} disabled={isSaving}>
          <i className="bi bi-arrow-left-short" aria-hidden="true" />
          Volver
        </button>
        <button className="btn stock-box-form__btn stock-box-form__btn--save" type="submit" disabled={!canSubmit || isSaving || Boolean(catalogError)}>
          <i className="bi bi-check2-circle" aria-hidden="true" />
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="btn stock-box-form__btn stock-box-form__btn--cancel" onClick={onCancel} disabled={isSaving}>
          <i className="bi bi-x-circle" aria-hidden="true" />
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormBox;
