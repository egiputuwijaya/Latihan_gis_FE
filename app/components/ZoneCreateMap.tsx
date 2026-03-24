"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

export default function ZoneCreateMap() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");

  const [zones, setZones] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [coordinates, setCoordinates] = useState<any[]>([]);
  const featureGroupRef = useRef<any>(null);

  // ================= GET LOCATIONS =================
  useEffect(() => {
    fetch("http://localhost:3001/kiosks/locations")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  // ================= SELECT LOCATION =================
  const handleSelectLocation = async (id: string) => {
    setSelectedLocationId(id);

    // 🔥 ambil geojson lokasi
    const res = await fetch(
      `http://localhost:3001/kiosks/locations/${id}/geojson`,
    );
    const data = await res.json();

    const geo = data[0]?.geojson;
    setSelectedLocation(geo);

    // 🔥 ambil zones berdasarkan location (FIX)
    const zonesRes = await fetch(
      `http://localhost:3001/kiosks/locations/${id}/zones`,
    );
    const zonesData = await zonesRes.json();

    const zonesGeo = zonesData[0]?.geojson;

    // 🔥 safety: pastikan tidak null
    if (!zonesGeo || !zonesGeo.features) {
      setZones({ type: "FeatureCollection", features: [] });
    } else {
      setZones(zonesGeo);
    }
  };

  // ================= DRAW =================
  const handleCreated = (e: any) => {
    const geo = e.layer.toGeoJSON();
    let coords = geo.geometry.coordinates[0];

    // tutup polygon
    if (coords[0][0] !== coords[coords.length - 1][0]) {
      coords.push(coords[0]);
    }

    setCoordinates(coords);
  };

  // ================= SAVE =================
  const handleSave = async () => {
    if (!selectedLocationId) {
      alert("Pilih lokasi dulu!");
      return;
    }

    const res = await fetch("http://localhost:3001/kiosks/zones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        locationId: selectedLocationId, // ✅ FIX
        coordinates,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err);
      return;
    }

    alert("Zona berhasil dibuat!");

    // 🔥 reload zones
    handleSelectLocation(selectedLocationId);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* PANEL */}
      <div style={{ width: 300, padding: 16 }}>
        <h3>Buat Zona</h3>

        <select onChange={(e) => handleSelectLocation(e.target.value)}>
          <option value="">Pilih Lokasi</option>
          {locations.map((loc: any) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Nama Zona"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleSave}>💾 Simpan Zona</button>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[0.1, 100.1]}
          zoom={15}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* LOCATION */}
          {selectedLocation && (
            <GeoJSON data={selectedLocation} style={{ color: "black" }} />
          )}

          {/* ZONES */}
          {zones?.features?.length > 0 && (
            <GeoJSON data={zones} style={{ color: "blue" }} />
          )}

          {/* DRAW */}
          <FeatureGroup ref={featureGroupRef}>
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
