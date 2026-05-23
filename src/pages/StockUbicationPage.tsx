import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aisle from "../components/stockUbication/Aisle";
import AddPalletButton from "../components/stockUbication/AddPalletButton";
import AddBoxButton from "../components/stockUbication/AddBoxButton";
import FormBox, { type FormBoxMode, type NuevaCajaPayload } from "../components/stockUbication/forms/FormBox";
import FormPallet from "../components/stockUbication/forms/FormPallet";
import { createBox } from "../services/boxService";
import { createPallet } from "../services/palletService";
import { getWarehouseMap } from "../services/warehouseMapService";
import { ApiHttpError } from "../services/apiClient";
import type { WarehouseMapItem } from "../types/warehouseMap.types";
import "../styles/StockUbicationPage.scss";

export default function StockUbicationPage() {
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState<WarehouseMapItem[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [mapError, setMapError] = useState("");
  const [huecoSeleccionado, setHuecoSeleccionado] = useState<WarehouseMapItem | null>();
  const [mostrarFormCaja, setMostrarFormCaja] = useState(false);
  const [huecoActivo, setHuecoActivo] = useState<WarehouseMapItem | null>(null);
  const [mostrarFormPallet, setMostrarFormPallet] = useState(false);
  const [formBoxMode, setFormBoxMode] = useState<FormBoxMode | null>(null);

  const abrirFormCaja = (hueco: WarehouseMapItem) => {
    setHuecoActivo(hueco);
    setFormBoxMode(null);
    setMostrarFormCaja(true);
  };

  const cerrarFormCaja = () => {
    setMostrarFormCaja(false);
    setFormBoxMode(null);
  };

  const abrirFormPallet = (hueco: WarehouseMapItem) => {
    setHuecoActivo(hueco);
    setMostrarFormPallet(true);
  };

  const cerrarFormPallet = () => {
    setMostrarFormPallet(false);
  };

  const loadMap = async (options?: { keepError?: boolean }): Promise<WarehouseMapItem[]> => {
    try {
      setIsLoadingMap(true);
      if (!options?.keepError) {
        setMapError("");
      }
      const items = await getWarehouseMap();
      setDetalles(items);
      return items;
    } catch (error) {
      const message =
        error instanceof ApiHttpError
          ? error.message
          : error instanceof Error
            ? error.message
            : "No se pudo cargar el mapa de almacén.";
      setMapError(message);
      throw error;
    } finally {
      setIsLoadingMap(false);
    }
  };

  useEffect(() => {
    void loadMap();
  }, []);

  const pasillosMap = new Map<number, WarehouseMapItem[]>();

  detalles.forEach((datoAlmacen) => {
    const pasilloId = datoAlmacen.pasillo.id;

    if (!pasillosMap.has(pasilloId)) {
      pasillosMap.set(pasilloId, []);
    }

    pasillosMap.get(pasilloId)?.push(datoAlmacen);
  });

  const handleHuecoClick = (ubicacion: WarehouseMapItem) => {
    console.log("Habitáculo seleccionado:", {
      idHueco: ubicacion.idHueco,
      pasillo: ubicacion.pasillo.numero,
      nivel: ubicacion.estanteria.nivel,
    });
    setHuecoSeleccionado(ubicacion);
  };

  const handleCreateBox = async (payload: NuevaCajaPayload) => {
    const created = await createBox(payload);
    setMostrarFormCaja(false);
    setFormBoxMode(null);
    await loadMap({ keepError: true });

    navigate(`/stock/boxes/${created.id}/terminals`, {
      state: {
        ubicacion: `${huecoActivo?.referencia ?? ""} · Pasillo ${huecoActivo?.pasillo.numero ?? "-"} · Estantería ${huecoActivo?.estanteria.descripcion ?? "-"}${typeof huecoActivo?.estanteria.nivel === "number" ? `/${huecoActivo.estanteria.nivel}` : ""}`,
        etiqueta: payload.etiqueta,
        marca: payload.marca,
        modelo: payload.modelo,
        capacidadTotal: payload.capacidadTotal,
        unidades: payload.unidades,
      },
    });
  };

  const handleOpenBoxTerminals = (caja: WarehouseMapItem["cajas"][number]) => {
    const terminals = (caja.terminales ?? []).map((terminal) => ({
      sn: terminal.numeroSerie?.toUpperCase?.() ?? "",
      isValid: true,
      reason: undefined,
      scannedAt: "Precargado",
    })).filter((item) => Boolean(item.sn));

    navigate(`/stock/boxes/${caja.id}/terminals`, {
      state: {
        ubicacion: `${huecoSeleccionado?.referencia ?? ""} · Pasillo ${huecoSeleccionado?.pasillo.numero ?? "-"} · Estantería ${huecoSeleccionado?.estanteria.descripcion ?? "-"}${typeof huecoSeleccionado?.estanteria.nivel === "number" ? `/${huecoSeleccionado.estanteria.nivel}` : ""}`,
        etiqueta: caja.etiqueta,
        marca: caja.terminales?.[0]?.marca ?? "",
        modelo: caja.modeloProducto ?? caja.terminales?.[0]?.modelo ?? "",
        capacidadTotal: caja.maxCapacity ?? huecoSeleccionado?.estanteria.capacidadMaxCajas ?? 0,
        unidades: terminals.length,
        initialRows: terminals,
      },
    });
  };

  const refreshSelectedHueco = (items: WarehouseMapItem[]) => {
    const selectedId = huecoSeleccionado?.idHueco ?? huecoActivo?.idHueco ?? null;
    if (!selectedId) return;

    const updated = items.find((item) => item.idHueco === selectedId) ?? null;
    if (updated) {
      setHuecoSeleccionado(updated);
      setHuecoActivo(updated);
    }
  };

  return (
    <div className="container py-4">
      {huecoSeleccionado && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal fade show d-block" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
              <div className="modal-content stock-slot-modal">
              <div className="modal-header">
                <div>
                  <p className="stock-slot-modal__eyebrow mb-1">Detalle de ubicación</p>
                  <h5 className="modal-title stock-slot-modal__title">{huecoSeleccionado.referencia}</h5>
                </div>
                <button className="btn-close" onClick={() => setHuecoSeleccionado(null)} />
              </div>

              <div className="modal-body stock-slot-modal__body">
                <div className="stock-slot-modal__layout">
                  <section className="stock-slot-modal__left">
                    <div className="stock-slot-modal__metrics">
                      <article className="stock-slot-metric-card">
                        <span className="stock-slot-metric-card__icon" aria-hidden="true">
                          <i className="bi bi-layout-sidebar-inset" />
                        </span>
                        <p className="stock-slot-metric-card__label">Pasillo</p>
                        <p className="stock-slot-metric-card__value">{huecoSeleccionado.pasillo.numero}</p>
                      </article>
                      <article className="stock-slot-metric-card">
                        <span className="stock-slot-metric-card__icon" aria-hidden="true">
                          <i className="bi bi-layers" />
                        </span>
                        <p className="stock-slot-metric-card__label">Nivel estantería</p>
                        <p className="stock-slot-metric-card__value">{huecoSeleccionado.estanteria.nivel}</p>
                      </article>
                    </div>

                    <article className="stock-slot-pallet-card">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="stock-slot-pallet-card__title mb-0">Información del palé</h6>
                        <span className={`stock-slot-pallet-card__badge ${huecoSeleccionado.pale ? "is-active" : "is-empty"}`}>
                          {huecoSeleccionado.pale ? "Activo" : "Vacío"}
                        </span>
                      </div>

                      {huecoSeleccionado.pale ? (
                        <div className="stock-slot-pallet-card__grid">
                          <div className="stock-slot-pallet-card__field">
                            <p className="stock-slot-pallet-card__label">Material</p>
                            <p className="stock-slot-pallet-card__value">
                              <span className="stock-slot-pallet-card__value-icon" aria-hidden="true">
                                <i className="bi bi-dot" />
                              </span>
                              {huecoSeleccionado.pale.material}
                            </p>
                          </div>
                          <div className="stock-slot-pallet-card__field">
                            <p className="stock-slot-pallet-card__label">Tipo</p>
                            <p className="stock-slot-pallet-card__value">
                              <span className="stock-slot-pallet-card__value-icon" aria-hidden="true">
                                <i className="bi bi-diagram-3" />
                              </span>
                              {huecoSeleccionado.pale.tipo}
                            </p>
                          </div>
                          <div className="stock-slot-pallet-card__field stock-slot-pallet-card__field--full">
                            <p className="stock-slot-pallet-card__label">Descripción</p>
                            <p className="stock-slot-pallet-card__value">
                              <span className="stock-slot-pallet-card__value-icon" aria-hidden="true">
                                <i className="bi bi-card-text" />
                              </span>
                              {huecoSeleccionado.pale.descripcion}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="stock-slot-pallet-card__empty">
                          <p className="mb-3 text-muted">No hay palé asignado todavía.</p>
                          <AddPalletButton onClick={() => abrirFormPallet(huecoSeleccionado)} />
                        </div>
                      )}
                    </article>
                  </section>

                  <aside className="stock-slot-modal__right">
                    <article className="stock-slot-capacity-card">
                      <p className="stock-slot-capacity-card__label">Capacidad utilizada</p>
                      <div
                        className="stock-slot-capacity-card__ring"
                        style={{
                          background: `conic-gradient(#0c677f ${(huecoSeleccionado.ocupacionActual / Math.max(huecoSeleccionado.estanteria.capacidadMaxCajas, 1)) * 360}deg, #d4dde2 0deg)`,
                        }}
                      >
                        <div className="stock-slot-capacity-card__ring-inner">
                          <p className="stock-slot-capacity-card__count mb-0">
                            {huecoSeleccionado.ocupacionActual}/{huecoSeleccionado.estanteria.capacidadMaxCajas}
                          </p>
                          <p className="stock-slot-capacity-card__sub mb-0" aria-label="Cajas">
                            <i className="bi bi-box-seam" />
                          </p>
                        </div>
                      </div>

                      {huecoSeleccionado.cajas.length > 0 ? (
                        <div className="stock-slot-box-list">
                          {huecoSeleccionado.cajas.map((caja) => (
                            <button
                              type="button"
                              className="stock-slot-box-list__item stock-slot-box-list__item--button"
                              key={caja.id}
                              onClick={() => handleOpenBoxTerminals(caja)}
                            >
                              {caja.etiqueta}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="stock-slot-box-list__empty">Sin cajas</div>
                      )}
                    </article>
                  </aside>
                </div>

                {huecoSeleccionado.cajas.length < huecoSeleccionado.estanteria.capacidadMaxCajas && huecoSeleccionado.pale !== null ? (
                  <div className="stock-slot-modal__cta">
                    <AddBoxButton onClick={() => abrirFormCaja(huecoSeleccionado)} />
                  </div>
                ) : null}
              </div>
              </div>
            </div>
          </div>
        </>
      )}

      {mostrarFormCaja && huecoActivo && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
              {!formBoxMode && (
                <div className="box-mode-selector">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">Nueva caja</h5>
                    <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrarFormCaja} />
                  </div>
                  <p className="text-muted mb-3">Elige cómo quieres agregar la caja al palé.</p>

                  <div className="box-mode-selector__grid">
                    <button type="button" className="box-mode-card" onClick={() => setFormBoxMode("manual")}>
                      <span className="box-mode-card__icon" aria-hidden="true">
                        <i className="bi bi-plus-square" />
                      </span>
                      <span className="box-mode-card__title">Dar de alta una caja</span>
                      <span className="box-mode-card__desc">Crear una caja nueva para este palé.</span>
                    </button>

                    <button type="button" className="box-mode-card" onClick={() => setFormBoxMode("registered")}>
                      <span className="box-mode-card__icon" aria-hidden="true">
                        <i className="bi bi-archive" />
                      </span>
                      <span className="box-mode-card__title">Cajas registradas</span>
                      <span className="box-mode-card__desc">Usar una caja ya registrada en el sistema.</span>
                    </button>
                  </div>
                </div>
              )}

              {formBoxMode && (
                <>
                  <h5 className="mb-3">{formBoxMode === "manual" ? "Dar de alta una caja" : "Caja registrada"}</h5>
                  <FormBox
                    hueco={huecoActivo}
                    mode={formBoxMode}
                    onSubmit={handleCreateBox}
                    onCancel={cerrarFormCaja}
                    onBack={() => setFormBoxMode(null)}
                  />
                </>
              )}
              </div>
            </div>
          </div>
        </>
      )}

      {mostrarFormPallet && huecoActivo && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal fade show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
              <h5 className="mb-3">Nueva caja</h5>

              <FormPallet
                idHueco={huecoActivo.idHueco}
                onSubmit={async (data) => {
                  if (huecoActivo.ubicacionAlmacenId === null || typeof huecoActivo.ubicacionAlmacenId === "undefined") {
                    throw new Error("La ubicación seleccionada no tiene ID real de almacén");
                  }

                  const descripcion = data.descripcion || `Palet ${data.material} ${data.tipo}`;
                  const codigoMarca = `PAL-${data.material.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
                  const payload = {
                    descripcion,
                    material: data.material,
                    tipo: data.tipo,
                    capacidadMaxCajas: data.capacidadMaxCajas,
                    codigoMarca,
                    ubicacionAlmacenId: huecoActivo.ubicacionAlmacenId,
                    cajas: [],
                  };

                  console.log("Create pallet request ids:", {
                    idHueco: huecoActivo.idHueco,
                    ubicacionAlmacenId: huecoActivo.ubicacionAlmacenId,
                  });
                  console.log("Create pallet payload:", payload);

                  await createPallet(payload);
                  const items = await getWarehouseMap();
                  setDetalles(items);
                  refreshSelectedHueco(items);
                  setMostrarFormPallet(false);
                }}
                onCancel={cerrarFormPallet}
                canSubmit={typeof huecoActivo.ubicacionAlmacenId === "number"}
                blockedMessage="La ubicación seleccionada no tiene ID real de almacén"
              />
              </div>
            </div>
          </div>
        </>
      )}

      {!huecoSeleccionado && (
        <>
          <h5 className="mb-4">Mapa de Almacén</h5>
          {mapError && <div className="alert alert-danger py-2">{mapError}</div>}
          {isLoadingMap ? (
            <div className="text-muted">Cargando mapa...</div>
          ) : (
            <div className="d-flex flex-column gap-1">
              {Array.from(pasillosMap.entries()).map(([pasilloId, detallesPasillo]) => (
                <Aisle
                  key={pasilloId}
                  pasilloId={pasilloId}
                  numero={detallesPasillo[0].pasillo.numero}
                  ubicaciones={detallesPasillo}
                  onHuecoClick={handleHuecoClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
