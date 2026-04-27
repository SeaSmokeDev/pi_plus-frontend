import type { ApiDate, ID } from "./common.types";


export type ExpeditionStatus = "abierta" | "en_transito" | "recibida";

export interface Expedition {
  id: ID;
  fechaCreacion: ApiDate;
  fechaRecepcion: ApiDate | null;
  fechaModificacion: ApiDate | null;
  direccionDestino: string;
  paquetes: number | null;
  peso: number | null;
  notas: string | null;
  usuarioId: ID;
  estado: ExpeditionStatus;
}

export interface ExpeditionFilters {
  fechaCreacion: ApiDate;
  fechaRecepcion: ApiDate;
  userId: ID;
  direccionDestino: string;
  estado: ExpeditionStatus | "";
}

export interface CreateExpeditionRequest {
  direccionDestino: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  usuarioId: ID;
  estado?: ExpeditionStatus;
}

export interface UpdateExpeditionRequest {
  direccionDestino?: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  usuarioId?: ID;
  estado?: ExpeditionStatus;
}