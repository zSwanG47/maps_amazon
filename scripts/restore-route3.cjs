// maps3..geojson → route3 simplificado para carga rápida en móvil
// Uso: npm run restore-route3
const fs = require("fs");
const path = require("path");

const MAX_POINTS = 120;
const SRC = path.join(__dirname, "../../maps3..geojson");
const OUT_PUB = path.join(__dirname, "../public/route3.geojson");
const OUT_BUNDLE = path.join(__dirname, "../src/data/routes/route3.json");

function distancePointToSegment(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
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
    const left = douglasPeucker(points.slice(0, maxIdx + 1), tolerance);
    const right = douglasPeucker(points.slice(maxIdx), tolerance);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

function simplifyLineString(coords, maxPoints) {
  if (coords.length <= maxPoints) return coords;
  let tol = 0.0001;
  let result = coords;
  while (result.length > maxPoints && tol < 0.02) {
    result = douglasPeucker(coords, tol);
    tol *= 1.6;
  }
  return result;
}

if (!fs.existsSync(SRC)) {
  console.error("No se encontró maps3..geojson");
  process.exit(1);
}

const geojson = JSON.parse(fs.readFileSync(SRC, "utf8"));
const original = geojson.features[0].geometry.coordinates;
const simplified = simplifyLineString(original, MAX_POINTS);
geojson.features[0].geometry.coordinates = simplified;

const json = JSON.stringify(geojson);
fs.writeFileSync(OUT_PUB, json);
fs.writeFileSync(OUT_BUNDLE, json);
console.log(`route3: ${original.length} → ${simplified.length} pts`);
