import { useCallback, useState, type FormEvent } from "react";
import { apiUrl } from "../auth/session";
import type { Terminal, TerminalApiResponse } from "../components/SNSearch/types";

function toInputDateTime(value?: string): string {
  if (!value) {
    return "";
  }

  return value.length >= 16 ? value.slice(0, 16) : value;
}

function fromApiTerminal(terminal: Terminal): Terminal {
  return {
    id: terminal.id,
    numeroSerie: terminal.numeroSerie,
    modelo: terminal.modelo,
    marca: terminal.marca,
    estado: terminal.estado,
    notas: terminal.notas || "",
    fechaIngreso: toInputDateTime(terminal.fechaIngreso),
    fechaCreacion: toInputDateTime(terminal.fechaCreacion),
  };
}

export function useSNSearch() {
  const [searchSN, setSearchSN] = useState("");
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setFeedback("");

    const sn = searchSN.trim().toUpperCase();
    setSearchSN(sn);

    if (!sn) {
      setErrorMessage("Introduce un SN para buscar.");
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(apiUrl(`/terminales/sn/${encodeURIComponent(sn)}`), {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 404) {
        setTerminal(null);
        setErrorMessage(`No se encontró ningún equipo con el numero de serie: ${sn}.`);
        return;
      }

      if (!response.ok) {
        throw new Error("No se pudo completar la búsqueda.");
      }

      const data = (await response.json()) as Terminal;
      const parsed = fromApiTerminal(data);

      setTerminal(parsed);
      setFeedback(`Equipo ${parsed.numeroSerie} encontrado.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado en la búsqueda.";
      setErrorMessage(message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchSN("");
    setFeedback("");
    setErrorMessage("");
    setTerminal(null);
    setIsDeleteModalOpen(false);
  };

  const openDeleteModal = () => {
    const sn = terminal?.numeroSerie?.trim();

    if (!sn) {
      setErrorMessage("No hay un número de serie válido para eliminar.");
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
  };

  const clearFeedback = useCallback(() => {
    setFeedback("");
  }, []);

  const clearErrorMessage = useCallback(() => {
    setErrorMessage("");
  }, []);

  const handleDeleteBySn = async () => {
    const sn = terminal?.numeroSerie?.trim();

    if (!sn) {
      setErrorMessage("No hay un número de serie válido para eliminar.");
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setFeedback("");

      const response = await fetch(apiUrl(`/terminales/sn/${encodeURIComponent(sn)}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await response.json().catch(() => null)) as TerminalApiResponse | null;

      if (!response.ok) {
        throw new Error(data?.message || data?.error || "No se pudo eliminar el equipo.");
      }

      setTerminal(null);
      setSearchSN("");
      setFeedback(`Equipo ${sn} eliminado correctamente.`);
      setIsDeleteModalOpen(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al eliminar el equipo.";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
  };
}
