"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/kiosks/locations");
    const data = await res.json();
    setLocations(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus?")) return;

    await fetch(`http://localhost:3001/kiosks/locations/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Locations</h1>

      {/* 🔥 BUTTON TAMBAH */}
      <Link href="/admin/locations/create">
        <button style={{ marginBottom: "20px" }}>➕ Tambah Location</button>
      </Link>

      {locations.map((loc: any) => (
        <div
          key={loc.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{loc.name}</h3>
          <p>{loc.description}</p>

          <Link href={`/admin/locations/edit/${loc.id}`}>
            <button>Edit</button>
          </Link>

          <button onClick={() => handleDelete(loc.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
