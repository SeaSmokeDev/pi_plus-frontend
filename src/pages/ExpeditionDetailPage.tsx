import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  BoxExpeditionDetail,
  ExpeditionBatchRequest,
  ExpeditionDetailFormData,
  ExpeditionDraftData,
} from "../types";
import { useExpeditionDetail } from "../hooks/useExpeditionDetail";
import { useExpeditionMutationsConfirm } from "../hooks/useExpeditionMutations";
import { useUserId } from "../hooks/useUserId";

import ExpeditionBoxesPanel from "../components/expeditions/ExpeditionBoxesPanel";
import ExpeditionDetailSidebar from "../components/expeditions/ExpeditionDetailSidebar";
import ExpeditionPaymentsPanel from "../components/expeditions/ExpeditionPaymentsPanel";

const PENDING_EXPEDITION_STORAGE_KEY = "pending_expedition";

type SubmitAction = "save" | "confirm";

function toDetailFormFromDraft(draft: ExpeditionDraftData): ExpeditionDetailFormData {
  return {
    username: draft.username,
    direccionDestino: draft.direccionDestino,
    paquetes: draft.paquetes ?? null,
    peso: draft.peso ?? null,
    notas: draft.notas ?? null,
    fechaEnvio: draft.fechaEnvio ?? null,
  };
}

function getTerminalSns(boxes: BoxExpeditionDetail[]): string[] {
  return boxes.flatMap((box) => box.terminales.map((terminal) => terminal.numeroSerie));
}

function findFirstInvalidNewTerminal(
  boxes: BoxExpeditionDetail[],
  existingTerminalSns: Set<string>,
): { numeroSerie: string; estado: string } | null {
  for (const box of boxes) {
    for (const terminal of box.terminales) {
      const isExistingTerminal = existingTerminalSns.has(terminal.numeroSerie);

      if (!isExistingTerminal && terminal.estado !== "operativo") {
        return {
          numeroSerie: terminal.numeroSerie,
          estado: terminal.estado,
        };
      }
    }
  }

  return null;
}

export default function ExpeditionDetailPage() {
  const navigate = useNavigate();
  const { reference } = useParams<{ reference: string }>();
  const isEditMode = Boolean(reference);

  const [form, setForm] = useState<ExpeditionDetailFormData | null>(null);
  const [selectedBoxes, setSelectedBoxes] = useState<BoxExpeditionDetail[]>([]);
  const [existingTerminalSns, setExistingTerminalSns] = useState<Set<string>>(new Set());
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const [submitAction, setSubmitAction] = useState<SubmitAction | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    loading: loadingDetail,
    error: detailError,
    loadDetail,
    clearDetail,
  } = useExpeditionDetail();
  const { user, loading: loadingUser, loadUserId } = useUserId(form?.username);
  const {
    createBatch,
    saveBatch,
    confirmOpenBatch,
    saveOpenBatch,
    loading: mutationLoading,
    error: mutationError,
  } = useExpeditionMutationsConfirm();

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      setLoadingInitialData(true);
      setSubmitError(null);

      if (isEditMode) {
        if (!reference) {
          navigate("/expeditions");
          return;
        }

        const editData = await loadDetail(reference);

        if (!isMounted) return;

        if (!editData) {
          setLoadingInitialData(false);
          return;
        }

        setForm({
          username: editData.username,
          usuarioId: editData.usuarioId,
          direccionDestino: editData.direccionDestino,
          paquetes: editData.paquetes,
          peso: editData.peso,
          notas: editData.notas,
        });
        setSelectedBoxes(editData.cajas ?? []);
        setExistingTerminalSns(new Set(getTerminalSns(editData.cajas ?? [])));
        setLoadingInitialData(false);
        return;
      }

      const savedDraft = sessionStorage.getItem(PENDING_EXPEDITION_STORAGE_KEY);

      if (!savedDraft) {
        navigate("/expeditions");
        return;
      }

      try {
        const parsedDraft = JSON.parse(savedDraft) as ExpeditionDraftData;

        if (!isMounted) return;

        setForm(toDetailFormFromDraft(parsedDraft));
        setSelectedBoxes([]);
        setExistingTerminalSns(new Set());
      } catch (error) {
        console.error("Error parsing expedition draft:", error);
        sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
        navigate("/expeditions");
        return;
      } finally {
        if (isMounted) {
          setLoadingInitialData(false);
        }
      }
    }

    void loadPageData();

    return () => {
      isMounted = false;
      clearDetail();
    };
  }, [clearDetail, isEditMode, loadDetail, navigate, reference]);

  function handleFormChange(field: keyof ExpeditionDetailFormData, value: string) {
    setForm((prev) => {
      if (!prev) return prev;

      const updatedForm: ExpeditionDetailFormData = {
        ...prev,
        [field]:
          field === "paquetes" || field === "peso"
            ? value === ""
              ? null
              : Number(value)
            : value,
      };

      if (!isEditMode) {
        sessionStorage.setItem(
          PENDING_EXPEDITION_STORAGE_KEY,
          JSON.stringify({
            username: updatedForm.username || "",
            direccionDestino: updatedForm.direccionDestino,
            paquetes: updatedForm.paquetes ?? null,
            peso: updatedForm.peso ?? null,
            notas: updatedForm.notas ?? null,
            fechaEnvio: updatedForm.fechaEnvio ?? null,
          } satisfies ExpeditionDraftData),
        );
      }

      return updatedForm;
    });
  }

  function handleCancel() {
    if (!isEditMode) {
      sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
    }

    navigate("/expeditions");
  }

  async function buildRequest(): Promise<ExpeditionBatchRequest | null> {
    if (!form) {
      setSubmitError("No hay datos de expedicion para guardar.");
      return null;
    }

    if (selectedBoxes.length === 0) {
      setSubmitError("Debes añadir al menos una caja a la expedicion.");
      return null;
    }

    const invalidNewTerminal = findFirstInvalidNewTerminal(selectedBoxes, existingTerminalSns);

    if (invalidNewTerminal) {
      setSubmitError(
        invalidNewTerminal.estado === "pendiente_transito"
          ? `El terminal ${invalidNewTerminal.numeroSerie} no se puede añadir porque esta pendiente de transito.`
          : `Solo se pueden añadir terminales en estado operativo. Revisa el terminal ${invalidNewTerminal.numeroSerie}.`,
      );
      return null;
    }

    let usuarioId = form.usuarioId ?? user?.id ?? null;

    if (!usuarioId && form.username) {
      const resolvedUser = await loadUserId(form.username);
      usuarioId = resolvedUser?.id ?? null;
    }

    if (!usuarioId) {
      setSubmitError("No se ha podido obtener el usuario asignado.");
      return null;
    }

    return {
      direccionDestino: form.direccionDestino,
      paquetes: form.paquetes ?? null,
      peso: form.peso ?? null,
      notas: form.notas ?? null,
      usuarioId,
      cajaIds: selectedBoxes.map((box) => box.id),
    };
  }

  async function submitExpedition(action: SubmitAction) {
    setSubmitError(null);
    setSubmitAction(action);

    try {
      const request = await buildRequest();

      if (!request) return;

      const result =
        isEditMode && reference
          ? action === "confirm"
            ? await confirmOpenBatch(reference, request)
            : await saveOpenBatch(reference, request)
          : action === "confirm"
            ? await createBatch(request)
            : await saveBatch(request);

      if (!result) return;

      sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
      navigate("/expeditions");
    } finally {
      setSubmitAction(null);
    }
  }

  function handleRequestConfirmExpedition() {
    setSubmitError(null);
    setIsConfirmModalOpen(true);
  }

  function handleCloseConfirmModal() {
    if (submitAction) return;
    setIsConfirmModalOpen(false);
  }

  async function handleAcceptConfirmExpedition() {
    setIsConfirmModalOpen(false);
    await submitExpedition("confirm");
  }

  function handleAddBox(box: BoxExpeditionDetail) {
    const alreadyExists = selectedBoxes.some((selectedBox) => selectedBox.id === box.id);
    if (alreadyExists) return;

    setSelectedBoxes((prev) => [...prev, box]);
  }

  function handleRemoveBox(boxId: number) {
    setSelectedBoxes((prev) => prev.filter((box) => box.id !== boxId));
  }

  if (loadingInitialData || loadingDetail) {
    return <div className="container p-4">Cargando expedicion...</div>;
  }

  if (detailError) {
    return <div className="container p-4 text-danger">Error: {detailError}</div>;
  }

  if (!form) {
    return <div className="container p-4">No hay datos de expedicion.</div>;
  }

  const actionError = submitError || mutationError;
  const isSaving = submitAction === "save" && (mutationLoading || loadingUser || Boolean(submitAction));
  const isConfirming = submitAction === "confirm" && (mutationLoading || loadingUser || Boolean(submitAction));

  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      {actionError && (
        <div className="alert alert-danger mb-0" role="alert">
          {actionError}
        </div>
      )}

      <div className="d-flex flex-column flex-xl-row gap-4 align-items-start">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <ExpeditionDetailSidebar
            title={isEditMode ? "Editar expedicion" : "Crear expedicion"}
            reference={reference ?? null}
            form={form}
            onChange={handleFormChange}
            onSave={() => void submitExpedition("save")}
            onConfirm={handleRequestConfirmExpedition}
            onCancel={handleCancel}
            saving={isSaving}
            confirming={isConfirming}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column gap-4" style={{ minWidth: 0 }}>
          <ExpeditionBoxesPanel
            boxes={selectedBoxes}
            onAddBox={handleAddBox}
            onRemoveBox={handleRemoveBox}
          />
          <ExpeditionPaymentsPanel boxes={selectedBoxes} />
        </div>
      </div>

      {isConfirmModalOpen && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h2 className="modal-title h5 mb-0">Confirmar expedicion</h2>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={handleCloseConfirmModal}
                    disabled={Boolean(submitAction)}
                  />
                </div>

                <div className="modal-body">
                  <p className="mb-0">Estas seguro de enviar esta expedicion?</p>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseConfirmModal}
                    disabled={Boolean(submitAction)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => void handleAcceptConfirmExpedition()}
                    disabled={Boolean(submitAction)}
                  >
                    {isConfirming ? "Enviando..." : "Si, enviar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
