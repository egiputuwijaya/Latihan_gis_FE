"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/app/components/CategoryForm";

export default function CreateCategoryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/categories"); // balik ke list
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Buat Kategori Kios</h2>

      <CategoryForm onSuccess={handleSuccess} />
    </div>
  );
}
