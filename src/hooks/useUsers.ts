import { useEffect, useState } from "react";
import type { UserList } from "../types";
import { getUsersList } from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState<UserList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadUsersList() {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsersList();
      setUsers(data);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsersList();
  }, []);

  return {
    users,
    loading,
    error,
    reload: loadUsersList,
  };
}
