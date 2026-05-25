import type { ApiDate, ID } from "./common.types";
import type { Box } from "./box.types";

export type TerminalStatus =
  | "en_transito"
  | "pendiente_revision"
  | "operativo"
  | "pendiente_laboratorio"
  | "nivel_1";

export interface PaymentTerminal {
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

export interface PaymentTerminalDetail extends PaymentTerminal {
  caja?: Box | null;
}

export interface CreatePaymentTerminalRequest {
  numeroSerie: string;
  modelo: string;
  marca: string;
  estado: TerminalStatus;
  notas?: string | null;
  fechaIngreso: ApiDate;
  cajaId?: ID | null;
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