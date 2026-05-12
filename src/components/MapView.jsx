import { useEffect, useRef } from "react";
import L from "leaflet";
import { stopTypes } from "../data/waypoints";

// Fix default icon paths for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function makeIcon(type) {
  const t = stopTypes[type] || stopTypes.stop;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${t.color}" stroke="white" stroke-width="3"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" fill="white">
        ${type === "start" ? "▶" : type === "end" ? "★" : type === "sleep" ? "🌙" : "◉"}
      </text>
      <polygon points="14,32 22,32 18,42" fill="${t.color}"/>
    </svg>`;

  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  });
}

export default function MapView({ geojson, geojson2, geojson3, geojson4, geojson5, waypoints, selectedStop, onSelectStop, lang, t }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);
  const routeLayer2Ref = useRef(null);
  const routeLayer3Ref = useRef(null);
  const routeLayer4Ref = useRef(null);
  const routeLayer5Ref = useRef(null);

  // Init map
  useEffect(() => {
    if (mapInstanceRef.current) return;
    const map = L.map(mapRef.current, { zoomControl: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapInstanceRef.current = map;
  }, []);

  // Render rutas — espera a que todas estén listas para hacer fitBounds correcto
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geojson) {
      if (routeLayerRef.current) routeLayerRef.current.remove();
      const outline1 = L.geoJSON(geojson, { style: { color: "#fff", weight: 9, opacity: 0.8 } }).addTo(map);
      const line1    = L.geoJSON(geojson, { style: { color: "#e85d04", weight: 5, opacity: 1 } }).addTo(map);
      routeLayerRef.current = L.layerGroup([outline1, line1]);
      routeLayerRef.current._bounds = line1.getBounds();
    }

    if (geojson2) {
      if (routeLayer2Ref.current) routeLayer2Ref.current.remove();
      const outline2 = L.geoJSON(geojson2, { style: { color: "#fff", weight: 9, opacity: 0.8 } }).addTo(map);
      const line2    = L.geoJSON(geojson2, { style: { color: "#0077cc", weight: 5, opacity: 1 } }).addTo(map);
      routeLayer2Ref.current = L.layerGroup([outline2, line2]);
      routeLayer2Ref.current._bounds = line2.getBounds();
    }

    if (geojson3) {
      if (routeLayer3Ref.current) routeLayer3Ref.current.remove();
      // Tramo estimado: punteado azul
      const line3 = L.geoJSON(geojson3, {
        style: { color: "#0077cc", weight: 4, opacity: 0.85, dashArray: "10 8" },
      }).addTo(map);
      routeLayer3Ref.current = line3;
      routeLayer3Ref.current._bounds = line3.getBounds();
    }

    if (geojson4) {
      if (routeLayer4Ref.current) routeLayer4Ref.current.remove();
      const outline4 = L.geoJSON(geojson4, { style: { color: "#fff", weight: 9, opacity: 0.8 } }).addTo(map);
      const line4    = L.geoJSON(geojson4, { style: { color: "#0077cc", weight: 5, opacity: 1 } }).addTo(map);
      routeLayer4Ref.current = L.layerGroup([outline4, line4]);
      routeLayer4Ref.current._bounds = line4.getBounds();
    }

    if (geojson5) {
      if (routeLayer5Ref.current) routeLayer5Ref.current.remove();
      const outline5 = L.geoJSON(geojson5, { style: { color: "#fff", weight: 9, opacity: 0.8 } }).addTo(map);
      const line5    = L.geoJSON(geojson5, { style: { color: "#0077cc", weight: 5, opacity: 1 } }).addTo(map);
      routeLayer5Ref.current = L.layerGroup([outline5, line5]);
      routeLayer5Ref.current._bounds = line5.getBounds();
    }

    // fitBounds incluyendo todas las rutas
    const bounds = [
      routeLayerRef.current?._bounds,
      routeLayer2Ref.current?._bounds,
      routeLayer3Ref.current?._bounds,
      routeLayer4Ref.current?._bounds,
      routeLayer5Ref.current?._bounds,
    ].filter(Boolean);
    if (bounds.length > 0) {
      const combined = bounds.reduce((acc, b) => acc.extend(b));
      map.fitBounds(combined, { padding: [40, 40] });
    }
  }, [geojson, geojson2, geojson3, geojson4, geojson5]);

  // Render waypoint markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    waypoints.forEach((wp) => {
      const [lng, lat] = wp.coords;
      const marker = L.marker([lat, lng], { icon: makeIcon(wp.type) });

      const wpT = t?.waypoints?.[wp.id];
      const displayName = wpT?.name || wp.name;
      const displayDesc = wpT?.description || wp.description;

      const photoHtml = wp.image
        ? `<img src="${wp.image}" style="width:100%;max-height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px"
             onerror="this.style.display='none'" />`
        : "";

      marker.bindPopup(
        `<div style="min-width:180px;max-width:220px">
          ${photoHtml}
          <b style="font-size:0.95rem">${displayName}</b><br/>
          <span style="font-size:0.8rem;color:#666">${displayDesc}</span>
        </div>`,
        { maxWidth: 240 }
      );

      marker.on("click", () => onSelectStop(wp));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [waypoints, onSelectStop, lang, t]);

  // Fly to selected stop
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStop) return;
    const [lng, lat] = selectedStop.coords;
    map.flyTo([lat, lng], 14, { duration: 1.2 });
    const marker = markersRef.current.find((_, i) => waypoints[i]?.id === selectedStop.id);
    if (marker) marker.openPopup();
  }, [selectedStop, waypoints]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", minHeight: "300px", zIndex: 0 }}
    />
  );
}
