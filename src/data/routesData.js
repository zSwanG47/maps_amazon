import route1 from "./routes/route.json";
import route2 from "./routes/route2.json";
import route3 from "./routes/route3.json";
import route5 from "./routes/route5.json";
import routeYanayacu from "./routes/routeYanayacu.json";
import { routeTotalKm } from "../utils/geo";

function toLatLngs(coords) {
  return coords.map(([lng, lat]) => [lat, lng]);
}

function extractCoords(geojson) {
  return geojson.features[0].geometry.coordinates;
}

/** Rutas pre-procesadas: sin fetch ni simplificación en runtime. */
export const ROUTE_LAYERS = [
  { style: "car",  latlngs: toLatLngs(extractCoords(route1)) },
  { style: "boat", latlngs: toLatLngs(extractCoords(route2)) },
  { style: "boat", latlngs: toLatLngs(extractCoords(route3)) },
  { style: "boat", latlngs: toLatLngs(extractCoords(route5)) },
  { style: "boat", latlngs: toLatLngs(extractCoords(routeYanayacu)) },
];

export const routeGeo = {
  geojson: route1,
  geojson2: route2,
  geojson3: route3,
};

export const routeStats = {
  highwayKm: routeTotalKm(route1),
  riverKm: routeTotalKm(route2) + routeTotalKm(route3),
};
