import { Role } from "@/types/role";

export type SidebarItem = {
  label: string;
  href: string;
  roles: Role[];
};

export const sidebarMenu: SidebarItem[] = [
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

  // ======================
  // ADMIN
  // ======================
  {
    label: "Locations",
    href: "/dashboard/locations",
    roles: ["ADMIN"],
  },
  {
    label: "Zones",
    href: "/dashboard/zones",
    roles: ["ADMIN"],
  },
  {
    label: "Kiosks",
    href: "/dashboard/kiosks",
    roles: ["ADMIN"],
  },

  // ======================
  // MERCHANT
  // ======================
  {
    label: "Merchant Dashboard",
    href: "/dashboard/merchant",
    roles: ["MERCHANT"],
  },
  {
    label: "My Shops",
    href: "/dashboard/merchant/shops",
    roles: ["MERCHANT"],
  },

  // ======================
  // PUBLIC
  // ======================
  {
    label: "Public Dashboard",
    href: "/dashboard/public",
    roles: ["PUBLIC"],
  },
];
