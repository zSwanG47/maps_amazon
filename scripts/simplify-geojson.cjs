// Simplifica GeoJSON eliminando puntos redundantes (Douglas-Peucker simplificado)
// Uso: node scripts/simplify-geojson.js
const fs = require("fs");
const path = require("path");

// Tolerancia en grados (~11m a latitud 5°S). Ajusta si quieres más/menos detalle.
const TOLERANCE = 0.0001;

function distancePointToSegment(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) {
    return Math.hypot(p[0] - a[0], p[1] - a[1]);
  }
  const t = Math.max(0, Math.min(1, ((p[0]-a[0])*dx + (p[1]-a[1])*dy) / (dx*dx + dy*dy)));
  return Math.hypot(p[0] - (a[0]+t*dx), p[1] - (a[1]+t*dy));
}

function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;
  let maxDist = 0, maxIdx = 0;
  const first = points[0], last = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = distancePointToSegment(points[i], first, last);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }
  if (maxDist > tolerance) {
    const left  = douglasPeucker(points.slice(0, maxIdx + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

const publicDir = path.join(__dirname, "../public");
const files = ["route.geojson", "route2.geojson", "route4.geojson", "route5.geojson"];

files.forEach(file => {
  const filepath = path.join(publicDir, file);
  const geojson = JSON.parse(fs.readFileSync(filepath, "utf8"));
  const original = geojson.features[0].geometry.coordinates;
  const simplified = douglasPeucker(original, TOLERANCE);
  geojson.features[0].geometry.coordinates = simplified;
  fs.writeFileSync(filepath, JSON.stringify(geojson));
  console.log(`${file}: ${original.length} → ${simplified.length} puntos (${Math.round(simplified.length/original.length*100)}%)`);
});
