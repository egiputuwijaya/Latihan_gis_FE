"use client";

import { useState } from "react";

export default function CategoryForm({ onSuccess }: any) {
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const handleSubmit = async () => {
    if (!name || !width || !height) {
      alert("Semua field wajib diisi");
      return;
    }

    const res = await fetch("http://localhost:3001/kiosks/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        width_m: Number(width),
        height_m: Number(height),
      }),
    });

    if (!res.ok) {
      alert("Gagal membuat kategori");
      return;
    }

    alert("Kategori berhasil dibuat!");

    setName("");
    setWidth("");
    setHeight("");

    if (onSuccess) onSuccess(); // 🔥 fleksibel
  };

  return (
    <div style={{ marginTop: 20 }}>
      <input
        placeholder="Nama kategori"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Lebar (meter)"
        value={width}
        onChange={(e) => setWidth(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Tinggi (meter)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>💾 Simpan</button>
    </div>
  );
}
