import { useState } from "react";
import type { CreateExpeditionRequest, Expedition } from "../types";
import { createExpedition } from "../services/expeditionService";

export function useExpeditionsMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function create(data: CreateExpeditionRequest):Promise<Expedition | null>{
        try {
            setLoading(true);
            setError(null);
            const newExpedition = await createExpedition(data);
            return newExpedition;
        } catch (err) {
            setError("Error al crear la expedición");
            console.error("Error creating expedition:", err);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        create,
        loading,
        error,
    };
}