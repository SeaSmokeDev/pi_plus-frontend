import { useEffect, useState } from "react";
import type { SecurityUser } from "../types";
import { getSecurityUsers } from "../services/userService";

export function useSecurityUsers() {
  const [users, setUsers] = useState<SecurityUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await getSecurityUsers();
      setUsers(data);
    } catch (err) {
      setError("Error al cargar los usuarios");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    reload: loadUsers,
  };
}
