import type { SecurityUser } from "../types";
import { apiRequest } from "./apiClient";

export function getSecurityUsers() {
  return apiRequest<SecurityUser[]>("/security/usuarios");
}
