import type { Role } from "@/types/role";

export type SidebarItem = {
  label: string;
  href: string;
  roles: Role[];
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  // umum
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["ADMIN", "MERCHANT", "PUBLIC"],
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    roles: ["ADMIN", "MERCHANT", "PUBLIC"],
  },

  // admin
  {
    label: "Management Lokasi",
    href: "/dashboard/locations",
    roles: ["ADMIN"],
  },
  {
    label: "Management Zona",
    href: "/dashboard/zones",
    roles: ["ADMIN"],
  },
  {
    label: "Management Kios",
    href: "/dashboard/kiosks",
    roles: ["ADMIN"],
  },

  // merchant
  {
    label: "Merchant Dashboard",
    href: "/dashboard/merchant",
    roles: ["MERCHANT"],
  },
  {
    label: "Toko Saya",
    href: "/dashboard/merchant/shops",
    roles: ["MERCHANT"],
  },

  // public
  {
    label: "Public Area",
    href: "/dashboard/public",
    roles: ["PUBLIC"],
  },
];
