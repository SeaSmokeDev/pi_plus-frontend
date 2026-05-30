import type {
  CreatePayment,
  Payment,
  PaymentApiResponse,
  UpdatePaymentPayload,
} from "../types";
import { apiRequest } from "./apiClient";

function extractTerminal(data: Payment | PaymentApiResponse): Payment {
  const response = data as PaymentApiResponse;
  const terminal = response.terminal || response.updatedterminal || response.insertterminal || response.data;

  if (terminal) {
    return terminal;
  }

  return data as Payment;
}

export async function getTerminalBySn(sn: string): Promise<Payment> {
  return apiRequest<Payment>(`/terminales/sn/${encodeURIComponent(sn.trim())}`);
}

export async function createTerminal(payload: CreatePayment): Promise<Payment> {
  const data = await apiRequest<Payment | PaymentApiResponse>("/terminales", {
    method: "POST",
    body: JSON.stringify({
      marca: payload.marca,
      modelo: payload.modelo,
      estado: payload.estado,
      notas: payload.notas ?? null,
    }),
  });

  return extractTerminal(data);
}

export async function updateTerminal(id: number, payload: UpdatePaymentPayload): Promise<Payment> {
  const data = await apiRequest<Payment | PaymentApiResponse>(`/terminales/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      estado: payload.estado,
      notas: payload.notas ?? null,
    }),
  });

  return extractTerminal(data);
}
