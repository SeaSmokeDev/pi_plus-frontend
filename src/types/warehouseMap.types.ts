export type MapPaletMaterial = "plastico" | "madera";
export type MapPaletType = "americano" | "europeo";

export interface WarehouseMapItem {
  idHueco: number;
  ubicacionAlmacenId?: number | null;
  referencia: string;
  almacen: { id: number; nombre: string } | null;
  pasillo: { id: number; numero: number };
  estanteria: {
    id: number;
    descripcion: string;
    nivel: number;
    capacidadMaxCajas: number;
  };
  pale: {
    id: number;
    descripcion: string;
    material: MapPaletMaterial;
    tipo: MapPaletType;
    capacidadMaxCajas: number;
    codigoMarca?: string;
  } | null;
  ocupacionActual: number;
  cajas: Array<{
    id: number;
    etiqueta: string;
    modeloProducto?: string;
    maxCapacity?: number;
    terminales?: Array<{
      id: number;
      numeroSerie: string;
      modelo?: string;
      marca?: string;
      estado?: string;
    }>;
  }>;
}
