import type {
  Expedition,
  ExpeditionBatchRequest,
  ExpeditionFilters,
  ExpeditionList,
  ExpeditionGroupList,
  ExpeditionQuickView,
  ExpeditionBatchEdit,
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

export function getExpeditionsListToday() {
  return apiRequest<ExpeditionList[]>("/expediciones/today/list");
}

export function getExpeditionsGroupedByReference() {
  return apiRequest<ExpeditionGroupList[]>("/expediciones/grouped/today");
}

export function getExpeditionsGroupedByReferenceWithFilters(filters: ExpeditionFilters) {
  const params = new URLSearchParams();

  if (filters.referenciaExpedicion.trim()) {
    params.set("referenciaExpedicion", filters.referenciaExpedicion.trim());
  }
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
  if(filters.fechaEnvio) {
    params.set("fechaEnvio", filters.fechaEnvio);
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
  return apiRequest<ExpeditionGroupList[]>(
    query ? `/expediciones/grouped/search?${query}` : "/expediciones/grouped/search"
  );
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

export function getExpeditionQuickView(reference: string) {
  return apiRequest<ExpeditionQuickView>(
    `/expediciones/referencia/${reference}/resumen`
  );
}

export function getExpeditionEdit(reference: string) {
  return apiRequest<ExpeditionBatchEdit>(
    `/expediciones/referencia/${reference}/edit`
  );
}

export function createExpeditionBatch(data: ExpeditionBatchRequest) {
  return apiRequest<ExpeditionGroupList>("/expediciones/lote/confirmar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function saveExpeditionBatch(data: ExpeditionBatchRequest) {
  return apiRequest<ExpeditionGroupList>("/expediciones/lote/guardar", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function confirmExpeditionBatch(reference: string, data: ExpeditionBatchRequest) {
  return apiRequest<ExpeditionGroupList>(`/expediciones/referencia/${reference}/confirmar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function saveExpeditionOpenBatch(reference: string, data: ExpeditionBatchRequest) {
  return apiRequest<ExpeditionGroupList>(`/expediciones/referencia/${reference}/guardar`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}


export function deleteExpedition(id: number) {
  return apiRequest<void>(`/expediciones/${id}`, {
    method: "DELETE",
  });
}
