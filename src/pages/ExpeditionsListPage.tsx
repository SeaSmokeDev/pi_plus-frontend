import { useMemo, useState } from "react";
import CreateExpeditionModal from "../components/expeditions/CreateExpeditionModal";
import ExpeditionFiltersPanel from "../components/expeditions/ExpeditionFiltersPanel";
import ExpeditionSearchBar from "../components/expeditions/ExpeditionSearchBar";
import ExpeditionsList from "../components/expeditions/ExpeditionsList";
import type { Expedition, ExpeditionFilters } from "../components/expeditions/types";

const todayLabel = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "full",
}).format(new Date());

const todayExpeditionsMock: Expedition[] = [
  {
    id: 1,
    expeditionNumber: "EXP-2026-041",
    assignedTo: "Ian Tauzy",
    destination: "Madrid",
    sentDate: "2026-04-06",
    receivedDate: null,
    status: "en_transito",
  },
  {
    id: 2,
    expeditionNumber: "EXP-2026-042",
    assignedTo: "Alba Panato",
    destination: "Valencia",
    sentDate: "2026-04-06",
    receivedDate: "2026-04-06",
    status: "abierta",
  },
  {
    id: 3,
    expeditionNumber: "EXP-2026-043",
    assignedTo: "Marta Soler",
    destination: "Sevilla",
    sentDate: "2026-04-06",
    receivedDate: null,
    status: "en_transito",
  },
  {
    id: 4,
    expeditionNumber: "EXP-2026-044",
    assignedTo: "David Rico",
    destination: "Barcelona",
    sentDate: "2026-04-06",
    receivedDate: "2026-04-06",
    status: "recibida",
  },
  {
    id: 5,
    expeditionNumber: "EXP-2026-045",
    assignedTo: "Lucia Torres",
    destination: "Bilbao",
    sentDate: "2026-04-06",
    receivedDate: null,
    status: "abierta",
  },
  {
    id: 6,
    expeditionNumber: "EXP-2026-046",
    assignedTo: "Sergio Marin",
    destination: "Malaga",
    sentDate: "2026-04-06",
    receivedDate: null,
    status: "en_transito",
  },
  {
    id: 7,
    expeditionNumber: "EXP-2026-047",
    assignedTo: "Claudia Perez",
    destination: "Alicante",
    sentDate: "2026-04-06",
    receivedDate: "2026-04-06",
    status: "recibida",
  },
];

const emptyFilters: ExpeditionFilters = {
  sentDate: "",
  receivedDate: "",
  assignedTo: "",
  destination: "",
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export default function ExpeditionsListPage() {
  const [searchValue, setSearchValue] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<ExpeditionFilters>(emptyFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredExpeditions = useMemo(() => {
    return todayExpeditionsMock.filter((expedition) => {
      const matchesNumber = normalizeText(expedition.expeditionNumber).includes(normalizeText(searchValue));
      const matchesSentDate =
        !filters.sentDate || expedition.sentDate === filters.sentDate;
      const matchesReceivedDate =
        !filters.receivedDate || expedition.receivedDate === filters.receivedDate;
      const matchesAssignedTo =
        !filters.assignedTo ||
        normalizeText(expedition.assignedTo).includes(normalizeText(filters.assignedTo));
      const matchesDestination =
        !filters.destination ||
        normalizeText(expedition.destination).includes(normalizeText(filters.destination));

      return (
        matchesNumber &&
        matchesSentDate &&
        matchesReceivedDate &&
        matchesAssignedTo &&
        matchesDestination
      );
    });
  }, [filters, searchValue]);

  const handleFilterChange = (field: keyof ExpeditionFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container-fluid p-4 d-flex flex-column gap-4">
      <section className="card border-0 shadow-sm bg-primary text-white">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
            <div>
              <p className="text-uppercase small fw-semibold mb-2 opacity-75">
                Expediciones del dia
              </p>
              <h1 className="h3 fw-bold mb-1">Listado de expediciones</h1>
              <p className="mb-0 opacity-75">
                Consulta de un vistazo las expediciones previstas para hoy y filtralas por los campos que necesites.
              </p>
            </div>

            <div className="bg-white text-dark rounded-3 px-4 py-3 shadow-sm">
              <div className="text-muted small mb-1">Hoy</div>
              <div className="fw-semibold text-capitalize">{todayLabel}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Nueva expedicion
        </button>
      </div>

      <ExpeditionSearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showAdvancedFilters={showAdvancedFilters}
        onToggleAdvancedFilters={() => setShowAdvancedFilters((prev) => !prev)}
      />

      {showAdvancedFilters && (
        <ExpeditionFiltersPanel filters={filters} onFilterChange={handleFilterChange} />
      )}

      <section className="d-flex flex-column gap-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <div>
            <h2 className="h5 fw-bold mb-1">Expediciones visibles</h2>
            <p className="text-muted mb-0">
              {filteredExpeditions.length} expedicion{filteredExpeditions.length === 1 ? "" : "es"} encontrada{filteredExpeditions.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <ExpeditionsList expeditions={filteredExpeditions} />
      </section>

      <CreateExpeditionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
