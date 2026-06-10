import { useEffect, useRef } from "react";
import StopCard from "./StopCard";
import { stopTypes } from "../data/waypoints";

const dotColor = (type) => (stopTypes[type] || stopTypes.stop).color;

export default function Sidebar({ waypoints, selectedStop, onSelectStop, routeStats, t }) {
  const km1 = routeStats?.highwayKm ?? 0;
  const km2 = routeStats?.riverKm ?? 0;
  const listRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!selectedStop) return;
    const el = cardRefs.current[selectedStop.id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedStop]);

  return (
    <div className="d-flex flex-column h-100" style={{ overflow: "hidden" }}>
      <div className="sidebar-header">
        <h2 className="sidebar-header-title">{t.routeTitle}</h2>
        <p className="sidebar-header-sub">Amazon Experience</p>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{km1 > 0 ? km1.toFixed(0) : "—"} km</div>
            <div className="stat-label">
              <i className="bi bi-car-front-fill me-1"></i>{t.highway}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{km2 > 0 ? km2.toFixed(0) : "—"} km</div>
            <div className="stat-label">
              <i className="bi bi-water me-1"></i>{t.river}
            </div>
          </div>
        </div>

        <div className="route-legend">
          <span className="d-flex align-items-center gap-1">
            <span className="legend-line" style={{ background: "#e85d04" }}></span>
            {t.bycar}
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="legend-line" style={{ background: "#0077cc" }}></span>
            {t.byboat}
          </span>
        </div>
      </div>

      <div className="itinerary-scroll" ref={listRef}>
        <div className="itinerary-heading">
          <i className="bi bi-signpost-split-fill"></i>
          {t.itinerary}
          <span className="ms-auto badge rounded-pill" style={{ background: "var(--ae-green-muted)", color: "var(--ae-green-dark)", fontSize: "0.65rem" }}>
            {waypoints.length} {t.stops}
          </span>
        </div>

        <div className="timeline-container">
          {waypoints.map((wp, i) => (
            <div
              key={wp.id}
              className="timeline-item"
              ref={(el) => { cardRefs.current[wp.id] = el; }}
            >
              {i < waypoints.length - 1 && <div className="timeline-line" />}
              <div className="timeline-dot" style={{ background: dotColor(wp.type) }} />

              <StopCard
                waypoint={wp}
                index={i}
                isSelected={selectedStop?.id === wp.id}
                onClick={onSelectStop}
                prevCoords={i > 0 ? waypoints[i - 1].coords : null}
                t={t}
              />
            </div>
          ))}
        </div>

        {(km1 > 0 || km2 > 0) && (
          <div className="total-summary">
            <i className="bi bi-signpost-2 me-1" style={{ color: "var(--ae-green)" }}></i>
            {t.total}: <strong>{(km1 + km2).toFixed(0)} km</strong>
            <span className="mx-1">·</span>
            <i className="bi bi-car-front-fill" style={{ color: "#e85d04" }}></i> <strong>{km1.toFixed(0)}</strong>
            <span className="mx-1">+</span>
            <i className="bi bi-water" style={{ color: "#0077cc" }}></i> <strong>{km2.toFixed(0)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
