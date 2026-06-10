// Simplifica GeoJSON de la raíz → public/ + src/data/routes/ (bundled en build)
// Uso: npm run simplify-routes
const fs = require("fs");
const path = require("path");

const SOURCES = [
  { src: "../../maps..geojson",  dst: "route",  maxPoints: 180 },
  { src: "../../maps2..geojson", dst: "route2", maxPoints: 80 },
  // route3: usar npm run restore-route3 (todas las coordenadas de maps3)
  { src: "../../maps4.geojson",  dst: "route4", maxPoints: 200 },
  { src: "../../maps5.geojson",  dst: "route5", maxPoints: 120 },
];

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

const publicDir = path.join(__dirname, "../public");
const bundleDir = path.join(__dirname, "../src/data/routes");

fs.mkdirSync(bundleDir, { recursive: true });

SOURCES.filter((s) => s.dst !== "route3").forEach(({ src, dst, maxPoints }) => {
  const srcPath = path.join(__dirname, src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠ Saltando ${dst}: no existe ${src}`);
    return;
  }

  const geojson = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const original = geojson.features[0].geometry.coordinates;
  const simplified = simplifyLineString(original, maxPoints);
  geojson.features[0].geometry.coordinates = simplified;

  const json = JSON.stringify(geojson);
  fs.writeFileSync(path.join(publicDir, `${dst}.geojson`), json);
  fs.writeFileSync(path.join(bundleDir, `${dst}.json`), json);

  const pct = Math.round((simplified.length / original.length) * 100);
  console.log(`${dst}: ${original.length} → ${simplified.length} pts (${pct}%)`);
});
