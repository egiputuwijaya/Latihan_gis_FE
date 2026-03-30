"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AuthUser, MeResponse } from "@/types/auth";

export default function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get<MeResponse>("/auth/me");
      console.log("ME RESPONSE:", data);
      setUser(data.user);
    } catch (err: any) {
      console.error("Gagal mengambil user:", err);
      setUser(null);
      setError(err?.message || "Gagal mengambil user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    refetchUser: fetchUser,
  };
}
