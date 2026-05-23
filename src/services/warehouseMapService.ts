import type { WarehouseMapItem } from "../types/warehouseMap.types";
import { apiRequest } from "./apiClient";

export type WarehouseMapQuery = {
  pasilloId?: number | null;
  desde?: number;
  limite?: number;
};

export async function getWarehouseMap(query: WarehouseMapQuery = {}): Promise<WarehouseMapItem[]> {
  const params = new URLSearchParams();

  if (typeof query.pasilloId === "number") {
    params.set("pasilloId", String(query.pasilloId));
  }
  if (typeof query.desde === "number") {
    params.set("desde", String(query.desde));
  }
  if (typeof query.limite === "number") {
    params.set("limite", String(query.limite));
  }

  const suffix = params.toString();
  const endpoint = suffix ? `/ubicaciones/mapa?${suffix}` : "/ubicaciones/mapa";
  console.log("[GET] /api/ubicaciones/mapa", { endpoint, query });
  const items = await apiRequest<WarehouseMapItem[]>(endpoint);
  console.log("[GET] /api/ubicaciones/mapa response", { total: items.length });
  return items;
}
