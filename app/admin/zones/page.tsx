"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ZoneDrawMap = dynamic(() => import("../../components/ZoneDrawMap"), {
  ssr: false,
});

export default function ZonesPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [preview, setPreview] = useState<any>(null);
  const [zoneSummary, setZoneSummary] = useState<any>(null);
  const [kiosks, setKiosks] = useState<any[]>([]);

  // ================= INIT =================
  useEffect(() => {
    const load = async () => {
      const loc = await fetch("http://localhost:3001/kiosks/locations").then(
        (r) => r.json(),
      );
      setLocations(loc);

      const cat = await fetch("http://localhost:3001/kiosks/categories").then(
        (r) => r.json(),
      );
      setCategories(cat);

      if (loc.length > 0) handleSelectLocation(loc[0].id);
    };

    load();
  }, []);

  // ================= SELECT LOCATION =================
  const handleSelectLocation = async (id: string) => {
    const locRes = await fetch(
      `http://localhost:3001/kiosks/locations/${id}/geojson`,
    );
    const locData = await locRes.json();

    setSelectedLocation({
      id,
      geom: locData[0].geojson,
    });

    const zoneRes = await fetch(
      `http://localhost:3001/kiosks/locations/${id}/zones`,
    );
    const zoneData = await zoneRes.json();

    setZones(zoneData[0]?.geojson?.features || []);

    setSelectedZone(null);
    setPreview(null);
    setZoneSummary(null);
    setKiosks([]);
  };

  // ================= SELECT ZONE =================
  const handleSelectZone = async (zone: any) => {
    setSelectedZone(zone);
    setPreview(null);

    // summary
    const sumRes = await fetch(
      `http://localhost:3001/kiosks/zones/${zone.properties.id}/summary`,
    );
    const sumData = await sumRes.json();
    setZoneSummary(sumData);

    // kiosks
    const kiosRes = await fetch(
      `http://localhost:3001/kiosks/zones/${zone.properties.id}/kiosks`,
    );
    const kiosData = await kiosRes.json();
    setKiosks(kiosData);
  };

  // ================= GENERATE PREVIEW =================
  const handleGenerate = async () => {
    if (!selectedZone) return alert("Pilih zona dulu");

    const res = await fetch(
      `http://localhost:3001/kiosks/zones/${selectedZone.properties.id}/generate-preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryIds: selectedCategories,
        }),
      },
    );

    const data = await res.json();
    setPreview(data);
  };

  // ================= CONFIRM =================
  const handleConfirm = async () => {
    if (!selectedZone) return;

    await fetch(
      `http://localhost:3001/kiosks/zones/${selectedZone.properties.id}/generate-confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryIds: selectedCategories, // ✅ FIX
        }),
      },
    );

    alert("Kios berhasil disimpan");

    // reload
    handleSelectZone(selectedZone);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div style={{ width: 320, padding: 16, overflow: "auto" }}>
        <h3>Lokasi</h3>

        <select onChange={(e) => handleSelectLocation(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

        <hr />

        <h4>Zona</h4>
        {zones.map((z) => (
          <div
            key={z.properties.id}
            onClick={() => handleSelectZone(z)}
            style={{
              cursor: "pointer",
              padding: 6,
              background:
                selectedZone?.properties.id === z.properties.id ? "#ddd" : "",
            }}
          >
            {z.properties.name}
          </div>
        ))}

        <hr />

        <h4>Kategori</h4>
        {categories.map((c) => (
          <div key={c.id}>
            <input
              type="checkbox"
              value={c.id}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCategories([...selectedCategories, c.id]);
                } else {
                  setSelectedCategories(
                    selectedCategories.filter((id) => id !== c.id),
                  );
                }
              }}
            />
            {c.name}
          </div>
        ))}

        <br />

        {/* GENERATE BUTTON */}
        <button onClick={handleGenerate} disabled={zoneSummary?.total > 0}>
          ⚡ Generate Preview
        </button>

        {zoneSummary?.total > 0 && (
          <>
            <p style={{ color: "red" }}>Zona sudah memiliki kios</p>

            <button
              onClick={() => {
                if (confirm("Regenerate kios? Data lama akan dihapus")) {
                  handleGenerate();
                }
              }}
            >
              ✏️ Edit Kios
            </button>
          </>
        )}

        {/* SUMMARY */}
        {zoneSummary && (
          <>
            <hr />
            <h4>📊 Info Zona</h4>

            <p>Total: {zoneSummary.total}</p>

            {zoneSummary.breakdown.map((item: any) => (
              <p key={item.category}>
                {item.category}: {item.total}
              </p>
            ))}
          </>
        )}

        {/* PREVIEW */}
        {preview && (
          <>
            <hr />
            <h4>Preview</h4>

            {Object.entries(preview.summary).map(([k, v]: any) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}

            <button onClick={handleConfirm}>✅ Confirm</button>
            <button onClick={() => setPreview(null)}>❌ Cancel</button>
          </>
        )}
      </div>

      {/* MAP */}
      {selectedLocation && (
        <ZoneDrawMap
          location={selectedLocation}
          zones={zones}
          selectedZone={selectedZone}
          preview={preview}
          kiosks={kiosks}
        />
      )}
    </div>
  );
}
