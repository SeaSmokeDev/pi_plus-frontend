import type { ID } from "./common.types";
import type { Pallet } from "./pallet.types";
import type { PaymentBoxDetail } from "./payment.types";

export interface Box {
  id: ID;
  etiqueta: string;
  modeloProducto: string | null;
  paletId: ID | null;
}

export interface BoxDetail extends Box {
  palet?: Pallet | null;
}

export interface CreateBoxRequest {
  etiqueta: string;
  modeloProducto?: string | null;
  paletId?: ID | null;
}

export interface BoxExpeditionDetail{
  id: ID;
  etiqueta: string;
  modeloProducto: string | null;
  cantidadTerminales: number;
  terminales: PaymentBoxDetail[];
}