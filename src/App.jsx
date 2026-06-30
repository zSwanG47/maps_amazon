import { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import BottomSheet from "./components/BottomSheet";
import MapLegend from "./components/MapLegend";
import { translations } from "./data/i18n";
import { getTour } from "./data/tours";
import { isMobileView } from "./utils/viewport";

const MapView = lazy(() => import("./components/MapView"));

export default function App({ tourId = "eldorado" }) {
  const tour = getTour(tourId);
  const { waypoints, routes, routeStats } = tour;
  const [mobile, setMobile] = useState(() => isMobileView());
  const [selectedStop, setSelectedStop] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => !isMobileView());
  const [lang, setLang] = useState("es");
  const t = translations[lang][tourId] ?? translations[lang].eldorado;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      const next = mq.matches;
      setMobile(next);
      if (next) setSidebarOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const handleSelectStop = (wp) => {
    setSelectedStop(wp);
    if (!mobile) setSidebarOpen(true);
  };

  return (
    <div className="app-root d-flex flex-column" style={{ height: "100vh", overflow: "hidden" }}>
      <nav className="app-navbar navbar navbar-dark px-3 py-2 flex-shrink-0">
        <div className="app-brand">
          <img src="/images/logo.jpg" alt="Amazon Experience" className="app-logo" width="38" height="38" decoding="async" loading="eager" />
          <div className="app-brand-text">
            <span className="app-brand-title">Amazon Experience</span>
            <span className="app-brand-sub">{t.subtitle}</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {!mobile && (
            <span className="live-badge">
              <span className="live-dot" />
              <span className="label-text">{t.live}</span>
            </span>
          )}

          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-btn ${lang === "es" ? "active" : ""}`}
              onClick={() => setLang("es")}
            >
              🇵🇪 ES
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              🇺🇸 EN
            </button>
          </div>

          {!mobile && (
            <button
              type="button"
              className="btn btn-sm btn-outline-light d-md-none border-0"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? t.hide : t.show}
            >
              <i className={`bi ${sidebarOpen ? "bi-x-lg" : "bi-list"}`}></i>
            </button>
          )}
        </div>
      </nav>

      <div className="d-flex flex-grow-1 overflow-hidden position-relative">
        {!mobile && (
          <div className={`sidebar-panel ${sidebarOpen ? "open" : "closed"}`}>
            <Sidebar
              waypoints={waypoints}
              selectedStop={selectedStop}
              onSelectStop={handleSelectStop}
              routeStats={routeStats}
              t={t}
            />
          </div>
        )}

        <div className="flex-grow-1 position-relative">
          <Suspense fallback={<div className="map-loading">Cargando mapa…</div>}>
            <MapView
              waypoints={waypoints}
              routes={routes}
              selectedStop={selectedStop}
              onSelectStop={handleSelectStop}
              lang={lang}
              t={t}
              mobile={mobile}
            />
          </Suspense>

          {mobile && !selectedStop && <MapLegend t={t} />}

          {mobile && selectedStop && (
            <BottomSheet
              waypoint={selectedStop}
              waypoints={waypoints}
              onClose={() => setSelectedStop(null)}
              t={t}
            />
          )}

          {!mobile && (
            <button
              type="button"
              className="sidebar-toggle-btn d-none d-md-inline-flex"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <i className={`bi ${sidebarOpen ? "bi-chevron-double-left" : "bi-chevron-double-right"}`}></i>
              {sidebarOpen ? t.hide : t.show}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
