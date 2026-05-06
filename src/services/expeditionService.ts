import type { Expedition, CreateExpeditionRequest, UpdateExpeditionRequest, ExpeditionList} from "../types";
import { apiRequest } from "./apiClient";

export function getAllExpeditions() {
    return apiRequest<Expedition[]>("/expediciones");
}

export function getExpeditionsToday() {
    return apiRequest<Expedition[]>("/expediciones/today");
}

export function getExpedition(id: number) {
    return apiRequest<Expedition>(`/expediciones/${id}`);
}

export function getExpeditionsByUser(userName: string) {
    return apiRequest<Expedition[]>(`/expediciones/nombre/usuario/${userName}`);
}

export function getExpeditionsByAddress(address: string) {
    return apiRequest<Expedition[]>(`/expediciones/direccion=${encodeURIComponent(address)}`);
}

export function getExpeditionsListToday() {
    return apiRequest<ExpeditionList[]>(`/expediciones/today/list`);
}

export function createExpedition(expedition: CreateExpeditionRequest) {
    return apiRequest<Expedition>("/expediciones", {
        method: "POST",
        body: JSON.stringify(expedition)
    });
}

export function updateExpedition(id: number, expedition: UpdateExpeditionRequest) {
    return apiRequest<Expedition>(`/expediciones/${id}`, {
        method: "PUT",
        body: JSON.stringify(expedition)
    });
}

export function deleteExpedition(id: number) {
    return apiRequest<void>(`/expediciones/${id}`, {
        method: "DELETE"
    });
}