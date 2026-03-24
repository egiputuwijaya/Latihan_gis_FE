"use client";
import { useEffect, useState } from "react";

export default function LocationSelector({ onSelect }: any) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/kiosks/locations")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option>Pilih Location</option>
      {locations.map((loc: any) => (
        <option key={loc.id} value={loc.id}>
          {loc.name}
        </option>
      ))}
    </select>
  );
}
