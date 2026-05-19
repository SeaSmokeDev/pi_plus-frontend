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

export interface ExpeditionList {
  id: ID;
  referenciaExpedicion: string | null;
  fechaCreacion: ApiDate;
  fechaRecepcion: ApiDate | null;
  fechaModificacion: ApiDate | null;
  fechaEnvio: ApiDate | null;
  direccionDestino: string;
  username: string;
  estado: ExpeditionStatus;
}

export interface ExpeditionBatchList {
  referenciaExpedicion: string;
  fechaCreacion: ApiDate;
  fechaRecepcion: ApiDate | null;
  fechaModificacion: ApiDate | null;
  fechaEnvio: ApiDate | null;
  direccionDestino: string;
  username: string;
  estado: ExpeditionStatus;
  expeditionIds: ID[];
  totalExpediciones: number;
}

export interface ExpeditionFilters {
  fechaCreacionDesde: ApiDate;
  fechaCreacionHasta: ApiDate;
  fechaRecepcionDesde: ApiDate;
  fechaRecepcionHasta: ApiDate;
  fechaEnvio: ApiDate;
  referenciaExpedicion: string;
  usuarioId: ID | null;
  username: string;
  direccionDestino: string;
  estado: ExpeditionStatus | "";
}

export interface ExpeditionDraftData {
  direccionDestino: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  username: string;
  fechaEnvio?: ApiDate | null;
}

export interface ExpeditionDetailFormData {
  username?: string;
  usuarioId?: ID;
  direccionDestino: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  fechaEnvio?: ApiDate | null;
  estado?: ExpeditionStatus;
}

export interface CreateExpeditionBatchRequest {
  direccionDestino: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  usuarioId: ID;
  fechaEnvio?: ApiDate | null;
  cajaIds: ID[];
}

export interface UpdateExpeditionRequest {
  direccionDestino?: string;
  paquetes?: number | null;
  peso?: number | null;
  notas?: string | null;
  usuarioId?: ID;
  estado?: ExpeditionStatus;
}
