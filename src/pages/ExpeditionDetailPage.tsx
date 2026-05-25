import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import type {
  BoxExpeditionDetail,
  ExpeditionDraftData,
  CreateExpeditionBatchRequest,
} from "../types";
import { useUserId } from "../hooks/useUserId";
import { useExpeditionMutations } from "../hooks/useExpeditionMutations";

import ExpeditionDetailSidebar from "../components/expeditions/ExpeditionDetailSidebar";
import ExpeditionBoxesPanel from "../components/expeditions/ExpeditionBoxesPanel";
import ExpeditionPaymentsPanel from "../components/expeditions/ExpeditionPaymentsPanel";

const PENDING_EXPEDITION_STORAGE_KEY = "pending_expedition";

export default function ExpeditionDetailPage() {
  const navigate = useNavigate();
  // const { reference } = useParams();

  // const isEditMode = Boolean(reference);

  const [draft, setDraft] = useState<ExpeditionDraftData | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [selectedBoxes, setSelectedBoxes] = useState<BoxExpeditionDetail[]>([]);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user, loading: loadingUser, loadUserId } = useUserId(draft?.username);

  const { createBatch } = useExpeditionMutations();

  useEffect(() => {
    // if (isEditMode) {
    //   setLoadingDraft(false);
    //   return;
    // }

    const savedDraft = sessionStorage.getItem(PENDING_EXPEDITION_STORAGE_KEY);

    if (!savedDraft) {
      navigate("/expeditions");
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as ExpeditionDraftData;
      setDraft(parsedDraft);
    } catch (error) {
      console.error("Error parsing expedition draft:", error);
      sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
      navigate("/expeditions");
      return;
    } finally {
      setLoadingDraft(false);
    }
  }, [navigate]);

  if (loadingDraft) {
    return <div className="container p-4">Cargando expedición...</div>;
  }

  function handleDraftChange(field: keyof ExpeditionDraftData, value: string) {
    setDraft((prev) => {
      if (!prev) return prev;

      const updatedDraft = {
        ...prev,
        [field]:
          field === "paquetes" || field === "peso"
            ? value === ""
              ? null
              : Number(value)
            : value,
      };

      sessionStorage.setItem(
        PENDING_EXPEDITION_STORAGE_KEY,
        JSON.stringify(updatedDraft),
      );

      return updatedDraft;
    });
  }

  function handleCancel() {
    sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
    navigate("/expeditions");
  }

  async function handleSubmit() {
    if (!draft) return;
    console.log("Submitting expedition with data:", draft, "and selected boxes:", selectedBoxes);


    if (selectedBoxes.length === 0) {
      setSubmitError("Debes añadir al menos una caja a la expedición.");
      return;
    }

    const resolvedUser = user ?? await loadUserId(draft.username);

    if (!resolvedUser) {
      setSubmitError("No se ha podido obtener el usuario asignado.");
      return;
    }

    const request: CreateExpeditionBatchRequest = {
      direccionDestino: draft.direccionDestino,
      paquetes: draft.paquetes ?? 0,
      peso: draft.peso ?? 0,
      notas: draft.notas ?? null,
      fechaEnvio: draft.fechaEnvio ?? null,
      usuarioId: resolvedUser.id,
      cajaIds: selectedBoxes.map((box) => box.id),
    };

    const result = await createBatch(request);

    if (!result) return;

    sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
    navigate("/expeditions");
  }

  if (loadingDraft) {
    return <div className="container p-4">Cargando expedición...</div>;
  }

  // if (isEditMode) {
  //   return (
  //     <div className="container-fluid p-4">
  //       <section className="card border-0 shadow-sm">
  //         <div className="card-body">
  //           <h1 className="h4 fw-bold mb-2">Datos de la expedición</h1>
  //           <p className="text-muted mb-3">
  //             La edición por referencia se implementará cuando el backend
  //             devuelva el lote completo.
  //           </p>

  //           <button
  //             type="button"
  //             className="btn btn-outline-secondary"
  //             onClick={() => navigate("/expeditions")}
  //           >
  //             Volver al listado
  //           </button>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  if (!draft) {
    return <div className="container p-4">No hay datos de expedición.</div>;
  }

  function handleAddBox(box: BoxExpeditionDetail) {
    const alreadyExists = selectedBoxes.some(
      (selectedBox) => selectedBox.id === box.id,
    );
    if (alreadyExists) return;

    setSelectedBoxes((prev) => [...prev, box]);
  }

  function handleRemoveBox(boxId: number) {
    setSelectedBoxes((prev) => prev.filter((box) => box.id !== boxId));
  }

  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-xl-row gap-4 align-items-start">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {draft && (
            <ExpeditionDetailSidebar
              title="Crear expedición"
              submitLabel={saving || loadingUser ? "Guardando..." : "Guardar expedición"}
              form={draft}
              onChange={handleDraftChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>

        <div
          className="flex-grow-1 d-flex flex-column gap-4"
          style={{ minWidth: 0 }}
        >
          <ExpeditionBoxesPanel
            boxes={selectedBoxes}
            onAddBox={handleAddBox}
            onRemoveBox={handleRemoveBox}
          />
          <ExpeditionPaymentsPanel boxes={selectedBoxes} />
        </div>
      </div>
    </div>
  );
}
