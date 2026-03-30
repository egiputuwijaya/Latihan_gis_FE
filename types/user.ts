import { Role } from "./role";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  roles: Role[];
};