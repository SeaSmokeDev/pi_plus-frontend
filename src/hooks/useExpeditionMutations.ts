import { useState } from "react";
import type { CreateExpeditionBatchRequest, ExpeditionGroupList  } from "../types";
import { createExpeditionBatch } from "../services/expeditionService";

export function useExpeditionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function createBatch(data: CreateExpeditionBatchRequest):Promise<ExpeditionGroupList | null>{
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

    return {
        createBatch,
        loading,
        error,
    };
}