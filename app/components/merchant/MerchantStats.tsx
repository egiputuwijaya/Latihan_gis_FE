"use client";

import Link from "next/link";

export default function MerchantStats() {
  const stats = [
    {
      title: "Toko Saya",
      value: "1",
      description: "Jumlah toko yang kamu kelola",
    },
    {
      title: "Produk / Kios Aktif",
      value: "0",
      description: "Jumlah kios atau unit aktif saat ini",
    },
    {
      title: "Status Akun",
      value: "Merchant",
      description: "Role akun yang sedang digunakan",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-white border p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h2>
        <p className="mt-2 text-sm text-gray-600">
          Kelola toko, pantau status merchant, dan akses fitur usaha kamu dari
          sini.
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
          Akses halaman penting merchant dengan cepat.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/merchant/shops"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Kelola Toko Saya
          </Link>

          <Link
            href="/dashboard/profile"
            className="rounded-xl border px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Edit Profil
          </Link>
        </div>
      </div>
    </div>
  );
}
