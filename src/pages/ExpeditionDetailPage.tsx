import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { BoxExpeditionDetail, ExpeditionDraftData } from "../types";

const PENDING_EXPEDITION_STORAGE_KEY = "pending_expedition";

import ExpeditionDetailSidebar from "../components/expeditions/ExpeditionDetailSidebar";
import ExpeditionBoxesPanel from "../components/expeditions/ExpeditionBoxesPanel";
// import ExpeditionSummaryPanel from "../components/expeditions/ExpeditionSummaryPanel";

export default function ExpeditionDetailPage() {
  const navigate = useNavigate();
  const { expeditionId } = useParams();

  const isEditMode = Boolean(expeditionId);

  const [draft, setDraft] = useState<ExpeditionDraftData | null>(null);
  // const [form, setForm] = useState<ExpeditionDetailFormData | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [selectedBoxes, setSelectedBoxes] = useState<BoxExpeditionDetail[]>([]);

  useEffect(() => {
    if (isEditMode) {
      setLoadingDraft(false);
      return;
    }

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
  }, [isEditMode, navigate]);

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
    if (!isEditMode) {
      sessionStorage.removeItem(PENDING_EXPEDITION_STORAGE_KEY);
    }

    navigate("/expeditions");
  }

  function handleSubmit() {
    if (!draft) return;

    console.log("Guardar expedición/lote pendiente:", draft);
  }

  if (loadingDraft) {
    return <div className="container p-4">Cargando expedición...</div>;
  }

  if (isEditMode) {
    return (
      <div className="container-fluid p-4">
        <section className="card border-0 shadow-sm">
          <div className="card-body">
            <h1 className="h4 fw-bold mb-2">Datos de la expedición</h1>
            <p className="text-muted mb-3">
              La edición por referencia se implementará cuando el backend devuelva el lote completo.
            </p>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/expeditions")}
            >
              Volver al listado
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="container p-4">
        No hay datos de expedición.
      </div>
    );
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
          {!isEditMode && draft && (
            <ExpeditionDetailSidebar
            title="Crear expedición"
            submitLabel="Guardar expedición"
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
          <ExpeditionBoxesPanel boxes={selectedBoxes} onAddBox={handleAddBox} onRemoveBox={handleRemoveBox} />
          {/* <ExpeditionSummaryPanel boxes={selectedBoxes} /> */}
        </div>
      </div>
    </div>
  );
}
