"use client";

import { useEffect, useState } from "react";
import { getKiosksByZone } from "../lib/api";
import KioskDetail from "./KioskDetail";

export default function ZoneGrid({ zoneId }: { zoneId: string }) {
  const [kiosks, setKiosks] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getKiosksByZone(zoneId).then(setKiosks);
  }, [zoneId]);

  return (
    <div className="flex h-screen">
      {/* GRID */}
      <div className="grid grid-cols-10 gap-2 p-4 flex-1">
        {kiosks.map((k) => (
          <div
            key={k.id}
            onClick={() => setSelected(k)}
            className={`p-3 text-xs text-white cursor-pointer text-center rounded
              ${k.status === "AVAILABLE" ? "bg-green-500" : "bg-red-500"}
            `}
          >
            {k.code}
          </div>
        ))}
      </div>

      {/* DETAIL PANEL */}
      <div className="w-80 border-l">
        <KioskDetail kiosk={selected} />
      </div>
    </div>
  );
}
