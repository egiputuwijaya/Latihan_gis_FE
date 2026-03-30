"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import { useParams, useRouter } from "next/navigation";
import L from "leaflet";

function FitBounds({ geoJSON }: { geoJSON: any }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON || !geoJSON.geometry) return;

    const layer = L.geoJSON(geoJSON);
    map.fitBounds(layer.getBounds(), { padding: [20, 20] });
  }, [geoJSON, map]);

  return null;
}

export default function EditLocationFull() {
  const { id } = useParams();
  const router = useRouter();

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [geoJSON, setGeoJSON] = useState<any>(null);

  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      setLoadingFetch(true);
      setError("");

      try {
        const resGeo = await fetch(
          `http://localhost:3001/kiosks/locations/${id}/geojson`,
          {
            credentials: "include",
          },
        );
        const geoData = await resGeo.json();

        const geo = Array.isArray(geoData)
          ? geoData[0]?.geojson
          : geoData?.geojson;

        if (!geo || !geo.geometry) {
          throw new Error("GeoJSON tidak valid");
        }

        setGeoJSON(geo);
        setCoordinates(geo.geometry.coordinates[0]);

        const resInfo = await fetch(
          `http://localhost:3001/kiosks/locations/${id}`,
          {
            credentials: "include",
          },
        );
        const info = await resInfo.json();

        if (!resInfo.ok) {
          throw new Error(info.message || "Gagal mengambil data lokasi");
        }

        setName(info.name || "");
        setDescription(info.description || "");

        if (featureGroupRef.current) {
          const layer = L.geoJSON(geo);
          featureGroupRef.current.clearLayers();

          layer.eachLayer((l: any) => {
            featureGroupRef.current?.addLayer(l);
          });
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat lokasi");
      } finally {
        setLoadingFetch(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // =========================
  // HANDLE EDIT
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
  // SAVE
  // =========================
  const handleSave = async () => {
    setLoadingSave(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`http://localhost:3001/kiosks/locations/${id}`, {
        method: "PATCH",
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
        throw new Error(data.message || "Gagal update lokasi");
      }

      setMessage("Lokasi berhasil diperbarui");

      setTimeout(() => {
        router.push("/dashboard/locations");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingSave(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Memuat data lokasi...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      {/* ========================= */}
      {/* LEFT PANEL */}
      {/* ========================= */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Edit Lokasi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ubah informasi lokasi dan edit polygon area pada peta.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nama Lokasi
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lokasi"
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
              placeholder="Deskripsi lokasi"
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-900"
            />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-800">Petunjuk:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Klik ikon ✏️ di map untuk edit polygon.</li>
              <li>Perubahan bentuk polygon akan ikut tersimpan.</li>
            </ul>
          </div>

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
            disabled={loadingSave}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingSave ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* MAP */}
      {/* ========================= */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="h-[75vh] w-full">
          <MapContainer
            center={[0.5071, 101.4478]}
            zoom={18}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {geoJSON && <FitBounds geoJSON={geoJSON} />}
            {geoJSON && <GeoJSON data={geoJSON} style={{ color: "#0f172a" }} />}

            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topright"
                onEdited={handleEdited}
                draw={false}
                edit={{
                  edit: true,
                  remove: false,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
