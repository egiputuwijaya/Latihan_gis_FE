"use client";

import { rentKiosk } from "../lib/api";

export default function KioskDetail({ kiosk }: any) {
  if (!kiosk) {
    return <div className="p-4">Pilih kios</div>;
  }

  const handleRent = async () => {
    await rentKiosk(kiosk.id);
    alert("Berhasil disewa");
    location.reload();
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-bold">{kiosk.code}</h2>

      <p>Category: {kiosk.category.name}</p>
      <p>
        Size: {kiosk.category.width_m} x {kiosk.category.height_m}
      </p>

      <p>Status: {kiosk.status}</p>

      {kiosk.status === "AVAILABLE" && (
        <button
          onClick={handleRent}
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          Sewa
        </button>
      )}
    </div>
  );
}
