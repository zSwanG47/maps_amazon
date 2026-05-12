import { useState, useEffect } from "react";
import "./App.css";

import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { waypoints } from "./data/waypoints";
import { translations } from "./data/i18n";

export default function App() {
  const [geojson, setGeojson] = useState(null);
  const [geojson2, setGeojson2] = useState(null);
  const [geojson3, setGeojson3] = useState(null);
  const [geojson4, setGeojson4] = useState(null);
  const [geojson5, setGeojson5] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState("es");
  const t = translations[lang];

  // Cargar todas las rutas GeoJSON desde /public
  useEffect(() => {
    fetch("/route.geojson").then((r) => r.json()).then(setGeojson).catch(console.error);
    fetch("/route2.geojson").then((r) => r.json()).then(setGeojson2).catch(console.error);
    fetch("/route3.geojson").then((r) => r.json()).then(setGeojson3).catch(console.error);
    fetch("/route4.geojson").then((r) => r.json()).then(setGeojson4).catch(console.error);
    fetch("/route5.geojson").then((r) => r.json()).then(setGeojson5).catch(console.error);
  }, []);

  return (
    <div className="app-root d-flex flex-column" style={{ height: "100vh", overflow: "hidden" }}>
      {/* NAVBAR */}
      <nav className="navbar navbar-dark px-3 py-2 flex-shrink-0" style={{ background: "#1a6b3a" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-tree-fill fs-5 text-success"></i>
          <span className="navbar-brand mb-0 fw-bold fs-6">Amazon Experience</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-success bg-opacity-75">
            <i className="bi bi-dot me-0 fs-6 align-middle"></i> {t.live}
          </span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="form-select form-select-sm"
            style={{ width: "auto", background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.4)", fontSize: "0.8rem" }}
          >
            <option value="es" style={{ color: "#000" }}>🇵🇪 ES</option>
            <option value="en" style={{ color: "#000" }}>🇺🇸 EN</option>
          </select>
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <i className={`bi ${sidebarOpen ? "bi-layout-sidebar" : "bi-layout-sidebar-reverse"}`}></i>
          </button>
        </div>
      </nav>

      {/* BODY: sidebar + mapa */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          style={{
            width: sidebarOpen ? "340px" : "0px",
            minWidth: sidebarOpen ? "280px" : "0px",
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
            transition: "width 0.3s ease, min-width 0.3s ease",
            borderRight: sidebarOpen ? "1px solid #dee2e6" : "none",
            background: "#fff",
          }}
        >
          <Sidebar
            waypoints={waypoints}
            selectedStop={selectedStop}
            onSelectStop={setSelectedStop}
            geojson={geojson}
            geojson2={geojson2}
            lang={lang}
            t={t}
          />
        </div>

        {/* MAPA */}
        <div className="flex-grow-1 position-relative">
          <MapView
            geojson={geojson}
            geojson2={geojson2}
            geojson3={geojson3}
            geojson4={geojson4}
            geojson5={geojson5}
            waypoints={waypoints}
            selectedStop={selectedStop}
            onSelectStop={setSelectedStop}
            lang={lang}
            t={t}
          />

          {/* Botón colapsar sidebar */}
          <button
            className="btn btn-sm btn-light border shadow-sm position-absolute d-flex align-items-center gap-1"
            style={{ top: "12px", left: "12px", zIndex: 999 }}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <i className={`bi ${sidebarOpen ? "bi-chevron-double-left" : "bi-chevron-double-right"}`}></i>
            {sidebarOpen ? t.hide : t.show}
          </button>
        </div>
      </div>
    </div>
  );
}

