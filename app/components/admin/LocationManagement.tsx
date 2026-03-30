"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LocationItem } from "@/types/locations";

export default function LocationManagement() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLocations() {
    try {
      const res = await api.get("/locations");
      setLocations(res.data.data || res.data || []);
    } catch (error) {
      console.error("Gagal mengambil lokasi:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Management Lokasi
          </h2>
          <p className="text-gray-600 mt-1">
            Kelola polygon lokasi yang tersedia.
          </p>
        </div>

        <Link
          href="/dashboard/locations/create"
          className="rounded-xl bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700"
        >
          + Tambah Lokasi
        </Link>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">Loading lokasi...</div>
        ) : locations.length === 0 ? (
          <div className="p-6 text-gray-500">Belum ada lokasi.</div>
        ) : (
          <div className="divide-y">
            {locations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ID: {location.id}
                  </p>
                </div>

                <Link
                  href={`/dashboard/locations/${location.id}/edit`}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
