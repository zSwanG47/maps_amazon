import { simplifyLineString } from "./simplify";

const ROUTE_FILES = [
  { file: "route.geojson", style: "car" },
  { file: "route2.geojson", style: "boat" },
  { file: "route3.geojson", style: "boat" },
  { file: "route5.geojson", style: "boat" },
  { file: "routeYanayacu.geojson", style: "boat" },
];

function toLatLngs(coords) {
  return coords.map(([lng, lat]) => [lat, lng]);
}

function extractCoords(geojson) {
  return geojson.features[0].geometry.coordinates;
}

/** Carga rutas por fetch (no bloquea el JS inicial). Simplifica más en móvil. */
export async function loadRouteLayers({ mobile = false } = {}) {
  const maxPoints = mobile ? 80 : 250;
  const base = import.meta.env.BASE_URL;

  const layers = await Promise.all(
    ROUTE_FILES.map(async ({ file, style }) => {
      const res = await fetch(`${base}${file}`);
      if (!res.ok) return null;
      const geojson = await res.json();
      let coords = extractCoords(geojson);
      if (coords.length > maxPoints) {
        coords = simplifyLineString(coords, { maxPoints, tolerance: mobile ? 0.0002 : 0.00012 });
      }
      return { style, latlngs: toLatLngs(coords) };
    }),
  );

  return layers.filter(Boolean);
}
