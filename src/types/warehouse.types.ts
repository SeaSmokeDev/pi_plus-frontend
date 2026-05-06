import type { ID } from "./common.types";

export interface Aisle {
  id: ID;
  numeroPasillo: number;
}

export interface Shelf {
  id: ID;
  codigo: string;
  nivelesMaximos: number;
  capacidadNivel: number;
  pasilloId: ID;
}

export interface WarehouseLocation {
  id: ID;
  referencia: string;
  estanteriaId: ID;
  nivel: number;
}

export interface WarehouseLocationDetail extends WarehouseLocation {
  estanteria?: Shelf;
  pasillo?: Aisle;
}