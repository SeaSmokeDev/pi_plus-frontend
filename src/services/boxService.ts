
import { apiUrl } from "../auth/session";
import { ApiHttpError, apiRequest } from "./apiClient";
import type { BoxExpeditionDetail } from "../types";

export function getBoxExpeditionDetail(etiqueta: string) {
  return apiRequest<BoxExpeditionDetail>(`/cajas/expedicion-detail/${etiqueta}`);
}

export type CreateBoxPayload = {
  etiqueta: string;
  modelo: string;
  marca: string;
  unidades: number;
  capacidadTotal: number;
  paletId?: number | null;
};

export type CreatedBox = {
  id: number;
  etiqueta: string;
  modeloProducto?: string;
  paletId?: number | null;
};

export type FreeBox = {
  id: number;
  etiqueta: string;
  modeloProducto: string;
  maxCapacity: number;
  palet?: { id: number } | null;
};

type CreateBoxApiResponse = {
  id?: number;
  cajaId?: number;
  insertCaja?: CreatedBox;
  caja?: CreatedBox;
  box?: CreatedBox;
  createdBox?: CreatedBox;
  data?: { id?: number; cajaId?: number };
  mensaje?: string;
  message?: string;
  error?: string;
};

export interface BoxCapacityResponse {
  cajaId: number;
  terminalesActuales: number;
  capacidadMaxima: number;
}

export type AssignBoxToPalletPayload = {
  paletId: number;
};

function sanitizeBackendError(message?: string): string {
  if (!message) return "No se pudo completar la operación con cajas.";
  if (message.includes("Duplicate entry") || message.includes("constraint [cajas.etiqueta]")) {
    return "Ya existe una caja con esa etiqueta. Usa una etiqueta diferente o selecciona una caja registrada.";
  }
  return message;
}

export async function createBox(payload: CreateBoxPayload): Promise<CreatedBox> {
  const modeloCompleto = `${payload.marca.trim()} ${payload.modelo.trim()}`.trim();
  const requestBody = {
    etiqueta: payload.etiqueta,
    modeloProducto: modeloCompleto,
    maxCapacity: payload.capacidadTotal,
    paletId: typeof payload.paletId === "number" ? payload.paletId : null,
  };

  console.log("[createBox] payload enviado a POST /api/cajas:", requestBody);

  const response = await fetch(apiUrl("/cajas"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  const data = (await response.json().catch(() => null)) as CreateBoxApiResponse | null;

  console.log("[createBox] response status:", response.status);
  console.log("[createBox] response headers:", Object.fromEntries(response.headers.entries()));
  console.log("[createBox] response body:", data);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Sesión expirada o sin permisos para crear cajas. Inicia sesión de nuevo.");
    }
    throw new Error(sanitizeBackendError(data?.message || data?.error));
  }

  const created = data?.insertCaja || data?.caja || data?.box || data?.createdBox;

  if (created?.id) {
    return created;
  }

  if (typeof data?.id === "number") {
    return {
      id: data.id,
      etiqueta: payload.etiqueta,
      modeloProducto: modeloCompleto,
      paletId: payload.paletId ?? null,
    };
  }

  if (typeof data?.cajaId === "number") {
    return {
      id: data.cajaId,
      etiqueta: payload.etiqueta,
      modeloProducto: modeloCompleto,
      paletId: payload.paletId ?? null,
    };
  }

  if (typeof data?.data?.id === "number" || typeof data?.data?.cajaId === "number") {
    return {
      id: data?.data?.id ?? (data?.data?.cajaId as number),
      etiqueta: payload.etiqueta,
      modeloProducto: modeloCompleto,
      paletId: payload.paletId ?? null,
    };
  }

  const locationHeader = response.headers.get("Location") || response.headers.get("location");
  if (locationHeader) {
    const match = locationHeader.match(/\/(\d+)(?:\/)?$/);
    if (match) {
      return {
        id: Number(match[1]),
        etiqueta: payload.etiqueta,
        modeloProducto: modeloCompleto,
        paletId: payload.paletId ?? null,
      };
    }
  }

  throw new Error("La API no devolvió el identificador de la caja creada.");
}

export async function getBoxCapacity(cajaId: number): Promise<BoxCapacityResponse> {
  return apiRequest<BoxCapacityResponse>(`/cajas/${cajaId}/capacidad`);
}

export async function getFreeBoxes(): Promise<FreeBox[]> {
  return apiRequest<FreeBox[]>("/cajas/free");
}

export async function getFreeBoxesByBrand(marca: string): Promise<FreeBox[]> {
  return apiRequest<FreeBox[]>(`/cajas/free/marca/${encodeURIComponent(marca)}`);
}

export async function assignBoxToPallet(cajaId: number, paletId: number): Promise<{ success?: boolean; mensaje?: string }> {
  try {
    return await apiRequest<{ success?: boolean; mensaje?: string }>(`/cajas/${cajaId}/palet`, {
      method: "PATCH",
      body: JSON.stringify({ paletId }),
    });
  } catch (error) {
    if (error instanceof ApiHttpError && error.status === 403) {
      throw new Error("Sesión expirada o sin permisos para asignar cajas. Inicia sesión de nuevo.");
    }
    if (error instanceof ApiHttpError) {
      throw new Error(sanitizeBackendError(error.message));
    }
    throw error;
  }
}
