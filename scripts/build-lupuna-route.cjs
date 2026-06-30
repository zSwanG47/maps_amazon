// maps7 (o maps6) → public/routeLupuna.geojson (tramo después de Buenos Aires)
// Uso: npm run build-lupuna
const fs = require("fs");
const path = require("path");

const MAX_POINTS = 180;
const BA = [-73.836651, -4.659976];
const ROOT = path.join(__dirname, "../..");
const CANDIDATES = ["maps7.geojson", "maps6.geojson", "maps6..geojson"];

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

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function nearestIndex(coords, point) {
  let best = 0, min = Infinity;
  coords.forEach((p, i) => {
    const d = dist(p, point);
    if (d < min) { min = d; best = i; }
  });
  return { index: best, distance: min };
}

/** maps7/maps4: recorte el tramo río que sale de Buenos Aires (sin el salto GPS final). */
function extractFromBuenosAires(coords) {
  const endNearBa = dist(coords[coords.length - 1], BA) < 0.01;
  if (!endNearBa) return coords;

  const startIdx = 8897;
  const endIdx = coords.length - 2;
  const segment = coords.slice(startIdx, endIdx + 1);

  if (segment.length < 2) return [BA, ...coords];

  return [BA, ...segment];
}

const srcPath = CANDIDATES.map((f) => path.join(ROOT, f)).find((p) => fs.existsSync(p));
if (!srcPath) {
  console.error("No se encontró maps7, maps6.geojson ni maps6..geojson");
  process.exit(1);
}

const geojson = JSON.parse(fs.readFileSync(srcPath, "utf8"));
let coords = geojson.features[0].geometry.coordinates;
const srcName = path.basename(srcPath);

if (srcName.startsWith("maps7") || srcName === "maps4.geojson") {
  coords = extractFromBuenosAires(coords);
  console.log(`${srcName}: tramo desde Buenos Aires (${coords.length} pts)`);
} else {
  const { distance } = nearestIndex(coords, BA);
  if (distance > 0.005) coords = [BA, ...coords];
}

const simplified = simplifyLineString(coords, MAX_POINTS);
geojson.features[0].geometry.coordinates = simplified;
geojson.features[0].properties = {
  ...geojson.features[0].properties,
  name: "Lupuna — desde Buenos Aires",
};

const out = path.join(__dirname, "../public/routeLupuna.geojson");
fs.writeFileSync(out, JSON.stringify(geojson));

const pct = Math.round((simplified.length / coords.length) * 100);
console.log(`→ routeLupuna.geojson: ${coords.length} → ${simplified.length} pts (${pct}%)`);
console.log(`  inicio ${JSON.stringify(simplified[0])}`);
console.log(`  fin     ${JSON.stringify(simplified[simplified.length - 1])}`);
