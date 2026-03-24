"use client";

import { useEffect, useState } from "react";

export default function KioskPanel({ zoneId }: any) {
  const [kiosks, setKiosks] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/kiosks/zones/${zoneId}/kiosks`)
      .then((res) => res.json())
      .then(setKiosks);
  }, [zoneId]);

  return (
    <div style={{ width: "300px", padding: "10px", background: "#fff" }}>
      <h3>Kios</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
        }}
      >
        {kiosks.map((k: any) => (
          <div
            key={k.id}
            style={{
              width: "40px",
              height: "40px",
              margin: "5px",
              background: k.status === "AVAILABLE" ? "green" : "red",
              cursor: "pointer",
            }}
            onClick={() => alert(k.code)}
          />
        ))}
      </div>
    </div>
  );
}
