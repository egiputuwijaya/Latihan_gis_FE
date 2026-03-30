"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.roles.includes("admin");
  const isMerchant = user?.roles.includes("merchant");
  const isPublic = user?.roles.includes("public");

  const links = [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/dashboard/profile", label: "Profile", show: true },

    // ADMIN
    { href: "/dashboard/locations", label: "Management Lokasi", show: isAdmin },
    { href: "/dashboard/zones", label: "Management Zona", show: isAdmin },
    { href: "/dashboard/kiosks", label: "Management Kios", show: isAdmin },

    // MERCHANT
    {
      href: "/dashboard/merchant",
      label: "Merchant Dashboard",
      show: isMerchant,
    },
    { href: "/dashboard/merchant/shops", label: "Toko Saya", show: isMerchant },

    // PUBLIC
    { href: "/dashboard/public", label: "Public Area", show: isPublic },
  ];

  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        {links
          .filter((link) => link.show)
          .map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-4 py-2 text-sm transition",
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {link.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
