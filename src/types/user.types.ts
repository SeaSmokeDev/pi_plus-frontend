import type { ID, UserRole } from "./common.types";

export interface User {
  id: ID;
  nombre: string | null;
  apellido: string | null;
  lugarTrabajo: string | null;
  rol: UserRole;
}

export interface UserList{
  nombre: string | null;
  apellido: string | null;
  username: string;
}

