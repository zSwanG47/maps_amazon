import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import { stopTypes } from "../data/waypoints";
import { loadRouteLayers } from "../utils/loadRoutes";

const ROUTE_STYLES = {
  car: { color: "#e85d04", weight: 4.5 },
  boat: { color: "#0077cc", weight: 4.5 },
};

const MOBILE_ROUTE_STYLES = {
  car: { color: "#e85d04", weight: 3 },
  boat: { color: "#0077cc", weight: 3 },
};

function isMobileView() {
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

function buildPopup(wp, t) {
  const wpT = t?.waypoints?.[wp.id];
  const displayName = wpT?.name || wp.name;
  const displayDesc = wpT?.description || wp.description;
  const photoHtml = wp.image
    ? `<img src="${wp.image}" style="width:100%;max-height:110px;object-fit:cover;border-radius:6px;margin-bottom:6px"
         onerror="this.style.display='none'" loading="lazy" decoding="async" />`
    : "";
  return `<div style="min-width:180px;max-width:220px">
    ${photoHtml}
    <b style="font-size:0.95rem">${displayName}</b><br/>
    <span style="font-size:0.8rem;color:#666">${displayDesc}</span>
  </div>`;
}

function addMarker(map, wp, mobile, onSelectStop, tRef, markersRef) {
  const [lng, lat] = wp.coords;
  const type = stopTypes[wp.type] || stopTypes.stop;

  let marker;
  if (mobile) {
    marker = L.circleMarker([lat, lng], {
      radius: 9,
      fillColor: type.color,
      color: "#fff",
      weight: 2,
      fillOpacity: 1,
    });
  } else {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <circle cx="18" cy="18" r="16" fill="${type.color}" stroke="white" stroke-width="3"/>
      <text x="18" y="23" text-anchor="middle" font-size="16" fill="white">◉</text>
      <polygon points="14,32 22,32 18,42" fill="${type.color}"/></svg>`;
    marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: "",
        html: svg,
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -44],
      }),
    });
  }

  marker.bindPopup(() => buildPopup(wp, tRef.current), { maxWidth: 240 });
  marker.on("click", () => onSelectStop(wp));
  marker.addTo(map);
  markersRef.current.push({ marker, wp });
}

function drawRoutes(map, routes, mobile) {
  const palette = mobile ? MOBILE_ROUTE_STYLES : ROUTE_STYLES;
  const smoothFactor = mobile ? 3 : 1.5;
  const renderer = mobile ? undefined : L.canvas({ padding: 0.5 });
  const opts = { smoothFactor, noClip: true, ...(renderer ? { renderer } : {}) };

  for (const route of routes) {
    if (!route.latlngs.length) continue;
    const style = palette[route.style];
    L.polyline(route.latlngs, { ...style, ...opts }).addTo(map);
  }
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

    const mobile = isMobileView();

    const map = L.map(mapRef.current, {
      zoomControl: !mobile,
      preferCanvas: !mobile,
      zoomAnimation: false,
      fadeAnimation: false,
      inertia: false,
    });

    if (mobile) {
      L.control.zoom({ position: "topleft" }).addTo(map);
    }

    const tiles = L.tileLayer(
      mobile
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: mobile ? 16 : 19,
        maxNativeZoom: mobile ? 15 : 18,
        updateWhenZooming: false,
        updateWhenIdle: true,
        keepBuffer: 0,
        detectRetina: false,
      },
    ).addTo(map);

    map.fitBounds(getWaypointBounds(), {
      padding: mobile ? [16, 16] : [40, 40],
      animate: false,
      maxZoom: mobile ? 8 : 12,
    });

    mapInstanceRef.current = map;

    map.whenReady(() => {
      waypoints.forEach((wp) => addMarker(map, wp, mobile, onSelectStop, tRef, markersRef));
      const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 50));
      schedule(() => {
        loadRouteLayers({ mobile }).then((routes) => {
          if (mapInstanceRef.current !== map) return;
          drawRoutes(map, routes, mobile);
        });
      });
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
    const mobile = isMobileView();
    map.flyTo([lat, lng], mobile ? 12 : 14, { duration: mobile ? 0.6 : 1.2 });
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
