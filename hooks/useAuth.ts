"use client";

import useCurrentUser from "./useCurrentUser";

export default function useAuth() {
  const { user, loading, error, refetch, refetchUser } = useCurrentUser();

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refetch,
    refetchUser,
  };
}
