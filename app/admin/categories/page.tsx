"use client";

import { useEffect, useState } from "react";
import CategoryForm from "../../components/CategoryForm";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  const loadCategories = async () => {
    const res = await fetch("http://localhost:3001/kiosks/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Kategori Kios</h2>

      <Link href="/admin/categories/create">
        <button>➕ Tambah Kategori</button>
      </Link>
      <hr />

      {/* LIST */}
      <h3>Daftar Kategori</h3>
      {categories.map((cat) => (
        <div
          key={cat.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <b>{cat.name}</b>
          <p>
            Ukuran: {cat.width_m}m x {cat.height_m}m
          </p>
        </div>
      ))}
    </div>
  );
}
