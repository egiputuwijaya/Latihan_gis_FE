"use client";

import useAuth from "@/hooks/useAuth";

export default function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b bg-white px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Selamat Datang
        </h1>
        <p className="text-sm text-gray-500">
          {user?.name || "User"} • {user?.email || "-"}
        </p>
      </div>

      <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
        {user?.roles?.join(", ") || "No Role"}
      </div>
    </header>
  );
}