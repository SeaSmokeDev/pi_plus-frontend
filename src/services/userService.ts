import type { UserId, UserList } from "../types";
import { apiRequest } from "./apiClient";

export function getUsersList(){
  return apiRequest<UserList[]>(`/usuarios/list`);
}

export function getUserByUsername(username: string){
  return apiRequest<UserId>(`/usuarios/username/${username}`);
}
