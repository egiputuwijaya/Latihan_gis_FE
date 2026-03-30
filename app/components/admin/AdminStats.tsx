"use client";

import Link from "next/link";

export default function AdminStats() {
  const cards = [
    {
      title: "Kelola Lokasi",
      description: "Tambah, edit, dan lihat polygon lokasi pasar / area.",
      href: "/dashboard/locations",
      button: "Buka Locations",
    },
    {
      title: "Kelola Zona",
      description: "Atur zona yang tersedia di dalam setiap lokasi.",
      href: "/dashboard/zones",
      button: "Buka Zones",
    },
    {
      title: "Kelola Kios",
      description: "Atur data kios, kategori kios, dan relasi zona.",
      href: "/dashboard/kiosks",
      button: "Buka Kiosks",
    },
    {
      title: "Profile & Security",
      description: "Perbarui nama, email, password, dan pengaturan keamanan.",
      href: "/dashboard/profile",
      button: "Buka Profile",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
        <p className="mt-1 text-sm text-gray-600">
          Akses cepat untuk mengelola data utama sistem.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.href}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-6">
              {card.description}
            </p>

            <Link
              href={card.href}
              className="mt-5 inline-flex rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
            >
              {card.button}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
