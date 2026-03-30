export type GeoJSONPolygon = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  properties?: Record<string, any>;
};

export type LocationItem = {
  id: string;
  name: string;
  description: string | null;
  geojson?: GeoJSONPolygon;
  createdAt?: string;
  updatedAt?: string;
};

export type LocationResponse = {
  data: LocationItem[];
};

export type SingleLocationResponse = {
  id: string;
  name: string;
  description: string | null;
};

export type LocationCoordinates = [number, number];
