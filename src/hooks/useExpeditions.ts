import { useEffect, useState } from "react";
import type { ExpeditionFilters, ExpeditionGroupList} from "../types";
import {
  getExpeditionsGroupedByReference,
  getExpeditionsGroupedByReferenceWithFilters,

} from "../services/expeditionService";

export function useExpeditions() {
  // const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  // const [expeditionsList, setExpeditionsList] = useState<ExpeditionList[]>([]);
  const [expeditionsGrouped, setExpeditionsGrouped] = useState<ExpeditionGroupList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // async function loadAll() {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getExpeditionsToday();
  //     setExpeditions(data);
  //   } catch (err) {
  //     setError("Error al cargar las expediciones");
  //     console.error("Error fetching expeditions:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function loadAllList() {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getExpeditionsListToday();
  //     setExpeditionsList(data);
  //   } catch (err) {
  //     setError("Error al cargar la lista de expediciones");
  //     console.error("Error fetching expeditions list:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function searchList(filters: ExpeditionFilters) {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await searchExpeditionsList(filters);
  //     setExpeditionsList(data);
  //   } catch (err) {
  //     setError("Error al buscar expediciones con filtros");
  //     console.error("Error searching expeditions list:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

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

  // async function searchByAddress(address: string) {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getExpeditionsByAddress(address);
  //     setExpeditions(data);
  //   } catch (err) {
  //     setError("Error al buscar expediciones por direccion");
  //     console.error("Error searching expeditions by address:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // async function searchByUser(userName: string) {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getExpeditionsByUser(userName);
  //     setExpeditions(data);
  //   } catch (err) {
  //     setError("Error al buscar expediciones por usuario");
  //     console.error("Error searching expeditions by user:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

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
