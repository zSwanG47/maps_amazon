// Copia maps3..geojson completo → route3 (todas las coordenadas, sin simplificar)
// Uso: npm run restore-route3
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "../../maps3..geojson");
const OUT_PUB = path.join(__dirname, "../public/route3.geojson");
const OUT_BUNDLE = path.join(__dirname, "../src/data/routes/route3.json");

if (!fs.existsSync(SRC)) {
  console.error("No se encontró maps3..geojson");
  process.exit(1);
}

const geojson = JSON.parse(fs.readFileSync(SRC, "utf8"));
const coords = geojson.features[0].geometry.coordinates;
const json = JSON.stringify(geojson);

fs.writeFileSync(OUT_PUB, json);
fs.writeFileSync(OUT_BUNDLE, json);
console.log(`route3: ${coords.length} pts (completo, sin simplificar)`);
