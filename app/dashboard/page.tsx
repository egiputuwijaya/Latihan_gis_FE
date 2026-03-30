"use client";

import useAuth from "@/hooks/useAuth";
import AdminStats from "@/app/components/admin/AdminStats";
import MerchantStats from "@/app/components/merchant/MerchantStats";
import PublicStats from "@/app/components/public/PublicStats";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!user) {
    return <p>User tidak ditemukan</p>;
  }

  const isAdmin = user.roles.includes("admin");
  const isMerchant = user.roles.includes("merchant");
  const isPublic = user.roles.includes("public");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Selamat datang, {user.name}</p>
      </div>

      {isAdmin && <AdminStats />}
      {isMerchant && <MerchantStats />}
      {isPublic && <PublicStats />}
    </div>
  );
}
