"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRoleAccess from "@/hooks/useRoleAccess";
import type { Role } from "@/types/role";

type Props = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export default function RoleGuard({ allowedRoles, children }: Props) {
  const router = useRouter();
  const { loading, hasAccess } = useRoleAccess(allowedRoles);

  useEffect(() => {
    if (!loading && !hasAccess) {
      router.replace("/forbidden");
    }
  }, [loading, hasAccess, router]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!hasAccess) return null;

  return <>{children}</>;
}
