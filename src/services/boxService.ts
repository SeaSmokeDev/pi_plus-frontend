import { apiRequest } from "./apiClient";
import type { BoxExpeditionDetail } from "../types";

export function getBoxExpeditionDetail(etiqueta: string) {
  return apiRequest<BoxExpeditionDetail>(`/cajas/expedicion-detail/${etiqueta}`);
}