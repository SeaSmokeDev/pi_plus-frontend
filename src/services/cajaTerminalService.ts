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
