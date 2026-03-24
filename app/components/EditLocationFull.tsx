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
import { useParams } from "next/navigation";
import L from "leaflet";

// ================= AUTO FIT BOUNDS =================
function FitBounds({ geoJSON }: any) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON || !geoJSON.geometry) return;

    const layer = L.geoJSON(geoJSON);
    map.fitBounds(layer.getBounds(), {
      padding: [20, 20],
    });
  }, [geoJSON]);

  return null;
}

export default function EditLocationFull() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState<any[]>([]);
  const [geoJSON, setGeoJSON] = useState<any>(null);

  const featureGroupRef = useRef<any>(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔥 GET GEOJSON LOCATION
        const res = await fetch(
          `http://localhost:3001/kiosks/locations/${id}/geojson`,
        );
        const data = await res.json();

        // 🔥 HANDLE ARRAY / OBJECT RESPONSE
        const geo = Array.isArray(data) ? data[0]?.geojson : data?.geojson;

        if (!geo || !geo.geometry) {
          console.error("GeoJSON tidak valid");
          return;
        }

        setGeoJSON(geo);

        // 🔥 FIX STRUCTURE (Feature, bukan FeatureCollection)
        setCoordinates(geo.geometry.coordinates[0]);

        // 🔥 GET INFO LOCATION
        const infoRes = await fetch(
          `http://localhost:3001/kiosks/locations/${id}`,
        );
        const info = await infoRes.json();

        setName(info.name || "");
        setDescription(info.description || "");

        // 🔥 LOAD KE FEATURE GROUP (AGAR BISA EDIT)
        if (featureGroupRef.current) {
          const layer = L.geoJSON(geo);

          featureGroupRef.current.clearLayers();

          layer.eachLayer((l: any) => {
            featureGroupRef.current.addLayer(l);
          });
        }
      } catch (err) {
        console.error("Error fetch location:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  // ================= HANDLE EDIT =================
  const handleEdited = (e: any) => {
    e.layers.eachLayer((layer: any) => {
      const geo = layer.toGeoJSON();

      if (!geo?.geometry) return;

      let coords = geo.geometry.coordinates[0];

      // 🔥 pastikan polygon tertutup
      if (coords[0][0] !== coords[coords.length - 1][0]) {
        coords.push(coords[0]);
      }

      setCoordinates(coords);
    });
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:3001/kiosks/locations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          coordinates,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        alert(err);
        return;
      }

      alert("✅ Berhasil update lokasi!");
    } catch (err) {
      console.error(err);
      alert("❌ Gagal update");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ================= FORM ================= */}
      <div style={{ width: "300px", padding: "16px" }}>
        <h3>Edit Location</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Deskripsi"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button onClick={handleSave}>💾 Save</button>

        <p style={{ marginTop: 10 }}>
          👉 Klik ikon ✏️ di map untuk edit polygon
        </p>
      </div>

      {/* ================= MAP ================= */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[0.1, 100.1]}
          zoom={18}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* 🔥 AUTO ZOOM */}
          {geoJSON && <FitBounds geoJSON={geoJSON} />}

          {/* 🔥 TAMPILKAN POLYGON */}
          {geoJSON && <GeoJSON data={geoJSON} style={{ color: "black" }} />}

          {/* 🔥 EDITABLE LAYER */}
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
  );
}
