"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useRouter } from "next/navigation";

export default function MapView() {
  const [zones, setZones] = useState<any>(null);
  const [locations, setLocations] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3001/kiosks/zones/geojson")
      .then((res) => res.json())
      .then((d) => setZones(d[0].geojson));

    fetch("http://localhost:3001/kiosks/locations/geojson")
      .then((res) => res.json())
      .then((d) => setLocations(d[0].geojson));
  }, []);

  const onEachZone = (feature: any, layer: any) => {
    layer.on("click", () => {
      router.push(`/kiosks/zones/${feature.properties.id}`);
    });
  };

  return (
    <MapContainer center={[0.1, 100.1]} zoom={18} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* LOCATION */}
      {locations && <GeoJSON data={locations} style={{ color: "black" }} />}

      {/* ZONE */}
      {zones && (
        <GeoJSON
          data={zones}
          style={{ color: "blue" }}
          onEachFeature={onEachZone}
        />
      )}
    </MapContainer>
  );
}
