"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { useParams } from "next/navigation";

export default function ZoneDetailMap() {
  const { id } = useParams();

  const [kiosks, setKiosks] = useState<any[]>([]);
  const [zone, setZone] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/kiosks/zones/${id}/kiosks`)
      .then((res) => res.json())
      .then(setKiosks);

    fetch(`http://localhost:3001/kiosks/zones/geojson`)
      .then((res) => res.json())
      .then((data) => {
        const z = data[0].geojson.features.find(
          (f: any) => f.properties.id === id,
        );
        setZone(z);
      });
  }, [id]);

  // 🔥 ACTION SEWA
  const handleRent = async (kioskId: string) => {
    const res = await fetch(
      `http://localhost:3001/kiosks/kiosks/${kioskId}/status`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "OCCUPIED",
        }),
      },
    );

    if (!res.ok) {
      alert("Gagal sewa");
      return;
    }

    alert("Berhasil sewa!");

    // 🔄 reload kios
    const data = await fetch(
      `http://localhost:3001/kiosks/zones/${id}/kiosks`,
    ).then((r) => r.json());

    setKiosks(data);
  };

  return (
    <MapContainer center={[0.1, 100.1]} zoom={19} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* ZONE */}
      {zone && <GeoJSON data={zone} style={{ color: "blue" }} />}

      {/* KIOS */}
      {kiosks.map((k: any) => (
        <GeoJSON
          key={k.id}
          data={k.geom}
          style={{
            color: k.status === "AVAILABLE" ? "green" : "red",
          }}
        >
          <Popup>
            <div>
              <h4>{k.code}</h4>
              <p>Status: {k.status}</p>
              <p>Category: {k.category?.name}</p>

              {k.status === "AVAILABLE" && (
                <button onClick={() => handleRent(k.id)}>🛒 Sewa</button>
              )}
            </div>
          </Popup>
        </GeoJSON>
      ))}
    </MapContainer>
  );
}
