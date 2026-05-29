import { useCallback, useState } from "react";
import type { ExpeditionBatchEdit } from "../types";
import { getExpeditionEdit } from "../services/expeditionService";


export function useExpeditionDetail() {
  const [quickView, setQuickView] = useState<ExpeditionBatchEdit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuickView = useCallback(async (reference: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getExpeditionEdit(reference);
      setQuickView(data);
    } catch (error) {
      setError("No se ha podido cargar la vista rápida de la expedición.");
      console.error("Error loading expedition quick view:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearQuickView = useCallback(() => {
    setQuickView(null);
    setError(null);
  }, []);

  return {
    quickView,
    loading,
    error,
    loadQuickView,
    clearQuickView,
  };
}