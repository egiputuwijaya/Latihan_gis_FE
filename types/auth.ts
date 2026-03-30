import type { Role } from "./role";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  roles: Role[];
};

export type MeResponse = {
  user: AuthUser;
};

export type LoginResponse = {
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: AuthUser;
  tempToken?: string;
};

export type BasicResponse = {
  message: string;
};

export type Generate2FAResponse = {
  message?: string;
  qrCode: string;
  recoveryCodes: string[];
};
