import type {
  Expedition,
  CreateExpeditionRequest,
  UpdateExpeditionRequest,
  ExpeditionFilters,
  ExpeditionList,
} from "../types";
import { apiRequest } from "./apiClient";

export function getAllExpeditions() {
  return apiRequest<Expedition[]>("/expediciones");
}

export function getExpeditionsToday() {
  return apiRequest<Expedition[]>("/expediciones/today");
}

export function getExpedition(id: number) {
  return apiRequest<Expedition>(`/expediciones/${id}`);
}

export function getExpeditionsByUser(userName: string) {
  return apiRequest<Expedition[]>(`/expediciones/nombre/usuario/${userName}`);
}

export function getExpeditionsByAddress(address: string) {
  return apiRequest<Expedition[]>(`/expediciones/direccion=${encodeURIComponent(address)}`);
}

export function getExpeditionsListToday() {
  return apiRequest<ExpeditionList[]>("/expediciones/today/list");
}

export function searchExpeditionsList(filters: ExpeditionFilters) {
  const params = new URLSearchParams();

  if (filters.fechaCreacionDesde) {
    params.set("fechaCreacionDesde", filters.fechaCreacionDesde);
  }
  if (filters.fechaCreacionHasta) {
    params.set("fechaCreacionHasta", filters.fechaCreacionHasta);
  }
  if (filters.fechaRecepcionDesde) {
    params.set("fechaRecepcionDesde", filters.fechaRecepcionDesde);
  }
  if (filters.fechaRecepcionHasta) {
    params.set("fechaRecepcionHasta", filters.fechaRecepcionHasta);
  }
  if (filters.usuarioId !== null) {
    params.set("usuarioId", String(filters.usuarioId));
  }
  if (filters.direccionDestino.trim()) {
    params.set("destino", filters.direccionDestino.trim());
  }
  if (filters.estado) {
    params.set("estado", filters.estado);
  }

  const query = params.toString();
  // console.log("Query params for searchExpeditionsList:", query);
  return apiRequest<ExpeditionList[]>(
    query ? `/expediciones/search?${query}` : "/expediciones/search"
  );
}

export function createExpedition(expedition: CreateExpeditionRequest) {
  return apiRequest<Expedition>("/expediciones", {
    method: "POST",
    body: JSON.stringify(expedition),
  });
}

export function updateExpedition(id: number, expedition: UpdateExpeditionRequest) {
  return apiRequest<Expedition>(`/expediciones/${id}`, {
    method: "PUT",
    body: JSON.stringify(expedition),
  });
}

export function deleteExpedition(id: number) {
  return apiRequest<void>(`/expediciones/${id}`, {
    method: "DELETE",
  });
}
