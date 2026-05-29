import { useCallback, useState } from "react";
import type { ExpeditionBatchEdit } from "../types";
import { getExpeditionEdit } from "../services/expeditionService";

export function useExpeditionDetail() {
  const [detail, setDetail] = useState<ExpeditionBatchEdit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async (reference: string): Promise<ExpeditionBatchEdit | null> => {
    try {
      setLoading(true);
      setError(null);

      const data = await getExpeditionEdit(reference);
      setDetail(data);
      return data;
    } catch (error) {
      setError("No se ha podido cargar la expedicion para editar.");
      console.error("Error loading expedition detail:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDetail = useCallback(() => {
    setDetail(null);
    setError(null);
  }, []);

  return {
    detail,
    loading,
    error,
    loadDetail,
    clearDetail,
  };
}
