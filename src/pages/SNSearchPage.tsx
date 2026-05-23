import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SNSearchPage.scss";
import SNSearchDeleteConfirmModal from "../components/SNSearch/SNSearchDeleteConfirmModal";
import SNSearchSearchCard from "../components/SNSearch/SNSearchSearchCard";
import SNSearchTerminalDetails from "../components/SNSearch/SNSearchTerminalDetails";
import { useSNSearch } from "../hooks/useSNSearch";

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
    clearErrorMessage,
    handleDeleteBySn,
  } = useSNSearch();

  const isInTransit = terminal?.estado === "en_transito";

  const handleGoToTerminalForm = () => {
    if (!terminal) {
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

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearErrorMessage();
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorMessage, clearErrorMessage]);

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

      {feedback && (
        <div className="sn-search-feedback-popup" role="status" aria-live="polite">
          <div className="alert alert-success py-2 px-3 mb-0 shadow-sm">{feedback}</div>
        </div>
      )}
      {errorMessage && (
        <div className="sn-search-feedback-popup" role="alert" aria-live="assertive">
          <div className="alert alert-danger py-2 px-3 mb-0 shadow-sm">{errorMessage}</div>
        </div>
      )}

      {terminal && (
        <SNSearchTerminalDetails
          terminal={terminal}
          isDeleting={isDeleting}
          onDelete={openDeleteModal}
          onEdit={handleGoToTerminalForm}
          isEditDisabled={isInTransit}
        />
      )}

      <SNSearchDeleteConfirmModal
        isOpen={isDeleteModalOpen}
        serialNumber={terminal?.numeroSerie}
        isDeleting={isDeleting}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteBySn}
      />
    </div>
  );
}
