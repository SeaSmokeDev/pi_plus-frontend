import { useEffect, useState } from "react";
import type { UserId } from "../types";
import { getUserByUsername } from "../services/userService";

export function useUserId(username?: string) {
    const [user, setUser] = useState<UserId | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadUserId(username: string) {
        try {
          setLoading(true);
          setError(null);
          const data = await getUserByUsername(username);
          setUser(data);
        } catch (err) {
          setError("Error al cargar el usuario");
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      }
    
      useEffect(() => {
        if (username) {
          void loadUserId(username);
        }
      }, [username]);
    
      return {
        user,
        loading,
        error,
        reload: loadUserId,
      };
}