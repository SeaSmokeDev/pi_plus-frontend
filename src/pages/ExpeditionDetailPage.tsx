import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ExpeditionDraftData } from "../types";

const PENDING_EXPEDITION_STORAGE_KEY = "pending_expedition";

import ExpeditionDetailSidebar from "../components/expeditions/ExpeditionDetailSidebar";
// import ExpeditionSummaryPanel from "../components/expeditions/ExpeditionSummaryPanel";

export default function ExpeditionDetailPage() {
  const navigate = useNavigate();
  const { expeditionId } = useParams();

  const isEditMode = Boolean(expeditionId);

  const [draft, setDraft] = useState<ExpeditionDraftData | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

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

  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-xl-row gap-4 align-items-start">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <ExpeditionDetailSidebar
            title={isEditMode ? "Datos de la expedicion" : "Crear expedicion"}
            submitLabel={
              isEditMode ? "Salir Guardando Cambios" : "Guardar expedicion"
            }
            form={draft}
           
            onCancel={() => navigate("/expeditions")}
          />
        </div>

        <div
          className="flex-grow-1 d-flex flex-column gap-4"
          style={{ minWidth: 0 }}
        >
          {/* <ExpeditionSummaryPanel items={form.terminalSummary} />

          <ExpeditionTerminalsPanel
            source={form.terminalSource}
            searchValue={form.terminalSearchValue}
            terminals={form.terminalDetails}
            onSourceChange={(value) => handleFieldChange("terminalSource", value)}
            onSearchValueChange={(value) => handleFieldChange("terminalSearchValue", value)}
          /> */}
        </div>
      </div>
    </div>
  );
}
