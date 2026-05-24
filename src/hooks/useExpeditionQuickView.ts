import { useCallback, useState } from "react";
import type { ExpeditionQuickView } from "../types";
import { getExpeditionQuickView } from "../services/expeditionService";

export function useExpeditionQuickView() {
  const [quickView, setQuickView] = useState<ExpeditionQuickView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuickView = useCallback(async (reference: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getExpeditionQuickView(reference);
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