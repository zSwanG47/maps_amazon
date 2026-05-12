// Calcula distancia en km entre dos coordenadas [lng, lat] usando Haversine
export function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calcula la longitud total del GeoJSON LineString en km
export function routeTotalKm(geojson) {
  if (!geojson) return 0;
  const feature = geojson.features?.[0];
  if (!feature || feature.geometry.type !== "LineString") return 0;
  const coords = feature.geometry.coordinates;
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineKm(coords[i - 1], coords[i]);
  }
  return total;
}

// Enriquece waypoints con distancias calculadas entre paradas
export function enrichWaypoints(waypoints) {
  return waypoints.map((wp, i) => {
    if (i === 0) return { ...wp, distanceFromPrev: 0 };
    const dist = haversineKm(waypoints[i - 1].coords, wp.coords);
    return { ...wp, distanceFromPrev: dist };
  });
}

// Estima tiempo de viaje (carretera Iquitos-Nauta ~50 km/h promedio)
export function estimateTime(km, speedKmh = 50) {
  const totalMin = (km / speedKmh) * 60;
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}
