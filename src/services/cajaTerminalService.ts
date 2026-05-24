import { apiRequest } from "./apiClient";

export type ValidarTerminalRequest = {
  sn: string;
};

export type ValidarTerminalResponse = {
  valido: boolean;
  motivo:
    | "SN_VACIO"
    | "CAJA_NO_EXISTE"
    | "TERMINAL_NO_EXISTE"
    | "TERMINAL_YA_ASOCIADO"
    | "MODELO_NO_COMPATIBLE"
    | "ESTADO_NO_VALIDO"
    | null;
  terminal?: {
    sn: string;
    marca: string;
    modelo: string;
    estado: string;
  } | null;
  caja?: {
    id: number;
    modeloProducto: string;
  } | null;
};

export type AsociarTerminalesRequest = {
  sns: string[];
};

export type AsociarTerminalesResponse = {
  success: boolean;
  cajaId: number;
  terminalesAsociados?: Array<{ sn: string; estado: string }>;
  motivo?: string;
  errores: Array<{ sn: string; motivo: string }>;
};

export type DesasignarTerminalResponse = {
  success: boolean;
  mensaje: string;
  sn: string;
  cajaId: number;
};

export type CajaDetailResponse = {
  id: number;
  etiqueta?: string | null;
  modeloProducto?: string | null;
  maxCapacity?: number | null;
  paletId?: number | null;
  terminales?: Array<{
    id?: number;
    numeroSerie?: string | null;
    marca?: string | null;
    modelo?: string | null;
    estado?: string | null;
  }> | null;
};

export async function validateTerminalForBox(cajaId: number, payload: ValidarTerminalRequest): Promise<ValidarTerminalResponse> {
  return apiRequest<ValidarTerminalResponse>(`/cajas/${cajaId}/validar-terminal`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function associateTerminalsToBox(
  cajaId: number,
  payload: AsociarTerminalesRequest
): Promise<AsociarTerminalesResponse> {
  return apiRequest<AsociarTerminalesResponse>(`/cajas/${cajaId}/terminales`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCajaById(cajaId: number): Promise<CajaDetailResponse> {
  return apiRequest<CajaDetailResponse>(`/cajas/${cajaId}`);
}

export async function unassignTerminalFromBox(cajaId: number, sn: string): Promise<DesasignarTerminalResponse> {
  return apiRequest<DesasignarTerminalResponse>(`/cajas/${cajaId}/terminales/${encodeURIComponent(sn)}`, {
    method: "DELETE",
  });
}
