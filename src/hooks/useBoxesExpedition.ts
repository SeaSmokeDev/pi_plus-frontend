import { useState } from "react";
import type { BoxExpeditionDetail } from "../types";
import { getBoxExpeditionDetail } from "../services/boxService";

export function useBoxesExpedition() {
  const [boxes, setBoxes] = useState<BoxExpeditionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


    async function loadBoxExpeditionDetail(etiqueta: string) {
        try {
            setLoading(true);
            setError(null);
            const data = await getBoxExpeditionDetail(etiqueta);
            setBoxes(data);
        } catch (error) {
            setError("Error loading box expedition detail");
            console.error("Error fetching box expedition detail:", error);
        } finally {
            setLoading(false);
        }
    }

    return{
        boxes,
        loading,
        error,
        loadBoxExpeditionDetail
    }
}