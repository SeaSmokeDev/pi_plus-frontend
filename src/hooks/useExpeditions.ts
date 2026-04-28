import type { Expedition } from "../types";
import { getExpeditionsToday, getExpeditionsByUser, getExpeditionsByAddress } from "../services/expeditionService";
import { useEffect, useState } from "react";

export function useExpeditions() {
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadAll(){
        try {
            setLoading(true);
            setError(null);
            const data = await getExpeditionsToday();
            setExpeditions(data);
            console.log("Expeditions loaded:", data);
        } catch {
            setError("Error al cargar las expediciones");
            console.error("Error fetching expeditions:", error);
        } finally {
            setLoading(false);
        }
    }

    async function searchByAddress(address: string) {
        try {
            setLoading(true);
            setError(null);
            const data = await getExpeditionsByAddress(address);
            setExpeditions(data);
        } catch {
            setError("Error al buscar expediciones por dirección");
        } finally {
            setLoading(false);
        }
    }

    async function searchByUser(userName: string) {
        try {
            setLoading(true);
            setError(null);
            const data = await getExpeditionsByUser(userName);
            setExpeditions(data);
        } catch {
            setError("Error al buscar expediciones por usuario");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAll();
    }, []);

    return {
        expeditions,
        loading,
        error,
        searchByAddress,
        searchByUser,
        reload: loadAll
    };
}
