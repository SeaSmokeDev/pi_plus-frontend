import type { ExpeditionList, Payment } from "../types";
import type { WarehouseMapItem } from "../types/warehouseMap.types";
import { apiRequest } from "./apiClient";

type CountResponse =
  | number
  | {
      count?: number;
      total?: number;
      value?: number;
      terminales?: number;
      cajas?: number;
      palets?: number;
      ubicaciones?: number;
    };

export type DashboardCounts = {
  terminales: number;
  cajas: number;
  palets: number;
  ubicaciones: number;
  expedicionesHoy: number;
};

function normalizeCount(data: CountResponse): number {
  if (typeof data === "number") {
    return data;
  }

  const candidates = [data.count, data.total, data.value, data.terminales, data.cajas, data.palets, data.ubicaciones];
  const firstNumber = candidates.find((item) => typeof item === "number" && Number.isFinite(item));
  return firstNumber ?? 0;
}

export async function getTerminalesCount() {
  const data = await apiRequest<CountResponse>("/terminales/count");
  return normalizeCount(data);
}

export async function getCajasCount() {
  const data = await apiRequest<CountResponse>("/cajas/count");
  return normalizeCount(data);
}

export async function getPaletsCount() {
  const data = await apiRequest<CountResponse>("/palets/count");
  return normalizeCount(data);
}

export async function getUbicacionesCount() {
  const data = await apiRequest<CountResponse>("/ubicaciones/count");
  return normalizeCount(data);
}

export async function getExpedicionesTodayList() {
  return apiRequest<ExpeditionList[]>("/expediciones/today/list");
}

export async function getTerminales() {
  return apiRequest<Payment[]>("/terminales");
}

export async function getCajas() {
  return apiRequest<Array<{ id: number; etiqueta: string; modeloProducto?: string | null }>>("/cajas");
}

export async function getUbicacionesMapa() {
  return apiRequest<WarehouseMapItem[]>("/ubicaciones/mapa");
}

export async function getExpedicionesList() {
  return apiRequest<ExpeditionList[]>("/expediciones/list");
}
