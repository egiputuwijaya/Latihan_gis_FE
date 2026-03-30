export type Coordinate = [number, number];

export type GeoJSONGeometry = {
  type: "Polygon" | "MultiPolygon";
  coordinates: any;
};

export type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties?: Record<string, any>;
};

export type LocationItem = {
  id: string;
  name: string;
  description?: string | null;
  geojson?: GeoJSONFeature;
  createdAt?: string;
  updatedAt?: string;
};
