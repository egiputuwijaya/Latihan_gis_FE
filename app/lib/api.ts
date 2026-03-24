const BASE_URL = "http://localhost:3001";

export async function getZonesGeoJSON() {
  const res = await fetch(`${BASE_URL}/kiosks/zones/geojson`);
  const data = await res.json();
  return data[0].geojson;
}

export async function getKiosksByZone(zoneId: string) {
  const res = await fetch(`${BASE_URL}/kiosks/zones/${zoneId}/kiosks`);
  return res.json();
}

export async function getKioskDetail(id: string) {
  const res = await fetch(`${BASE_URL}/kiosks/kiosks/${id}`);
  return res.json();
}

export async function rentKiosk(id: string) {
  return fetch(`${BASE_URL}/kiosks/kiosks/${id}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "OCCUPIED",
    }),
  });
}

export async function createZone(data: any) {
  return fetch(`${BASE_URL}/kiosks/zones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function createLocation(data: any) {
  return fetch("http://localhost:3001/kiosks/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
