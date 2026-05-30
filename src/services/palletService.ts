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

export interface PalletDetailResponse {
  id: number;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas: number;
  codigoMarca?: string | null;
  descripcion?: string | null;
  cajas?: Array<{
    id: number;
    etiqueta?: string;
    modeloProducto?: string | null;
    maxCapacity?: number | null;
  }>;
}

export interface FreePalletResponse {
  id: number;
  material: PalletMaterial;
  tipo: PalletType;
  capacidadMaxCajas: number;
  codigoMarca?: string | null;
  descripcion?: string | null;
}

export interface MovePalletPayload {
  ubicacionAlmacenId: number | null;
}

export interface MovePalletResponse {
  success: boolean;
  mensaje: string;
  paletId: number;
  ubicacionAlmacenId: number | null;
}

export interface UpdatePalletDescriptionPayload {
  descripcion: string;
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

export type DeletePalletResponse = {
  success: boolean;
  mensaje: string;
  paletId: number;
};

export async function unassignBoxFromPallet(paletId: number, cajaId: number): Promise<UnassignBoxFromPalletResponse> {
  return apiRequest<UnassignBoxFromPalletResponse>(`/palets/${paletId}/cajas/${cajaId}`, {
    method: "DELETE",
  });
}

export async function deletePallet(paletId: number): Promise<DeletePalletResponse> {
  return apiRequest<DeletePalletResponse>(`/palets/${paletId}`, {
    method: "DELETE",
  });
}

export async function getPalletById(paletId: number): Promise<PalletDetailResponse> {
  return apiRequest<PalletDetailResponse>(`/palets/${paletId}`);
}

export async function getFreePallets(): Promise<FreePalletResponse[]> {
  return apiRequest<FreePalletResponse[]>("/palets/free");
}

export async function movePalletToUbicacion(paletId: number, payload: MovePalletPayload): Promise<MovePalletResponse> {
  return apiRequest<MovePalletResponse>(`/palets/${paletId}/ubicacion`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updatePalletDescription(
  paletId: number,
  payload: UpdatePalletDescriptionPayload
): Promise<unknown> {
  return apiRequest<unknown>(`/palets/${paletId}/descripcion`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
