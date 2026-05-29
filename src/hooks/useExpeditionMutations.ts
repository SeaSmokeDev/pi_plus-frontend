import { useState } from "react";
import type { ExpeditionBatchRequest, ExpeditionGroupList  } from "../types";
import { confirmExpeditionBatch, createExpeditionBatch, saveExpeditionBatch, saveExpeditionOpenBatch } from "../services/expeditionService";

export function useExpeditionMutationsConfirm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function createBatch(data: ExpeditionBatchRequest):Promise<ExpeditionGroupList | null>{
        try {
            setLoading(true);
            setError(null);

            return await createExpeditionBatch(data);
            
        } catch (err) {
            setError("Error al crear la expedición");
            console.error("Error creating expedition:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function saveBatch(data: ExpeditionBatchRequest):Promise<ExpeditionGroupList | null>{
        try {
            setLoading(true);
            setError(null);

            return await saveExpeditionBatch(data);
            
        } catch (err) {
            setError("Error al crear la expedición");
            console.error("Error creating expedition:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function confirmOpenBatch(reference: string, data: ExpeditionBatchRequest):Promise<ExpeditionGroupList | null>{
        try {
            setLoading(true);
            setError(null);

            return await confirmExpeditionBatch(reference, data);
            
        } catch (err) {
            setError("Error al crear la expedición");
            console.error("Error creating expedition:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    async function saveOpenBatch(reference: string, data: ExpeditionBatchRequest):Promise<ExpeditionGroupList | null>{
        try {
            setLoading(true);
            setError(null);

            return await saveExpeditionOpenBatch(reference, data);
            
        } catch (err) {
            setError("Error al crear la expedición");
            console.error("Error creating expedition:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        createBatch,
        saveBatch,
        confirmOpenBatch,
        saveOpenBatch,
        loading,
        error,
    };
}