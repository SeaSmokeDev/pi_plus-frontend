import type {
  Expedition,
  CreateExpeditionRequest,
  UpdateExpeditionRequest,
} from "../types";

import { apiRequest } from "./apiClient";

export function getExpeditions() {
    return apiRequest<Expedition[]>("/expeditions");
}

export function getExpedition(id: number) {
    return apiRequest<Expedition>(`/expeditions/${id}`);
}

export function createExpedition(expedition: CreateExpeditionRequest) {
    return apiRequest<Expedition>("/expeditions", {
        method: "POST",
        body: JSON.stringify(expedition)
    });
}

export function updateExpedition(id: number, expedition: UpdateExpeditionRequest) {
    return apiRequest<Expedition>(`/expeditions/${id}`, {
        method: "PUT",
        body: JSON.stringify(expedition)
    });
}

export function deleteExpedition(id: number) {
    return apiRequest<void>(`/expeditions/${id}`, {
        method: "DELETE"
    });
}