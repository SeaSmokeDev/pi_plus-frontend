import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateExpeditionModal from "../components/expeditions/CreateExpeditionModal";
import ExpeditionFiltersPanel from "../components/expeditions/ExpeditionFiltersPanel";
import ExpeditionSearchBar from "../components/expeditions/ExpeditionSearchBar";
import ExpeditionsList from "../components/expeditions/ExpeditionsList";
import { useExpeditions } from "../hooks/useExpeditions";
import { useSecurityUsers } from "../hooks/useSecurityUsers";
import type { Expedition, ExpeditionFilters } from "../types";

const todayLabel = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "full",
}).format(new Date());

const emptyFilters: ExpeditionFilters = {
  fechaCreacionDesde: "",
  fechaCreacionHasta: "",
  fechaRecepcionDesde: "",
  fechaRecepcionHasta: "",
  username: "",
  direccionDestino: "",
  estado: "",
};

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

export default function ExpeditionsListPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<ExpeditionFilters>(emptyFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    expeditions,
    loading,
    error,
  } = useExpeditions();
  const { users, loading: loadingUsers } = useSecurityUsers();

  const filteredExpeditions = useMemo(() => {
    return expeditions.filter((expedition) => {
      const matchesSearchValue =
        !searchValue ||
        String(expedition.id).includes(searchValue.trim()) ||
        normalizeText(expedition.direccionDestino).includes(normalizeText(searchValue));
      const matchedUser = users.find(
        (user) => user.username.toLowerCase() === filters.username.trim().toLowerCase()
      );
      const matchesAssignedTo =
        !filters.username || (matchedUser ? expedition.usuarioId === matchedUser.usuarioId : false);
      const matchesDestination = !filters.direccionDestino || normalizeText(expedition.direccionDestino).includes(normalizeText(filters.direccionDestino));

      return matchesSearchValue && matchesAssignedTo && matchesDestination;
    });
  }, [filters, searchValue, expeditions, users]);

  if(loading) return <div className="container p-4">Cargando expediciones...</div>;
  if(error) return <div className="container p-4 text-danger">Error: {error}</div>;

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
        <ExpeditionFiltersPanel
          filters={filters}
          users={users}
          loadingUsers={loadingUsers}
          onFilterChange={handleFilterChange}
        />
      )}

      <section className="d-flex flex-column gap-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <div>
            <h2 className="h5 fw-bold mb-1">Expediciones visibles de hoy</h2>
            <p className="text-muted mb-0">
              {filteredExpeditions.length} expedicion{filteredExpeditions.length === 1 ? "" : "es"} encontrada{filteredExpeditions.length === 1 ? "" : "s"}.
            </p>
          </div>
        </div>

        <ExpeditionsList
          expeditions={filteredExpeditions}
          onEdit={(expedition: Expedition) => navigate(`/expeditions/${expedition.id}/edit`)}
        />
      </section>

      <CreateExpeditionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onContinue={() => {
          setIsCreateModalOpen(false);
          navigate("/expeditions/new");
        }}
      />
    </div>
  );
}
