"use client";

import { useMemo } from "react";
import useAuth from "@/hooks/useAuth";
import type { Role } from "@/types/role";

export default function useRoleAccess(allowedRoles: Role[]) {
  const { user, loading } = useAuth();

  const hasAccess = useMemo(() => {
    if (!user) return false;
    return allowedRoles.some((role) => user.roles.includes(role));
  }, [user, allowedRoles]);

  return {
    user,
    loading,
    hasAccess,
  };
}
