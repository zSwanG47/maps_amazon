import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import { stopTypes } from "../data/waypoints";
import { ROUTE_LAYERS } from "../data/routesData";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ROUTE_STYLES = {
  car: {
    outline: { color: "#fff", weight: 8, opacity: 0.85 },
    line: { color: "#e85d04", weight: 4.5, opacity: 1 },
  },
  boat: {
    outline: { color: "#fff", weight: 8, opacity: 0.85 },
    line: { color: "#0077cc", weight: 4.5, opacity: 1 },
  },
};

const ICON_CACHE = {};

function makeIcon(type) {
  if (ICON_CACHE[type]) return ICON_CACHE[type];
  const t = stopTypes[type] || stopTypes.stop;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${t.color}" stroke="white" stroke-width="3"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" fill="white">
        ${type === "start" ? "▶" : type === "end" ? "★" : type === "sleep" ? "🌙" : "◉"}
      </text>
      <polygon points="14,32 22,32 18,42" fill="${t.color}"/>
    </svg>`;
  ICON_CACHE[type] = L.divIcon({
    className: "",
    html: svg,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -44],
  });
  return ICON_CACHE[type];
}

function buildPopup(wp, t) {
  const wpT = t?.waypoints?.[wp.id];
  const displayName = wpT?.name || wp.name;
  const displayDesc = wpT?.description || wp.description;
  const photoHtml = wp.image
    ? `<img src="${wp.image}" style="width:100%;max-height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px"
         onerror="this.style.display='none'" loading="lazy" />`
    : "";
  return `<div style="min-width:180px;max-width:220px">
    ${photoHtml}
    <b style="font-size:0.95rem">${displayName}</b><br/>
    <span style="font-size:0.8rem;color:#666">${displayDesc}</span>
  </div>`;
}

function drawRoutes(parentLayer, renderer) {
  const boundsList = [];
  for (const route of ROUTE_LAYERS) {
    if (!route.latlngs.length) continue;
    const styles = ROUTE_STYLES[route.style];
    const layers = [];
    if (styles.outline) {
      layers.push(L.polyline(route.latlngs, { ...styles.outline, renderer, smoothFactor: 1.5, noClip: true }));
    }
    layers.push(L.polyline(route.latlngs, { ...styles.line, renderer, smoothFactor: 1.5, noClip: true }));
    L.layerGroup(layers).addTo(parentLayer);
    boundsList.push(L.latLngBounds(route.latlngs));
  }
  return boundsList;
}

export default function MapView({ waypoints, selectedStop, onSelectStop, lang, t }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const tRef = useRef(t);

  tRef.current = t;

  const getWaypointBounds = useCallback(() => {
    return L.latLngBounds(waypoints.map((wp) => [wp.coords[1], wp.coords[0]]));
  }, [waypoints]);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      preferCanvas: true,
      zoomAnimation: true,
      fadeAnimation: false,
      inertia: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
      maxNativeZoom: 18,
      updateWhenZooming: false,
      updateWhenIdle: true,
      keepBuffer: 1,
    }).addTo(map);

    const renderer = L.canvas({ padding: 0.5 });
    const routesLayer = L.layerGroup().addTo(map);
    const routeBounds = drawRoutes(routesLayer, renderer);

    const wpBounds = getWaypointBounds();
    const allBounds = routeBounds.length
      ? routeBounds.reduce((acc, b) => acc.extend(b), wpBounds)
      : wpBounds;
    map.fitBounds(allBounds, { padding: [40, 40], animate: false });

    mapInstanceRef.current = map;

    waypoints.forEach((wp) => {
      const [lng, lat] = wp.coords;
      const marker = L.marker([lat, lng], { icon: makeIcon(wp.type) });
      marker.bindPopup(() => buildPopup(wp, tRef.current), { maxWidth: 240 });
      marker.on("click", () => onSelectStop(wp));
      marker.addTo(map);
      markersRef.current.push({ marker, wp });
    });
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [getWaypointBounds, onSelectStop, waypoints]);

  useEffect(() => {
    markersRef.current.forEach(({ marker, wp }) => {
      marker.setPopupContent(buildPopup(wp, t));
    });
  }, [lang, t, waypoints]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStop) return;
    const [lng, lat] = selectedStop.coords;
    map.flyTo([lat, lng], 14, { duration: 1.2 });
    const entry = markersRef.current.find(({ wp }) => wp.id === selectedStop.id);
    if (entry) entry.marker.openPopup();
  }, [selectedStop]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", minHeight: "300px", zIndex: 0 }}
    />
  );
}
