import { useEffect, useState } from "react";
import type { Expedition } from "../types";
import {
  getExpeditionsByAddress,
  getExpeditionsByUser,
  getExpeditionsToday,
} from "../services/expeditionService";

export function useExpeditions() {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpeditionsToday();
      setExpeditions(data);
    } catch (err) {
      setError("Error al cargar las expediciones");
      console.error("Error fetching expeditions:", err);
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
    } catch (err) {
      setError("Error al buscar expediciones por direccion");
      console.error("Error searching expeditions by address:", err);
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
    } catch (err) {
      setError("Error al buscar expediciones por usuario");
      console.error("Error searching expeditions by user:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAll();
  }, []);

  return {
    expeditions,
    loading,
    error,
    searchByAddress,
    searchByUser,
    reload: loadAll,
  };
}
