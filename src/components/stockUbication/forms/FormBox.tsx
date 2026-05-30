import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { getFreeBoxesByBrand, type FreeBox } from "../../../services/boxService";
import { getMaxCapacityByModel, getTerminalBrands, getTerminalModelsByBrand } from "../../../services/terminalCatalogService";
import type { WarehouseMapItem } from "../../../types/warehouseMap.types";

export type FormBoxMode = "registered" | "manual";

export interface NuevaCajaPayload {
  etiqueta: string;
  modelo: string;
  marca: string;
  unidades: number;
  capacidadTotal: number;
  paletId: number | null;
}

interface FormBoxProps {
  hueco: WarehouseMapItem;
  mode: FormBoxMode;
  allowedBrand?: string | null;
  onSubmitNew: (data: NuevaCajaPayload) => Promise<void>;
  onSubmitExisting: (box: FreeBox) => Promise<void>;
  onCancel: () => void;
}

type FormState = {
  etiqueta: string;
  marca: string;
  modelo: string;
  capacidadTotal: number | null;
  paletId: number | null;
};

function buildEtiqueta(hueco: WarehouseMapItem): string {
  const numeroPasillo = String(hueco.pasillo.numero);
  const estanteria = String(hueco.estanteria.descripcion ?? "").trim().toUpperCase();
  const nivel = String(hueco.estanteria.nivel);
  const numeroCaja = String((hueco.cajas?.length ?? 0) + 1);
  return `${numeroPasillo}-${estanteria}-${nivel}-${numeroCaja}`;
}

function parseBrandAndModel(modeloProducto: string): { marca: string; modelo: string } {
  const normalized = modeloProducto.trim();
  if (!normalized) return { marca: "", modelo: "" };

  const parts = normalized.split(/\s+/);
  if (parts.length <= 1) return { marca: "", modelo: normalized };

  return {
    marca: parts[0],
    modelo: parts.slice(1).join(" "),
  };
}

function normalizeBrandToken(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function extractCodeMiddleToken(code: string): string {
  const parts = code.split("-").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[1];
  return code;
}

function matchesAllowedBrand(allowedBrandOrCode: string, boxBrand: string): boolean {
  const brandNorm = normalizeBrandToken(boxBrand);
  const allowedNorm = normalizeBrandToken(allowedBrandOrCode);
  if (!brandNorm || !allowedNorm) return false;
  if (brandNorm === allowedNorm) return true;

  const codeToken = normalizeBrandToken(extractCodeMiddleToken(allowedBrandOrCode));
  if (!codeToken) return false;

  return brandNorm.startsWith(codeToken) || codeToken.startsWith(brandNorm.slice(0, Math.min(3, brandNorm.length)));
}

function resolveBrandForCatalog(allowedBrandOrCode: string): string {
  const raw = (allowedBrandOrCode ?? "").trim();
  if (!raw) return "";
  if (raw.includes("-")) {
    return extractCodeMiddleToken(raw);
  }
  return raw;
}

function FormBox({
  hueco,
  mode,
  allowedBrand,
  onSubmitNew,
  onSubmitExisting,
  onCancel,
}: FormBoxProps) {
  const effectiveBrand = resolveBrandForCatalog((allowedBrand ?? hueco.pale?.codigoMarca ?? "").trim());

  const [form, setForm] = useState<FormState>({
    etiqueta: buildEtiqueta(hueco),
    marca: effectiveBrand,
    modelo: "",
    capacidadTotal: null,
    paletId: hueco.pale?.id ?? null,
  });
  const [selectedExistingBoxId, setSelectedExistingBoxId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [catalogError, setCatalogError] = useState("");
  const [marcas, setMarcas] = useState<string[]>([]);
  const [modelosPorMarca, setModelosPorMarca] = useState<string[]>([]);
  const [registeredBrand, setRegisteredBrand] = useState("");
  const [registeredBoxes, setRegisteredBoxes] = useState<FreeBox[]>([]);
  const [isLoadingRegisteredBoxes, setIsLoadingRegisteredBoxes] = useState(false);

  const selectedExistingBox = useMemo(
    () => registeredBoxes.find((box) => box.id === selectedExistingBoxId) ?? null,
    [registeredBoxes, selectedExistingBoxId]
  );

  const normalizedAllowedBrand = (allowedBrand ?? "").trim().toLowerCase();

  const freeBoxesByAllowedBrand = useMemo(() => {
    if (!normalizedAllowedBrand) return registeredBoxes;
    return registeredBoxes.filter((box) => {
      const parsed = parseBrandAndModel(box.modeloProducto);
      return matchesAllowedBrand(allowedBrand ?? "", parsed.marca);
    });
  }, [allowedBrand, normalizedAllowedBrand, registeredBoxes]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      etiqueta: buildEtiqueta(hueco),
      marca: effectiveBrand || prev.marca,
      modelo: effectiveBrand ? "" : prev.modelo,
      capacidadTotal: effectiveBrand ? null : prev.capacidadTotal,
      paletId: hueco.pale?.id ?? null,
    }));
  }, [effectiveBrand, hueco]);

  useEffect(() => {
    setSelectedExistingBoxId(null);
  }, [mode, normalizedAllowedBrand]);

  useEffect(() => {
    if (mode !== "registered") return;
    setErrorMessage("");
    setSelectedExistingBoxId(null);
    setRegisteredBoxes([]);
    setRegisteredBrand((allowedBrand ?? "").trim());
  }, [mode, allowedBrand, hueco.idHueco]);

  useEffect(() => {
    if (mode !== "manual") return;

    let cancelled = false;

    const loadModels = async () => {
      const manualBrand = effectiveBrand;
      if (!manualBrand) {
        setModelosPorMarca([]);
        return;
      }

      try {
        setIsLoadingCatalog(true);
        setCatalogError("");
        const models = await getTerminalModelsByBrand(manualBrand);
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
  }, [effectiveBrand, mode]);

  useEffect(() => {
    if (mode !== "manual") return;

    let cancelled = false;

    const loadMaxCapacity = async () => {
      if (!form.modelo) {
        setForm((prev) => ({ ...prev, capacidadTotal: null }));
        setIsLoadingCapacity(false);
        return;
      }

      try {
        setIsLoadingCapacity(true);
        setIsLoadingCatalog(true);
        const brandForCatalog = resolveBrandForCatalog(allowedBrand ?? "");
        console.log("[FormBox] max-capacity request params", {
          brandForCatalog,
          selectedModel: form.modelo,
          modeloParamSent: brandForCatalog,
        });
        const maxCapacity = brandForCatalog ? await getMaxCapacityByModel(brandForCatalog) : null;
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
          setIsLoadingCapacity(false);
          setIsLoadingCatalog(false);
        }
      }
    };

    void loadMaxCapacity();

    return () => {
      cancelled = true;
    };
  }, [form.modelo, mode]);

  useEffect(() => {
    if (mode !== "registered") return;
    if (allowedBrand) return;

    let cancelled = false;
    const loadBrands = async () => {
      try {
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
      }
    };
    void loadBrands();
    return () => {
      cancelled = true;
    };
  }, [mode, allowedBrand]);

  useEffect(() => {
    if (mode !== "registered") return;

    const brandToLoad = (allowedBrand ?? registeredBrand).trim();
    if (!brandToLoad) {
      setRegisteredBoxes([]);
      return;
    }

    let cancelled = false;
    const loadBoxesByBrand = async () => {
      try {
        setIsLoadingRegisteredBoxes(true);
        setCatalogError("");
        const boxes = await getFreeBoxesByBrand(brandToLoad);
        if (!cancelled) {
          setRegisteredBoxes(boxes);
        }
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "No se pudieron cargar las cajas libres por marca.";
          setCatalogError(message);
          setRegisteredBoxes([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRegisteredBoxes(false);
        }
      }
    };
    void loadBoxesByBrand();
    return () => {
      cancelled = true;
    };
  }, [mode, allowedBrand, registeredBrand]);

  const handleModeloChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const modelo = event.target.value;
    setForm((prev) => ({
      ...prev,
      modelo,
    }));
  };

  const capacidadActual = form.capacidadTotal;

  const canSubmitManual =
    Boolean(form.etiqueta.trim()) &&
    Boolean(effectiveBrand) &&
    Boolean(form.modelo.trim()) &&
    capacidadActual !== null &&
    capacidadActual > 0;

  const selectedExistingBrand = selectedExistingBox ? parseBrandAndModel(selectedExistingBox.modeloProducto).marca : "";
  const fixedBrand = (allowedBrand ?? "").trim();
  const brandMismatch =
    mode === "registered" &&
    Boolean(fixedBrand && selectedExistingBrand) &&
    normalizeBrandToken(selectedExistingBrand) !== normalizeBrandToken(fixedBrand);
  const canSubmitExisting = Boolean(selectedExistingBoxId && form.paletId && !brandMismatch);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (mode === "registered") {
      if (!canSubmitExisting || !selectedExistingBoxId || !selectedExistingBox) {
        setErrorMessage("Selecciona una caja existente para asignarla al palé.");
        return;
      }

      if (brandMismatch && fixedBrand) {
        setErrorMessage(`Este palé ya contiene cajas de marca ${fixedBrand}. No se pueden mezclar marcas.`);
        return;
      }

      try {
        setIsSaving(true);
        await onSubmitExisting(selectedExistingBox);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo asignar la caja.";
        setErrorMessage(message);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    if (!canSubmitManual || capacidadActual === null) {
      setErrorMessage("Revisa los datos obligatorios antes de guardar.");
      return;
    }

    try {
      setIsSaving(true);
      await onSubmitNew({
        etiqueta: form.etiqueta.trim(),
        modelo: form.modelo.trim(),
        marca: effectiveBrand,
        unidades: 0,
        capacidadTotal: capacidadActual,
        paletId: null,
      });
      console.log("[FormBox] create new box payload", {
        etiqueta: form.etiqueta.trim(),
        marca: effectiveBrand,
        modelo: form.modelo.trim(),
        capacidadTotal: capacidadActual,
        paletId: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la caja.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`stock-box-form ${mode === "registered" ? "stock-box-form--registered" : ""}`.trim()}>
      {mode === "registered" ? (
        <>
          {!allowedBrand && (
            <div className="mb-3 stock-box-form__group">
              <label className="form-label">Marca</label>
              <select
                className="form-select"
                value={registeredBrand}
                onChange={(event) => {
                  setRegisteredBrand(event.target.value);
                  setSelectedExistingBoxId(null);
                }}
                disabled={isSaving || Boolean(catalogError && marcas.length === 0)}
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Caja existente</label>
            <select
              className="form-select"
              value={selectedExistingBoxId ?? ""}
              onChange={(event) => {
                const raw = event.target.value;
                if (!raw) {
                  setSelectedExistingBoxId(null);
                  return;
                }
                const nextId = Number(raw);
                setSelectedExistingBoxId(Number.isFinite(nextId) ? nextId : null);
              }}
              disabled={
                isLoadingRegisteredBoxes ||
                freeBoxesByAllowedBrand.length === 0 ||
                isSaving ||
                (!allowedBrand && !registeredBrand)
              }
              required
            >
              <option value="">
                {!allowedBrand && !registeredBrand
                  ? "Selecciona una marca primero"
                  : isLoadingRegisteredBoxes
                    ? "Cargando cajas libres..."
                    : "Selecciona una caja libre"}
              </option>
              {freeBoxesByAllowedBrand.map((box) => (
                <option key={box.id} value={box.id}>
                  {box.etiqueta} - {box.modeloProducto} - Cap. {box.maxCapacity}
                </option>
              ))}
            </select>
            {!isLoadingRegisteredBoxes && freeBoxesByAllowedBrand.length === 0 && (allowedBrand || registeredBrand) && (
              <div className="form-text">No hay cajas libres disponibles para la marca seleccionada.</div>
            )}
            {allowedBrand && (
              <div className="form-text">Palé de marca: {allowedBrand}. Solo se mostrarán cajas libres de esta marca.</div>
            )}
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Etiqueta</label>
            <input className="form-control" value={selectedExistingBox?.etiqueta ?? ""} readOnly placeholder="Selecciona una caja" />
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Marca</label>
            <input
              className="form-control"
              value={selectedExistingBox ? parseBrandAndModel(selectedExistingBox.modeloProducto).marca : ""}
              readOnly
              placeholder="Selecciona una caja"
            />
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Modelo</label>
            <input
              className="form-control"
              value={selectedExistingBox ? parseBrandAndModel(selectedExistingBox.modeloProducto).modelo : ""}
              readOnly
              placeholder="Selecciona una caja"
            />
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Capacidad máxima</label>
            <input className="form-control" value={selectedExistingBox?.maxCapacity ?? ""} readOnly placeholder="Selecciona una caja" />
          </div>
        </>
      ) : (
        <>
          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Etiqueta</label>
            <input className="form-control" value={form.etiqueta} readOnly required />
            <div className="form-text">Formato: Pasillo-Estantería-Nivel-NºCaja (ej: 2-C-1-3)</div>
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Modelo</label>
            <select
              className="form-select"
              value={form.modelo}
              onChange={handleModeloChange}
              required
              disabled={!effectiveBrand || isLoadingCatalog}
            >
              <option value="">{effectiveBrand ? "Selecciona un modelo" : "Este palé no tiene marca definida"}</option>
              {modelosPorMarca.map((modelo) => (
                <option key={modelo} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 stock-box-form__group">
            <label className="form-label">Capacidad máxima</label>
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
              placeholder={
                !form.modelo
                  ? "Selecciona un modelo"
                  : isLoadingCapacity
                    ? "Calculando capacidad..."
                    : "Capacidad no disponible"
              }
              required
            />
          </div>
        </>
      )}

      {catalogError && <div className="alert alert-warning py-2">{catalogError}</div>}
      {brandMismatch && fixedBrand && (
        <div className="alert alert-danger py-2">
          {`Este palé ya contiene cajas de marca ${fixedBrand}. No se pueden mezclar marcas.`}
        </div>
      )}
      {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}

      <div className="d-flex gap-2 stock-box-form__actions">
        <button
          className="btn stock-box-form__btn stock-box-form__btn--save"
          type="submit"
          disabled={
            isSaving ||
            (mode === "manual" ? !canSubmitManual || Boolean(catalogError) : !canSubmitExisting || isLoadingRegisteredBoxes)
          }
        >
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
