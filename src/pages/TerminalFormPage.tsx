import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TerminalFormHeader from "../components/terminal-form/TerminalFormHeader";
import TerminalReadonlyInfo from "../components/terminal-form/TerminalReadonlyInfo";
import TerminalEditableInfo from "../components/terminal-form/TerminalEditableForm";
import { getTerminalBrandModels } from "../services/terminalCatalogService";
import { createTerminal, getTerminalEditBySn, updateTerminal } from "../services/paymentService";
import type { PaymentFormData, TerminalBrandModel, TerminalEdit, TerminalStatus } from "../types";

type TerminalFormLocationState = {
  mode?: "create" | "edit";
  terminalId?: number;
  terminalSN?: string;
};

const initialForm: PaymentFormData = {
  marca: "",
  modelo: "",
  estado: "pendiente_revision",
  notas: "",
};

function TerminalFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as TerminalFormLocationState | null;
  const isCreateMode = locationState?.mode === "create";
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<PaymentFormData>(initialForm);
  const [terminal, setTerminal] = useState<TerminalEdit | null>(null);
  const [brandModels, setBrandModels] = useState<TerminalBrandModel[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(!isCreateMode);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdSerialNumber, setCreatedSerialNumber] = useState("");
  const brands = useMemo(() => [...new Set(brandModels.map((item) => item.marca))], [brandModels]);
  const models = useMemo(
    () => brandModels.filter((item) => item.marca === form.marca).map((item) => item.modelo),
    [brandModels, form.marca],
  );

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  function scheduleSearchRedirect() {
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);

    redirectTimeoutRef.current = setTimeout(() => {
      navigate("/search");
    }, 2500);
  }

  useEffect(() => {
    if (!isCreateMode) return;

    let isMounted = true;

    async function loadBrands() {
      try {
        setLoadingBrands(true);
        const data = await getTerminalBrandModels();
        if (isMounted) setBrandModels(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "No se han podido cargar las marcas.");
      } finally {
        if (isMounted) setLoadingBrands(false);
      }
    }

    void loadBrands();

    return () => {
      isMounted = false;
    };
  }, [isCreateMode]);

  useEffect(() => {
    if (isCreateMode) return;

    let isMounted = true;
    const terminalSN = locationState?.terminalSN;

    async function loadTerminal() {
      if (!terminalSN) {
        setErrorMessage("No se ha recibido un numero de serie para editar.");
        setLoadingInitialData(false);
        return;
      }

      try {
        setLoadingInitialData(true);
        const data = await getTerminalEditBySn(terminalSN);

        if (!isMounted) return;

        setTerminal(data);
        setForm({
          marca: data.marca,
          modelo: data.modelo,
          estado: data.estado === "en_transito" || data.estado === "pendiente_transito" ? "pendiente_revision" : data.estado,
          notas: data.notas || "",
        });
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "No se ha podido cargar el terminal.");
        }
      } finally {
        if (isMounted) setLoadingInitialData(false);
      }
    }

    void loadTerminal();

    return () => {
      isMounted = false;
    };
  }, [isCreateMode, locationState?.terminalSN]);

  function handleChange(field: keyof PaymentFormData, value: string) {
    setFeedback("");
    setErrorMessage("");
    setCreatedSerialNumber("");

    setForm((prev) => ({
      ...prev,
      [field]:
        field === "estado"
          ? (value as TerminalStatus)
          : value,
      ...(field === "marca" ? { modelo: "" } : {}),
    }));
  }

  async function handleSave() {
    setFeedback("");
    setErrorMessage("");
    setCreatedSerialNumber("");

    if (isCreateMode && (!form.marca || !form.modelo)) {
      setErrorMessage("Selecciona marca y modelo antes de guardar.");
      return;
    }

    try {
      setSaving(true);

      if (isCreateMode) {
        const created = await createTerminal({
          marca: form.marca,
          modelo: form.modelo,
          estado: form.estado,
          notas: form.notas.trim() || null,
        });

        setCreatedSerialNumber(created.numeroSerie || "");
        setFeedback(
          created.numeroSerie
            ? `${created.mensaje} Numero de serie: ${created.numeroSerie}. Volviendo a busqueda...`
            : `${created.mensaje} El backend no ha devuelto numero de serie. Volviendo a busqueda...`,
        );
        scheduleSearchRedirect();
        return;
      }

      const terminalSN = terminal?.numeroSerie ?? locationState?.terminalSN;

      if (!terminalSN) {
        setErrorMessage("No se ha podido identificar el terminal para actualizar.");
        return;
      }

      const updated = await updateTerminal(terminalSN, {
        estado: form.estado,
        notas: form.notas.trim() || null,
      });

      setTerminal((prev) =>
        prev
          ? {
              ...prev,
              estado: updated.estado,
              notas: updated.notas,
            }
          : prev,
      );
      setFeedback("Terminal actualizado correctamente. Volviendo a busqueda...");
      scheduleSearchRedirect();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "No se pudo guardar el terminal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopyCreatedSn() {
    if (!createdSerialNumber) return;

    try {
      await navigator.clipboard.writeText(createdSerialNumber);
      setFeedback(`Numero de serie ${createdSerialNumber} copiado.`);
    } catch {
      setErrorMessage("No se ha podido copiar el numero de serie.");
    }
  }

  if (loadingInitialData) {
    return <div className="container py-4">Cargando terminal...</div>;
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <TerminalFormHeader isCreateMode={isCreateMode} isSaving={saving} onSave={() => void handleSave()} />
        <div className="card-body">
          {feedback && <div className="alert alert-success">{feedback}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          {createdSerialNumber && (
            <div className="rounded-3 border bg-light-subtle p-3 mb-4">
              <div className="text-muted small mb-1">Numero de serie generado</div>
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3">
                <code className="h4 mb-0">{createdSerialNumber}</code>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => void handleCopyCreatedSn()}>
                  Copiar
                </button>
              </div>
            </div>
          )}

          <TerminalReadonlyInfo
            isCreateMode={isCreateMode}
            terminalSN={terminal?.numeroSerie ?? locationState?.terminalSN}
            form={form}
            brands={brands}
            models={models}
            loadingBrands={loadingBrands}
            loadingModels={false}
            onChange={handleChange}
          />
          <hr className="my-4" />
          <TerminalEditableInfo
            isCreateMode={isCreateMode}
            form={form}
            currentBox={terminal?.caja ?? null}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default TerminalFormPage;
