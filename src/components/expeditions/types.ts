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

export type ExpeditionTerminalSummaryItem = {
  model: string;
  entity: string;
  quantity: number;
};

export type ExpeditionTerminalDetailItem = {
  id: number;
  model: string;
  entity: string;
  status: string;
  location: string;
  coverage: string;
  serialNumber: string;
};

export type ExpeditionDetailData = {
  expeditionId?: number;
  expeditionNumber: string;
  assignedTo: string;
  currentStatusLabel: string;
  currentStatusDate: string;
  originType: string;
  originCode: string;
  originInfoTitle: string;
  originInfoDescription: string;
  destinationType: string;
  destinationCode: string;
  destinationInfoTitle: string;
  destinationInfoDescription: string;
  sentAt: string;
  expectedReceptionAt: string;
  packages: string;
  kilos: string;
  observations: string;
  terminalSource: "csv" | "ns";
  terminalSearchValue: string;
  terminalSummary: ExpeditionTerminalSummaryItem[];
  terminalDetails: ExpeditionTerminalDetailItem[];
};
