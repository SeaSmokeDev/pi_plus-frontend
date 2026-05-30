import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SNSearchDeleteConfirmModal from "../components/SNSearch/SNSearchDeleteConfirmModal";
import { ApiHttpError } from "../services/apiClient";
import {
  associateTerminalsToBox,
  getCajaById,
  unassignTerminalFromBox,
  validateTerminalForBox,
  type ValidarTerminalResponse,
} from "../services/cajaTerminalService";
import { getBoxCapacity } from "../services/boxService";
import "../styles/BoxTerminalsPage.scss";

type BoxTerminalsLocationState = {
  huecoId?: number;
  ubicacion?: string;
  etiqueta?: string;
  marca?: string;
  modelo?: string;
  capacidadTotal?: number;
  unidades?: number;
  initialRows?: BoxTerminalRow[];
};

type BoxTerminalRow = {
  sn: string;
  marca?: string;
  modelo?: string;
  terminalState?: string;
  isValid: boolean;
  reason?: string;
  reasonCode?: ValidarTerminalResponse["motivo"];
  scannedAt: string;
};

type TerminalStateVisual = {
  label: string;
  icon: string;
  className: string;
};

const FORBIDDEN_TERMINAL_STATES = new Set(["en_transito", "pendiente_transito", "nivel_1"]);

function normalizeState(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

function isForbiddenTerminalState(value?: string | null): boolean {
  return FORBIDDEN_TERMINAL_STATES.has(normalizeState(value));
}

function resolveTerminalStateVisual(row: BoxTerminalRow): TerminalStateVisual {
  const state = normalizeState(row.terminalState);

  if (state === "operativo") return { label: "Operativo", icon: "check_circle", className: "is-operativo" };
  if (state === "pendiente_laboratorio" || state === "pendiente_lavoratorio") {
    return { label: "Pendiente laboratorio", icon: "science", className: "is-pendiente-laboratorio" };
  }
  if (state === "pendiente_revision") return { label: "Pendiente revisión", icon: "manage_search", className: "is-pendiente-revision" };
  if (state === "en_transito") return { label: "En tránsito", icon: "local_shipping", className: "is-en-transito" };
  if (state === "pendiente_transito") return { label: "Pendiente tránsito", icon: "inventory_2", className: "is-pendiente-transito" };
  if (state === "nivel_1") return { label: "Nivel 1", icon: "build_circle", className: "is-nivel-1" };
  if (row.isValid) return { label: "Válido", icon: "verified", className: "is-operativo" };
  return { label: "Inválido", icon: "error", className: "is-invalid" };
}

function nowTime(): string {
  return new Date().toLocaleTimeString("es-ES", { hour12: false });
}

function reasonToMessage(response: ValidarTerminalResponse): string {
  switch (response.motivo) {
    case "SN_VACIO":
      return "S/N vacío.";
    case "CAJA_NO_EXISTE":
      return "La caja no existe.";
    case "TERMINAL_NO_EXISTE":
      return "Terminal no existe.";
    case "TERMINAL_YA_ASOCIADO":
      return "Terminal ya asociado a otra caja.";
    case "MODELO_NO_COMPATIBLE":
      return "Modelo no compatible con la caja.";
    case "ESTADO_NO_VALIDO":
      return `Estado no válido (${response.terminal?.estado ?? "desconocido"}).`;
    default:
      return "No válido para esta caja.";
  }
}

function normalizeText(value?: string | null): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function isModelActuallyCompatible(response: ValidarTerminalResponse): boolean {
  if (response.motivo !== "MODELO_NO_COMPATIBLE") return false;
  const terminalMarca = normalizeText(response.terminal?.marca);
  const terminalModelo = normalizeText(response.terminal?.modelo);
  const cajaModeloProducto = normalizeText(response.caja?.modeloProducto);
  if (!terminalModelo || !cajaModeloProducto) return false;

  const composed = normalizeText(`${terminalMarca} ${terminalModelo}`);
  return (
    cajaModeloProducto === terminalModelo ||
    cajaModeloProducto === composed ||
    cajaModeloProducto.endsWith(` ${terminalModelo}`)
  );
}

export default function BoxTerminalsPage() {
  const navigate = useNavigate();
  const { boxId } = useParams<{ boxId: string }>();
  const location = useLocation();
  const state = (location.state as BoxTerminalsLocationState | null) ?? null;

  const parsedBoxId = Number(boxId);
  const [manualSN, setManualSN] = useState("");
  const [rows, setRows] = useState<BoxTerminalRow[]>(state?.initialRows ?? []);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerSN, setScannerSN] = useState("");
  const [deletingSn, setDeletingSn] = useState<string | null>(null);
  const [confirmSn, setConfirmSn] = useState<string | null>(null);
  const [boxInfo, setBoxInfo] = useState<{
    etiqueta: string;
    marca: string;
    modelo: string;
    capacidadTotal: number;
  }>({
    etiqueta: state?.etiqueta ?? "",
    marca: state?.marca ?? "",
    modelo: state?.modelo ?? "",
    capacidadTotal: state?.capacidadTotal ?? 0,
  });
  const [capacityStatus, setCapacityStatus] = useState<"loading" | "ready" | "error">("loading");

  const capacidadMaxima = boxInfo.capacidadTotal;
  const hasInvalidRows = useMemo(() => rows.some((row) => !row.isValid), [rows]);
  const hasForbiddenStateRows = useMemo(() => rows.some((row) => isForbiddenTerminalState(row.terminalState)), [rows]);
  const canSubmit = rows.length > 0 && !hasInvalidRows && !hasForbiddenStateRows && Number.isFinite(parsedBoxId);

  const loadBoxData = async (cajaId: number, options?: { preserveRows?: boolean }) => {
    const caja = await getCajaById(cajaId);

    const apiRows: BoxTerminalRow[] = (caja.terminales ?? [])
      .map((terminal) => ({
        sn: terminal.numeroSerie?.trim().toUpperCase() ?? "",
        marca: terminal.marca?.trim() ?? "",
        modelo: terminal.modelo?.trim() ?? "",
        terminalState: terminal.estado?.trim() ?? "",
        isValid: true,
        scannedAt: "Precargado",
      }))
      .filter((row) => row.sn.length > 0);

    if (!options?.preserveRows) {
      setRows(apiRows);
    }
    setBoxInfo({
      etiqueta: caja.etiqueta ?? state?.etiqueta ?? "",
      marca: caja.terminales?.[0]?.marca ?? state?.marca ?? "",
      modelo: caja.modeloProducto ?? caja.terminales?.[0]?.modelo ?? state?.modelo ?? "",
      capacidadTotal: caja.maxCapacity ?? state?.capacidadTotal ?? 0,
    });

    try {
      const cap = await getBoxCapacity(cajaId);
      setBoxInfo((prev) => ({ ...prev, capacidadTotal: cap.capacidadMaxima }));
      setCapacityStatus("ready");
    } catch {
      setCapacityStatus("error");
    }
  };

  useEffect(() => {
    if (!Number.isFinite(parsedBoxId)) {
      return;
    }

    let cancelled = false;

    const loadBox = async () => {
      try {
        setCapacityStatus("loading");
        await loadBoxData(parsedBoxId);
        if (cancelled) return;
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiHttpError) {
          setErrorMessage(`No se pudo cargar la caja: ${error.message}`);
          return;
        }
        setErrorMessage("No se pudo cargar la información de la caja.");
        setCapacityStatus("error");
      }
    };

    void loadBox();

    return () => {
      cancelled = true;
    };
  }, [parsedBoxId, state?.capacidadTotal, state?.etiqueta, state?.marca, state?.modelo]);

  const validateSN = async (sn: string): Promise<BoxTerminalRow> => {
    const response = await validateTerminalForBox(parsedBoxId, { sn });
    console.log("[validateTerminalForBox] response", { cajaId: parsedBoxId, sn, response });

    if (response.valido || isModelActuallyCompatible(response)) {
      return {
        sn,
        marca: response.terminal?.marca?.trim() ?? "",
        modelo: response.terminal?.modelo?.trim() ?? "",
        terminalState: response.terminal?.estado?.trim() ?? "",
        isValid: true,
        scannedAt: nowTime(),
      };
    }

    return {
      sn,
      marca: response.terminal?.marca?.trim() ?? "",
      modelo: response.terminal?.modelo?.trim() ?? "",
      terminalState: response.terminal?.estado?.trim() ?? "",
      isValid: false,
      reasonCode: response.motivo,
      reason: reasonToMessage(response),
      scannedAt: nowTime(),
    };
  };

  const handleAddManual = async () => {
    const sn = manualSN.trim().toUpperCase();
    setManualSN(sn);
    setErrorMessage("");
    setSuccessMessage("");

    if (!sn) {
      setErrorMessage("Introduce un S/N manual.");
      return;
    }

    if (rows.some((row) => row.sn === sn)) {
      setErrorMessage("Ese S/N ya fue añadido.");
      return;
    }

    if (!Number.isFinite(parsedBoxId)) {
      setErrorMessage("ID de caja inválido.");
      return;
    }

    try {
      setIsAdding(true);
      const row = await validateSN(sn);
      if (!row.isValid && row.reasonCode === "TERMINAL_NO_EXISTE") {
        setErrorMessage("El terminal no existe.");
        return;
      }
      setRows((prev) => [...prev, row]);
      setManualSN("");
    } catch (error) {
      if (error instanceof ApiHttpError) {
        setErrorMessage(`Error HTTP ${error.status}: ${error.message}`);
      } else {
        setErrorMessage("Error de red validando S/N.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleManualEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void handleAddManual();
    }
  };

  const handleUnassignTerminal = async (sn: string) => {
    const normalized = sn.trim().toUpperCase();
    if (!normalized || !Number.isFinite(parsedBoxId)) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setDeletingSn(normalized);
      const response = await unassignTerminalFromBox(parsedBoxId, normalized);
      setSuccessMessage(response.mensaje || "Terminal desasignado con éxito.");
      setRows((prev) => prev.filter((row) => row.sn !== normalized));
      await loadBoxData(parsedBoxId, { preserveRows: true });
    } catch (error) {
      if (error instanceof ApiHttpError) {
        const backendMessage = (error.message || "").toLowerCase();
        if ((error.message || "").toLowerCase().includes("no está asociado")) {
          setRows((prev) => prev.filter((row) => row.sn !== normalized));
          setSuccessMessage("El terminal ya no estaba asociado a la caja. Se retiró del listado.");
          await loadBoxData(parsedBoxId, { preserveRows: true });
          return;
        }
        if (backendMessage.includes("otra caja") || backendMessage.includes("ya asociado")) {
          setRows((prev) => prev.filter((row) => row.sn !== normalized));
          setSuccessMessage("El terminal pertenece a otra caja. Se retiró del listado local.");
          await loadBoxData(parsedBoxId, { preserveRows: true });
          return;
        }
        setErrorMessage(error.message || "No se pudo desasignar el terminal.");
      } else {
        setErrorMessage("No se pudo desasignar el terminal.");
      }
    } finally {
      setDeletingSn(null);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);
      const payload = {
        sns: rows.map((row) => row.sn),
      };
      console.log("[associateTerminalsToBox] request", {
        cajaId: parsedBoxId,
        payload,
      });
      const response = await associateTerminalsToBox(parsedBoxId, payload);

      if (response.success) {
        setSuccessMessage(`Terminales asociados correctamente a la caja ${response.cajaId}.`);
        await loadBoxData(parsedBoxId);
        if (typeof state?.huecoId === "number") {
          navigate(`/stock/ubicacion/${state.huecoId}`, {
            state: {
              actionFeedback: `Terminales asociados correctamente a la caja ${response.cajaId}.`,
            },
          });
        } else {
          navigate("/stock", {
            state: {
              openBoxId: parsedBoxId,
              actionFeedback: `Terminales asociados correctamente a la caja ${response.cajaId}.`,
            },
          });
        }
        return;
      }

      const errorsBySn = new Map(response.errores.map((item) => [item.sn.toUpperCase(), item.motivo]));

      setRows((prev) =>
        prev.map((row) => {
          const businessReason = errorsBySn.get(row.sn.toUpperCase());
          if (!businessReason) {
            return row;
          }

          return {
            ...row,
            isValid: false,
            reason: businessReason,
          };
        })
      );

      setErrorMessage(response.motivo || "No se pudieron asociar todos los terminales.");
    } catch (error) {
      if (error instanceof ApiHttpError) {
        const data = error.data as { motivo?: string; errores?: Array<{ sn: string; motivo: string }> } | null;

        if (data?.errores?.length) {
          const errorsBySn = new Map(data.errores.map((item) => [item.sn.toUpperCase(), item.motivo]));
          setRows((prev) =>
            prev.map((row) => {
              const businessReason = errorsBySn.get(row.sn.toUpperCase());
              if (!businessReason) {
                return row;
              }

              return {
                ...row,
                isValid: false,
                reason: businessReason,
              };
            })
          );
        }

        setErrorMessage(data?.motivo || `Error HTTP ${error.status}: ${error.message}`);
      } else {
        setErrorMessage("Error de red al asociar terminales.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFromScanner = async () => {
    const normalized = scannerSN.trim().toUpperCase();
    setScannerSN(normalized);
    setManualSN(normalized);
    await handleAddManual();
    setScannerSN("");
  };

  return (
    <div className="container py-4 box-terminals-page">
      <div className="card shadow-sm box-terminals-card">
        <div className="card-header bg-transparent box-terminals-card__header">
          <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
            <h1 className="h3 mb-0">Agregar terminales </h1>
            <button type="button" className="btn box-terminals-btn box-terminals-btn--outline d-inline-flex align-items-center gap-2" onClick={() => setIsScannerOpen(true)}>
              <span className="material-symbols-outlined">qr_code_scanner</span>
              Escanear cajas
            </button>
          </div>
        </div>

        <div className="card-body border-bottom box-terminals-card__meta">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label fw-semibold">Etiqueta</label>
              <input className="form-control" value={boxInfo.etiqueta} readOnly />
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label fw-semibold">Marca + Modelo</label>
              <input className="form-control" value={boxInfo.modelo} readOnly />
            </div>
            <div className="col-12 col-md-6 col-xl-2">
              <label className="form-label fw-semibold">Unidades</label>
              <input className="form-control" value={rows.length} readOnly />
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <label className="form-label fw-semibold">Capacidad máxima</label>
              <div className="box-terminals-capacity">
                <input className="form-control" value={capacidadMaxima} readOnly />
                <span className="box-terminals-capacity__icon" aria-hidden="true">
                  <i className="bi bi-box-seam" />
                </span>
              </div>
              {capacityStatus === "error" && <div className="form-text text-danger">Capacidad no disponible.</div>}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row gap-3 align-items-lg-end justify-content-between mb-3">
            <h2 className="h4 mb-0">Terminales escaneados</h2>

            <div className="d-flex flex-column flex-md-row gap-2 align-items-stretch">
              <input
                className="form-control"
                placeholder="S/N Manual"
                value={manualSN}
                onChange={(event) => setManualSN(event.target.value)}
                onKeyDown={handleManualEnter}
              />
              <button type="button" className="btn box-terminals-btn box-terminals-btn--primary" onClick={() => void handleAddManual()} disabled={isAdding}>
                {isAdding ? "Añadiendo..." : "Añadir"}
              </button>
            </div>
          </div>

          {errorMessage && <div className="alert alert-danger py-2">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success py-2">{successMessage}</div>}

          <div className="table-responsive border rounded-3 box-terminals-table">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>S/N TERMINAL</th>
                  <th>MARCA</th>
                  <th>MODELO</th>
                  <th>ESTADO</th>
                  <th className="text-end">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      Todavía no hay terminales añadidos.
                    </td>
                  </tr>
                )}

                {rows.map((row, index) => (
                  <tr key={`${row.sn}-${index}`}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{row.sn}</td>
                    <td>{row.marca || "-"}</td>
                    <td>{row.modelo || "-"}</td>
                    <td>
                      {(() => {
                        const stateVisual = resolveTerminalStateVisual(row);
                        return (
                          <span className={`badge rounded-pill box-terminal-state ${stateVisual.className}`}>
                            <span className="material-symbols-outlined box-terminal-state__icon" aria-hidden="true">
                              {stateVisual.icon}
                            </span>
                            {stateVisual.label}
                          </span>
                        );
                      })()}
                      {isForbiddenTerminalState(row.terminalState) && (
                        <div className="small text-danger mt-1">Este estado no se puede asignar a una caja.</div>
                      )}
                      {!row.isValid && row.reason && <div className="small text-danger mt-1">{row.reason}</div>}
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 d-inline-flex align-items-center gap-1"
                        onClick={() => setConfirmSn(row.sn)}
                        disabled={deletingSn === row.sn}
                      >
                        <i className="bi bi-x-circle" aria-hidden="true" />
                        {deletingSn === row.sn ? "Desasignando..." : "Desasignar terminal"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-transparent d-flex justify-content-end align-items-center gap-3">
            <button type="button" className="btn box-terminals-btn box-terminals-btn--secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="button" className="btn box-terminals-btn box-terminals-btn--primary" disabled={!canSubmit || isSubmitting} onClick={() => void handleSubmit()}>
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
        </div>
      </div>

      <div className="mt-2 small text-muted">Caja ID: {boxId}</div>

      {isScannerOpen && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <div>
                    <p className="mb-1 text-uppercase text-muted small">Escáner</p>
                    <h2 className="h4 mb-0">Escanear cajas</h2>
                  </div>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setIsScannerOpen(false)} />
                </div>
                <div className="modal-body">
                  <div className="alert alert-secondary">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <div className="small text-muted">Ubicación</div>
                        <div className="fw-semibold">{state?.ubicacion || "No disponible"}</div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="small text-muted">Caja</div>
                        <div className="fw-semibold">{boxInfo.etiqueta || "-"} · {boxInfo.marca || "-"} · {boxInfo.modelo || "-"}</div>
                      </div>
                      <div className="col-12">
                        <div className="small text-muted">Total escaneados</div>
                        <div className="fw-semibold">{rows.length} / {capacidadMaxima || "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="input-group">
                    <span className="input-group-text">
                      <span className="material-symbols-outlined">qr_code_scanner</span>
                    </span>
                    <input
                      className="form-control"
                      placeholder="Escanear terminal..."
                      value={scannerSN}
                      onChange={(event) => setScannerSN(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void handleAddFromScanner();
                        }
                      }}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => void handleAddFromScanner()} disabled={isAdding}>
                      Añadir
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsScannerOpen(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <SNSearchDeleteConfirmModal
        isOpen={confirmSn !== null}
        isLoading={deletingSn !== null}
        title="Confirmar desasignación"
        message={`¿Seguro que quieres desasignar el terminal ${confirmSn ?? ""} de la caja ${parsedBoxId}?`}
        confirmLabel="Desasignar"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onCancel={() => {
          if (deletingSn !== null) return;
          setConfirmSn(null);
        }}
        onConfirm={() => {
          if (!confirmSn) return;
          void handleUnassignTerminal(confirmSn).finally(() => setConfirmSn(null));
        }}
      />
    </div>
  );
}
