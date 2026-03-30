import type { Role } from "@/types/role";
import type { AuthUser } from "@/types/auth";

export function hasRole(user: AuthUser | null, role: Role) {
  if (!user) return false;
  return user.roles.includes(role);
}

export function hasAnyRole(user: AuthUser | null, roles: Role[]) {
  if (!user) return false;
  return roles.some((role) => user.roles.includes(role));
}
