import { apiUrl } from "../auth/session";

export class ApiHttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(endpoint), {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    ...options,
  });

  const parsedBody = (await response.json().catch(() => null)) as
    | { message?: string; error?: string; motivo?: string }
    | null;

  if (!response.ok) {
    const serverMessage = parsedBody?.message || parsedBody?.error || parsedBody?.motivo;
    throw new ApiHttpError(response.status, serverMessage || `Error HTTP ${response.status}`, parsedBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return parsedBody as T;
}
