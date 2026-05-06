import type { ID } from "./common.types";

export type UserRole =
  | "trabajador_almacen"
  | "tecnico"
  | "logistica"
  | "administrador";

export interface User {
  id: ID;
  nombre: string | null;
  apellido: string | null;
  lugarTrabajo: string | null;
  rol: UserRole;
}

export interface SecurityUser {
  id: ID;
  username: string;
  email: string;
  rol: UserRole;
  activado: boolean;
  usuarioId: ID;
}