import type { ID } from "./common.types";
import type { Pallet } from "./pallet.types";

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