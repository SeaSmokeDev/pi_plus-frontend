import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SNSearchPage.scss";
import SNSearchDeleteConfirmModal from "../components/SNSearch/SNSearchDeleteConfirmModal";
import SNSearchSearchCard from "../components/SNSearch/SNSearchSearchCard";
import SNSearchTerminalDetails from "../components/SNSearch/SNSearchTerminalDetails";
import { useSNSearch } from "../hooks/useSNSearch";
import { isTerminalLockedForManualActions } from "../types";

export default function SNSearchPage() {
  const navigate = useNavigate();
  const {
    searchSN,
    setSearchSN,
    terminal,
    isSearching,
    isDeleting,
    isDeleteModalOpen,
    feedback,
    errorMessage,
    handleSearch,
    handleClearSearch,
    openDeleteModal,
    closeDeleteModal,
    clearFeedback,
    handleDeleteBySn,
  } = useSNSearch();

  const isTerminalLocked = terminal ? isTerminalLockedForManualActions(terminal.estado) : false;

  const handleGoToTerminalForm = () => {
    if (!terminal) {
      return;
    }

    if (isTerminalLockedForManualActions(terminal.estado)) {
      return;
    }

    navigate("/terminal-form", {
      state: {
        terminalId: terminal.id,
        terminalSN: terminal.numeroSerie,
      },
    });
  };

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearFeedback();
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback, clearFeedback]);

  return (
    <div className="container py-4 sn-search-page">
      <SNSearchSearchCard
        searchSN={searchSN}
        onSearchSNChange={setSearchSN}
        onSubmit={handleSearch}
        onClear={handleClearSearch}
        onAdd={() => navigate("/terminal-form", { state: { mode: "create" } })}
        isSearching={isSearching}
      />

      {errorMessage && (
        <div className="alert alert-danger py-3 px-4 mb-4" role="alert" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {feedback && (
        <div className="sn-search-feedback-popup" role="status" aria-live="polite">
          <div className="alert alert-success py-2 px-3 mb-0 shadow-sm">{feedback}</div>
        </div>
      )}

      {terminal && (
        <SNSearchTerminalDetails
          terminal={terminal}
          isDeleting={isDeleting}
          onDelete={openDeleteModal}
          onEdit={handleGoToTerminalForm}
          areActionsDisabled={isTerminalLocked}
        />
      )}

      <SNSearchDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        title="Confirmar eliminación"
        message={`¿Seguro que quieres eliminar la terminal ${terminal?.numeroSerie ?? ""}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmVariant="danger"
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteBySn}
      />
    </div>
  );
}
