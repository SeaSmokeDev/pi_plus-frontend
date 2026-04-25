import type { ID } from "./common.types";
import type { WarehouseLocation } from "./warehouse.types";

export type PalletMaterial = "plastico" | "madera";
export type PalletType = "americano" | "europeo";

export interface Pallet {
  id: ID;
  descripcion: string;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas: number;
  ubicacionAlmacenId: ID | null;
  codigoMarca: string | null;
}

export interface PalletDetail extends Pallet {
  ubicacionAlmacen?: WarehouseLocation | null;
}

export interface CreatePalletRequest {
  descripcion: string;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas?: number;
  ubicacionAlmacenId?: ID | null;
  codigoMarca?: string | null;
}