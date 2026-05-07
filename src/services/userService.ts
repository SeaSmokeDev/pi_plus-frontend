import type { UserList } from "../types";
import { apiRequest } from "./apiClient";

export function getUsersList(){
  return apiRequest<UserList[]>(`/usuarios/list`);
}
