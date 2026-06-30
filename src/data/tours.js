import { waypoints as eldoradoWaypoints } from "./waypoints";

const lupunaWaypoints = eldoradoWaypoints
  .filter((wp) => wp.id <= 5)
  .map((wp, index, list) =>
    index === list.length - 1 ? { ...wp, type: "end" } : wp,
  );

const eldoradoRoutes = [
  { file: "route.geojson", style: "car" },
  { file: "route2.geojson", style: "boat" },
  { file: "route3.geojson", style: "boat" },
  { file: "route5.geojson", style: "boat" },
  { file: "routeYanayacu.geojson", style: "boat" },
];

const lupunaRoutes = [
  { file: "route.geojson", style: "car" },
  { file: "route2.geojson", style: "boat" },
  { file: "routeYanayacu.geojson", style: "boat" },
  { file: "routeLupuna.geojson", style: "boat" },
];

export const tours = {
  eldorado: {
    id: "eldorado",
    path: "/eldorado",
    waypoints: eldoradoWaypoints,
    routes: eldoradoRoutes,
    routeStats: { highwayKm: 99, riverKm: 172 },
  },
  lupuna: {
    id: "lupuna",
    path: "/lupuna",
    waypoints: lupunaWaypoints,
    routes: lupunaRoutes,
    routeStats: { highwayKm: 99, riverKm: 172 },
  },
};

export function getTour(tourId) {
  return tours[tourId] ?? tours.eldorado;
}
