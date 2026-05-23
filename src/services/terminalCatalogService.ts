import { apiRequest } from "./apiClient";

type MarcasCatalogoResponse = {
  items: string[];
};

type ModelosPorMarcaResponse = {
  marca: string;
  items: string[];
};

type MaxCapacityByModelResponse = {
  modeloProducto?: string;
  maxCapacity?: number;
  capacidadMaxima?: number;
};

export async function getTerminalBrands(): Promise<string[]> {
  const data = await apiRequest<MarcasCatalogoResponse>("/catalogo/terminales/marcas");
  return data.items ?? [];
}

export async function getTerminalModelsByBrand(brand: string): Promise<string[]> {
  const encodedBrand = encodeURIComponent(brand.trim());
  const data = await apiRequest<ModelosPorMarcaResponse>(`/catalogo/terminales/marcas/${encodedBrand}/modelos`);
  return data.items ?? [];
}

export async function getMaxCapacityByModel(model: string): Promise<number | null> {
  const encodedModel = encodeURIComponent(model.trim());
  const data = await apiRequest<MaxCapacityByModelResponse>(`/catalogo/cajas/modelos/${encodedModel}/max-capacity`);
  const capacity = data.maxCapacity ?? data.capacidadMaxima;
  return typeof capacity === "number" && Number.isFinite(capacity) ? capacity : null;
}
