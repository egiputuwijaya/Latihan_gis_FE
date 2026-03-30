"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

export default function CreateLocationFull() {
  const router = useRouter();
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // HANDLE CREATE POLYGON
  // =========================
  const handleCreated = (e: any) => {
    const layer = e.layer;
    const geo = layer.toGeoJSON();

    if (!geo?.geometry) return;

    let coords = geo.geometry.coordinates[0];

    // pastikan polygon tertutup
    if (
      coords.length > 0 &&
      (coords[0][0] !== coords[coords.length - 1][0] ||
        coords[0][1] !== coords[coords.length - 1][1])
    ) {
      coords.push(coords[0]);
    }

    setCoordinates(coords);

    // hanya izinkan 1 polygon
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
      featureGroupRef.current.addLayer(layer);
    }
  };

  // =========================
  // HANDLE EDIT POLYGON
  // =========================
  const handleEdited = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      const geo = layer.toGeoJSON();

      if (!geo?.geometry) return;

      let coords = geo.geometry.coordinates[0];

      if (
        coords.length > 0 &&
        (coords[0][0] !== coords[coords.length - 1][0] ||
          coords[0][1] !== coords[coords.length - 1][1])
      ) {
        coords.push(coords[0]);
      }

      setCoordinates(coords);
    });
  };

  // =========================
  // HANDLE DELETE POLYGON
  // =========================
  const handleDeleted = () => {
    setCoordinates([]);
  };

  // =========================
  // SAVE
  // =========================
  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!name.trim()) {
        throw new Error("Nama lokasi wajib diisi");
      }

      if (!coordinates.length) {
        throw new Error("Silakan gambar polygon lokasi terlebih dahulu");
      }

      const res = await fetch("http://localhost:3001/kiosks/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          description,
          coordinates,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat lokasi");
      }

      setMessage("Lokasi berhasil dibuat");

      setTimeout(() => {
        router.push("/dashboard/locations");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      {/* ========================= */}
      {/* LEFT PANEL */}
      {/* ========================= */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Buat Lokasi Baru
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Isi data lokasi lalu gambar area polygon di peta.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nama Lokasi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Area Pasar Utama"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-900"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi lokasi..."
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-900"
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Petunjuk:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Klik ikon polygon di map untuk menggambar area.</li>
              <li>Klik ikon edit untuk memperbaiki bentuk polygon.</li>
              <li>Hanya 1 polygon yang digunakan untuk 1 lokasi.</li>
            </ul>
          </div>

          {coordinates.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              Polygon berhasil dibuat dan siap disimpan.
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Lokasi"}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* MAP */}
      {/* ========================= */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="h-[75vh] w-full">
          <MapContainer
            center={[0.5071, 101.4478]} // Pekanbaru-ish / Riau
            zoom={17}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topright"
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false,
                  polygon: {
                    allowIntersection: false,
                    showArea: true,
                  },
                }}
                edit={{
                  edit: true,
                  remove: true,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
