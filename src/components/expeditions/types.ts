export type ExpeditionStatus = "en_transito" | "abierta" | "recibida";

export type Expedition = {
  id: number;
  expeditionNumber: string;
  assignedTo: string;
  destination: string;
  sentDate: string;
  receivedDate: string | null;
  status: ExpeditionStatus;
};

export type ExpeditionFilters = {
  sentDate: string;
  receivedDate: string;
  assignedTo: string;
  destination: string;
};
