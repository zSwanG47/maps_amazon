function distancePointToSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

export function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let maxIdx = 0;
  const first = points[0];
  const last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = distancePointToSegment(points[i], first, last);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }
  if (maxDist > tolerance) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

/** Reduce puntos según tolerancia y tope máximo (útil para rutas GPS densas). */
export function simplifyLineString(coords, { maxPoints = 250, tolerance = 0.00012 } = {}) {
  if (!coords || coords.length <= maxPoints) return coords;

  let tol = tolerance;
  let result = coords;
  while (result.length > maxPoints && tol < 0.02) {
    result = douglasPeucker(coords, tol);
    tol *= 1.6;
  }
  return result;
}

export function simplifyGeoJSON(geojson, options) {
  const feature = geojson?.features?.[0];
  if (!feature || feature.geometry?.type !== "LineString") return geojson;

  const original = feature.geometry.coordinates;
  const simplified = simplifyLineString(original, options);

  if (simplified.length === original.length) return geojson;

  return {
    ...geojson,
    features: [{
      ...feature,
      geometry: { ...feature.geometry, coordinates: simplified },
    }],
  };
}

export function lineStringCoords(geojson) {
  const coords = geojson?.features?.[0]?.geometry?.coordinates;
  return Array.isArray(coords) ? coords : [];
}
