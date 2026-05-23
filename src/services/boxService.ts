import { apiUrl } from "../auth/session";

export type CreateBoxPayload = {
  etiqueta: string;
  modelo: string;
  marca: string;
  unidades: number;
  capacidadTotal: number;
  idPale: number | null;
};

export type CreatedBox = {
  id: number;
  etiqueta: string;
  modeloProducto?: string;
  id_pale?: number | null;
};

type CreateBoxApiResponse = {
  id?: number;
  cajaId?: number;
  insertCaja?: CreatedBox;
  caja?: CreatedBox;
  box?: CreatedBox;
  createdBox?: CreatedBox;
  data?: { id?: number; cajaId?: number };
  mensaje?: string;
  message?: string;
  error?: string;
};

export async function createBox(payload: CreateBoxPayload): Promise<CreatedBox> {
  const requestBody = {
    etiqueta: payload.etiqueta,
    modeloProducto: payload.modelo,
    maxCapacity: payload.capacidadTotal,
    id_pale: payload.idPale,
  };

  console.log("[createBox] request payload:", requestBody);

  const response = await fetch(apiUrl("/cajas"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  });

  const data = (await response.json().catch(() => null)) as CreateBoxApiResponse | null;

  console.log("[createBox] response status:", response.status);
  console.log("[createBox] response headers:", Object.fromEntries(response.headers.entries()));
  console.log("[createBox] response body:", data);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "No se pudo crear la caja.");
  }

  const created = data?.insertCaja || data?.caja || data?.box || data?.createdBox;

  if (created?.id) {
    return created;
  }

  if (typeof data?.id === "number") {
    return {
      id: data.id,
      etiqueta: payload.etiqueta,
      modeloProducto: payload.modelo,
      id_pale: payload.idPale,
    };
  }

  if (typeof data?.cajaId === "number") {
    return {
      id: data.cajaId,
      etiqueta: payload.etiqueta,
      modeloProducto: payload.modelo,
      id_pale: payload.idPale,
    };
  }

  if (typeof data?.data?.id === "number" || typeof data?.data?.cajaId === "number") {
    return {
      id: data?.data?.id ?? (data?.data?.cajaId as number),
      etiqueta: payload.etiqueta,
      modeloProducto: payload.modelo,
      id_pale: payload.idPale,
    };
  }

  const locationHeader = response.headers.get("Location") || response.headers.get("location");
  if (locationHeader) {
    const match = locationHeader.match(/\/(\d+)(?:\/)?$/);
    if (match) {
      return {
        id: Number(match[1]),
        etiqueta: payload.etiqueta,
        modeloProducto: payload.modelo,
        id_pale: payload.idPale,
      };
    }
  }

  throw new Error("La API no devolvió el identificador de la caja creada.");
}
