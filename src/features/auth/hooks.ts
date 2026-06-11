"use client";

import { useEffect, useState } from "react";
import type { User } from "./service";

/**
 * Hook to get the current user from our local auth API.
 */
export function useUser() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user ?? undefined);
      } catch (error) {
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
