import { useEffect, useState } from "react";
import type { ExpeditionFilters, ExpeditionGroupList} from "../types";
import {
  getExpeditionsGroupedByReference,
  getExpeditionsGroupedByReferenceWithFilters,

} from "../services/expeditionService";

export function useExpeditions() {
  const [expeditionsGrouped, setExpeditionsGrouped] = useState<ExpeditionGroupList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAllGroupToday() {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpeditionsGroupedByReference();
      setExpeditionsGrouped(data);
    } catch (error) {
      setError("Error al cargar las expediciones agrupadas");
      console.error("Error fetching grouped expeditions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchGroupWithFilters(filters: ExpeditionFilters) {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpeditionsGroupedByReferenceWithFilters(filters);
      setExpeditionsGrouped(data);
    } catch (error) {
      setError("Error al buscar expediciones agrupadas con filtros");
      console.error("Error searching grouped expeditions with filters:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAllGroupToday();
  }, []);

  return {
    expeditionsGrouped,
    loading,
    error,
    reloadGrouped: loadAllGroupToday,
    searchGroupWithFilters,
  };
}
