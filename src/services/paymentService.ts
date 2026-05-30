import type {
  CreatePayment,
  Payment,
  PaymentApiResponse,
  TerminalEdit,
  TerminalEditResponse,
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

export async function getTerminalEditBySn(sn: string): Promise<TerminalEdit> {
  const data = await apiRequest<TerminalEditResponse>(`/terminales/${encodeURIComponent(sn.trim())}/edit`);
  return data.terminal;
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

export async function updateTerminal(numeroSerie: string, payload: UpdatePaymentPayload): Promise<Payment> {
  const data = await apiRequest<Payment | PaymentApiResponse>(`/terminales/${encodeURIComponent(numeroSerie.trim())}`, {
    method: "PUT",
    body: JSON.stringify({
      estado: payload.estado,
      notas: payload.notas ?? null,
    }),
  });

  return extractTerminal(data);
}
