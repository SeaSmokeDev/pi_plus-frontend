import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExpeditionDetailSidebar from "../components/expeditions/ExpeditionDetailSidebar";
import ExpeditionSummaryPanel from "../components/expeditions/ExpeditionSummaryPanel";
import ExpeditionTerminalsPanel from "../components/expeditions/ExpeditionTerminalsPanel";
// import {
//   createNewExpeditionDraft,
//   expeditionDetailsMock,
// } from "../components/expeditions/mockData";
// import type { ExpeditionDetailData } from "../components/expeditions/types";

export default function ExpeditionDetailPage() {
  const navigate = useNavigate();
  const { expeditionId } = useParams();
  const parsedExpeditionId = expeditionId ? Number(expeditionId) : undefined;
  const isEditMode = Boolean(parsedExpeditionId);

  // const initialData = useMemo<ExpeditionDetailData>(() => {
  //   if (parsedExpeditionId && expeditionDetailsMock[parsedExpeditionId]) {
  //     return expeditionDetailsMock[parsedExpeditionId];
  //   }

  //   return createNewExpeditionDraft();
  // }, [parsedExpeditionId]);

  // const [form, setForm] = useState<ExpeditionDetailData>(initialData);

  // const handleFieldChange = (field: keyof ExpeditionDetailData, value: string) => {
  //   setForm((prev) => ({ ...prev, [field]: value }));
  // };

  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-xl-row gap-4 align-items-start">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* <ExpeditionDetailSidebar
            title={isEditMode ? "Datos de la expedicion" : "Crear expedicion"}
            submitLabel={isEditMode ? "Salir Guardando Cambios" : "Guardar expedicion"}
            form={form}
            onChange={handleFieldChange}
            onCancel={() => navigate("/expeditions")}
          /> */}
        </div>

        <div className="flex-grow-1 d-flex flex-column gap-4" style={{ minWidth: 0 }}>
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
