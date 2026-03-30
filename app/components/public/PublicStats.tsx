"use client";

import Link from "next/link";

export default function PublicStats() {
  const stats = [
    {
      title: "Status Akun",
      value: "Public",
      description: "Akun kamu saat ini masih user biasa",
    },
    {
      title: "Akses Dashboard",
      value: "Aktif",
      description: "Kamu bisa mengelola profil dan upgrade role",
    },
    {
      title: "Keamanan Akun",
      value: "Siap",
      description: "Kamu bisa mengatur password dan 2FA",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white border p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Public Dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          Kelola akun kamu, perbarui profil, dan upgrade menjadi merchant jika
          dibutuhkan.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{item.title}</p>
            <h3 className="mt-3 text-3xl font-bold text-gray-900">
              {item.value}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Aksi Cepat</h3>
        <p className="mt-1 text-sm text-gray-600">
          Kelola akun dan lanjutkan pengaturan profil kamu.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/profile"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Kelola Profil
          </Link>

          <Link
            href="/dashboard/public"
            className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Lihat Public Area
          </Link>
        </div>
      </div>
    </div>
  );
}
