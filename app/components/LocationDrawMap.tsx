"use client";

import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";
import { createLocation } from "../lib/api";

export default function LocationDrawMap() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState<any[]>([]);

  // 🔥 saat polygon dibuat → simpan dulu, jangan langsung kirim
  const handleCreated = (e: any) => {
    const geo = e.layer.toGeoJSON();
    let coords = geo.geometry.coordinates[0];

    // pastikan polygon tertutup
    if (coords[0][0] !== coords[coords.length - 1][0]) {
      coords.push(coords[0]);
    }

    setCoordinates(coords);

    alert("Polygon berhasil dibuat, sekarang isi data lalu klik simpan");
  };

  // 🔥 tombol simpan
  const handleSave = async () => {
    if (!name || !coordinates.length) {
      alert("Nama dan polygon wajib diisi");
      return;
    }

    try {
      const res = await createLocation({
        name,
        description,
        coordinates,
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(err);
        alert("Gagal simpan lokasi");
        return;
      }

      alert("Lokasi berhasil disimpan!");

      // reset
      setName("");
      setDescription("");
      setCoordinates([]);
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 🧾 FORM */}
      <div style={{ width: "300px", padding: "16px", background: "#fff" }}>
        <h3 className="text-slate-800 font-semibold">Buat Lokasi</h3>

        <input
          type="text"
          placeholder="Nama lokasi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
          className="text-slate-800 font-semibold"
        />

        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
          className="text-slate-800 font-semibold"
        />

        <button
          onClick={handleSave}
          style={{ width: "100%" }}
          className="text-slate-800 font-semibold"
        >
          Simpan Lokasi
        </button>

        <p style={{ marginTop: "10px", fontSize: "12px" }}>
          {coordinates.length
            ? "✅ Polygon sudah dibuat"
            : "❌ Belum ada polygon"}
        </p>
      </div>

      {/* 🗺️ MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[0.1, 100.1]}
          zoom={18}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                circle: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
}
