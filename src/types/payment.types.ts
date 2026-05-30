import type { ApiDate, ID } from "./common.types";
import type { Box } from "./box.types";

export type TerminalStatus =
  | "en_transito"
  | "pendiente_transito"
  | "pendiente_revision"
  | "operativo"
  | "pendiente_laboratorio"
  | "nivel_1";

export interface Payment {
  id: ID;
  numeroSerie: string;
  modelo: string;
  marca: string;
  estado: TerminalStatus;
  notas: string | null;
  fechaIngreso: ApiDate;
  fechaCreacion: ApiDate;
  cajaId: ID | null;
}

export interface TerminalCurrentBox {
  id: ID;
  etiqueta: string;
  modeloProducto: string;
}

export interface TerminalEdit {
  id: ID;
  numeroSerie: string;
  marca: string;
  modelo: string;
  estado: TerminalStatus;
  notas: string | null;
  caja: TerminalCurrentBox | null;
}

export interface TerminalEditResponse {
  mensaje: string;
  terminal: TerminalEdit;
}

export interface PaymentTerminalDetail extends Payment {
  caja?: Box | null;
}


export interface UpdatePaymentTerminalRequest {
  modelo?: string;
  marca?: string;
  estado?: TerminalStatus;
  notas?: string | null;
  fechaIngreso?: ApiDate;
  cajaId?: ID | null;
}

export interface PaymentBoxDetail {
  modelo: string;
  marca: string;
  estado: TerminalStatus;
  numeroSerie: string;
}

export interface ExpeditionQuickViewPayment {
  modelo: string;
  marca: string;
  estado: TerminalStatus;
  numeroSerie: string;
}


export type PaymentApiResponse = {
  terminal?: Payment;
  updatedterminal?: Payment;
  insertterminal?: Payment;
  data?: Payment;
  error?: string;
  message?: string;
  mensaje?: string;
};

export type PaymentFormData = {
  marca: string;
  modelo: string;
  estado: TerminalStatus;
  notas: string;
};

export type CreatePayment = {
  marca: string;
  modelo: string;
  estado: TerminalStatus;
  notas?: string | null;
};

export type UpdatePaymentPayload = {
  estado: TerminalStatus;
  notas?: string | null;
};

export const terminalStatusOptions: Array<{ value: TerminalStatus; label: string }> = [
  { value: "en_transito", label: "En transito" },
  { value: "pendiente_transito", label: "Pendiente de transito" },
  { value: "pendiente_revision", label: "Pendiente revision" },
  { value: "operativo", label: "Operativo" },
  { value: "pendiente_laboratorio", label: "Pendiente laboratorio" },
  { value: "nivel_1", label: "Nivel 1" },
];

export const editableTerminalStatusOptions = terminalStatusOptions.filter(
  (option) => option.value !== "en_transito" && option.value !== "pendiente_transito",
);

export function formatTerminalStatus(status: TerminalStatus): string {
  return terminalStatusOptions.find((option) => option.value === status)?.label || status;
}

export function isTerminalLockedForManualActions(status: TerminalStatus): boolean {
  return status === "en_transito" || status === "pendiente_transito";
}
