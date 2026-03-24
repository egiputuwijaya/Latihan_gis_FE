"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ZoneDrawMap({
  location,
  zones,
  selectedZone,
  preview,
  kiosks,
}: any) {
  useEffect(() => {
    const map = L.map("map").setView([-2.5, 118], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map,
    );

    // LOCATION
    if (location?.geom) {
      const layer = L.geoJSON(location.geom).addTo(map);
      map.fitBounds(layer.getBounds());
    }

    // ZONES
    zones.forEach((z: any) => {
      L.geoJSON(z.geometry, {
        style: {
          color:
            selectedZone?.properties.id === z.properties.id ? "red" : "blue",
        },
      }).addTo(map);
    });

    // PREVIEW GRID
    if (preview?.features) {
      preview.features.forEach((f: any) => {
        L.geoJSON(f.geometry, {
          style: {
            color: "green",
            weight: 1,
          },
        }).addTo(map);
      });
    }

    // KIOSKS
    if (kiosks && kiosks.length > 0) {
      kiosks.forEach((k: any) => {
        L.geoJSON(k.geom, {
          style: {
            color:
              k.category?.name === "A"
                ? "blue"
                : k.category?.name === "B"
                  ? "green"
                  : "orange",
            weight: 1,
          },
        }).addTo(map);
      });
    }

    return () => {
      map.remove();
    };
  }, [location, zones, selectedZone, preview, kiosks]);

  return <div id="map" style={{ flex: 1 }} />;
}
