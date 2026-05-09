import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateExpeditionModal from "../components/expeditions/CreateExpeditionModal";
import ExpeditionFiltersPanel from "../components/expeditions/ExpeditionFiltersPanel";
import ExpeditionSearchBar from "../components/expeditions/ExpeditionSearchBar";
import ExpeditionsListComponent from "../components/expeditions/ExpeditionsListComponent";
import { useExpeditions } from "../hooks/useExpeditions";
import { useUsers } from "../hooks/useUsers";
import type { ExpeditionFilters, ExpeditionList } from "../types";

const todayLabel = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "full",
}).format(new Date());

const emptyFilters: ExpeditionFilters = {
  fechaCreacionDesde: "",
  fechaCreacionHasta: "",
  fechaRecepcionDesde: "",
  fechaRecepcionHasta: "",
  usuarioId: null,
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
  const [appliedLocalFilters, setAppliedLocalFilters] = useState<ExpeditionFilters>(emptyFilters);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    expeditionsList,
    loading,
    error,
    reloadList,
    searchList,
  } = useExpeditions();
  const { users, loading: loadingUsers } = useUsers();

  const filteredExpeditions = useMemo(() => {
    return expeditionsList.filter((expedition) => {
      const matchesSearchValue =
        !searchValue ||
        String(expedition.id).includes(searchValue.trim()) ||
        normalizeText(expedition.direccionDestino).includes(normalizeText(searchValue)) ||
        normalizeText(expedition.username).includes(normalizeText(searchValue));

      const createdDate = expedition.fechaCreacion.slice(0, 10);
      const receivedDate = expedition.fechaRecepcion?.slice(0, 10) || "";

      const matchesCreatedFrom =
        !appliedLocalFilters.fechaCreacionDesde || createdDate >= appliedLocalFilters.fechaCreacionDesde;
      const matchesCreatedTo =
        !appliedLocalFilters.fechaCreacionHasta || createdDate <= appliedLocalFilters.fechaCreacionHasta;
      const matchesReceivedFrom =
        !appliedLocalFilters.fechaRecepcionDesde ||
        (receivedDate !== "" && receivedDate >= appliedLocalFilters.fechaRecepcionDesde);
      const matchesReceivedTo =
        !appliedLocalFilters.fechaRecepcionHasta ||
        (receivedDate !== "" && receivedDate <= appliedLocalFilters.fechaRecepcionHasta);
      const matchesAssignedTo =
        !appliedLocalFilters.username ||
        normalizeText(expedition.username).includes(normalizeText(appliedLocalFilters.username));
      const matchesDestination =
        !appliedLocalFilters.direccionDestino ||
        normalizeText(expedition.direccionDestino).includes(normalizeText(appliedLocalFilters.direccionDestino));
      const matchesStatus =
        !appliedLocalFilters.estado || expedition.estado === appliedLocalFilters.estado;

      return (
        matchesSearchValue &&
        matchesCreatedFrom &&
        matchesCreatedTo &&
        matchesReceivedFrom &&
        matchesReceivedTo &&
        matchesAssignedTo &&
        matchesDestination &&
        matchesStatus
      );
    });
  }, [appliedLocalFilters, searchValue, expeditionsList]);

  if (loading) return <div className="container p-4">Cargando expediciones...</div>;
  if (error) return <div className="container p-4 text-danger">Error: {error}</div>;

  const handleFilterChange = (field: keyof ExpeditionFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: field === "usuarioId" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleApplyCurrentList = () => {
    setAppliedLocalFilters(filters);
  };

  const handleClearFilters = async () => {
    setFilters(emptyFilters);
    setAppliedLocalFilters(emptyFilters);
    setSearchValue("");
    await reloadList();
  };

  const handleDeepSearch = async () => {
    const resolvedUserId =
      filters.usuarioId !== null
        ? filters.usuarioId
        : users.find((user) => user.username.toLowerCase() === filters.username.trim().toLowerCase())?.id ?? null;

    const payload: ExpeditionFilters = {
      ...filters,
      usuarioId: resolvedUserId,
    };

    setAppliedLocalFilters(payload);
    await searchList(payload);
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
          onClearFilters={handleClearFilters}
          onDeepSearch={handleDeepSearch}
          onApplyCurrentList={handleApplyCurrentList}
        />
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

        <ExpeditionsListComponent
          expeditionsList={filteredExpeditions}
          onEdit={(expedition: ExpeditionList) => navigate(`/expeditions/${expedition.id}/edit`)}
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
