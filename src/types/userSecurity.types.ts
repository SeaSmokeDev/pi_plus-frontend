import type { ID, UserRole } from "./common.types";


export interface SecurityUser {
  id: ID;
  username: string;
  email: string;
  rol: UserRole;
  activado: boolean;
  usuarioId: ID;
}