import { apiRequest } from "./apiClient";

export type PalletMaterial = "plastico" | "madera";
export type PalletType = "americano" | "europeo";

export interface CreatePalletPayload {
  descripcion: string;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas: number;
  codigoMarca: string;
  ubicacionAlmacenId: number;
  cajas: [];
}

export async function createPallet(payload: CreatePalletPayload): Promise<unknown> {
  return apiRequest<unknown>("/palets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type UnassignBoxFromPalletResponse = {
  success: boolean;
  mensaje: string;
  paletId: number;
  cajaId: number;
};

export async function unassignBoxFromPallet(paletId: number, cajaId: number): Promise<UnassignBoxFromPalletResponse> {
  return apiRequest<UnassignBoxFromPalletResponse>(`/palets/${paletId}/cajas/${cajaId}`, {
    method: "DELETE",
  });
}
