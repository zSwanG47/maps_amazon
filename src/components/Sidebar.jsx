import StopCard from "./StopCard";
import { routeTotalKm } from "../utils/geo";

export default function Sidebar({ waypoints, selectedStop, onSelectStop, geojson, geojson2, t }) {
  const km1 = routeTotalKm(geojson);
  const km2 = routeTotalKm(geojson2);

  return (
    <div className="d-flex flex-column h-100" style={{ overflow: "hidden" }}>
      {/* Header del tour */}
      <div className="p-3 text-white" style={{ background: "linear-gradient(135deg, #1a6b3a, #2da366)" }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="bi bi-map-fill fs-5"></i>
          <h5 className="mb-0 fw-bold">{t.routeTitle}</h5>
        </div>
        <p className="mb-2 opacity-75" style={{ fontSize: "0.82rem" }}>
          Amazon Experience
        </p>
        {/* Stats generales */}
        <div className="row g-2">
          <div className="col-6">
            <div className="bg-white bg-opacity-10 rounded p-2 text-center">
              <div className="fw-bold fs-6">{km1 > 0 ? km1.toFixed(0) : "—"} km</div>
              <div style={{ fontSize: "0.72rem" }} className="opacity-75">
                <i className="bi bi-car-front-fill me-1"></i>{t.highway}
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="bg-white bg-opacity-10 rounded p-2 text-center">
              <div className="fw-bold fs-6">{km2 > 0 ? km2.toFixed(0) : "—"} km</div>
              <div style={{ fontSize: "0.72rem" }} className="opacity-75">
                <i className="bi bi-water me-1"></i>{t.river}
              </div>
            </div>
          </div>
        </div>

        {/* Leyenda rutas */}
        <div className="d-flex gap-3 mt-2 flex-wrap" style={{ fontSize: "0.72rem" }}>
          <span className="d-flex align-items-center gap-1">
            <span style={{ display: "inline-block", width: 20, height: 3, background: "#e85d04", borderRadius: 2 }}></span>
            {t.bycar}
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{ display: "inline-block", width: 20, height: 3, background: "#0077cc", borderRadius: 2 }}></span>
            {t.byboat}
          </span>
          <span className="d-flex align-items-center gap-1">
            <span style={{ display: "inline-block", width: 20, height: 3, background: "#0077cc", borderRadius: 2, opacity: 0.6, borderTop: "3px dashed #0077cc" }}></span>
            {t.estimated}
          </span>
        </div>
      </div>

      {/* Lista de paradas */}
      <div className="flex-grow-1 overflow-auto p-3">
        <h6 className="text-uppercase text-muted fw-bold mb-3" style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}>
          <i className="bi bi-list-ol me-1"></i> {t.itinerary}
        </h6>

        {/* Línea de tiempo */}
        <div className="timeline-container position-relative">
          {waypoints.map((wp, i) => (
            <div key={wp.id} className="position-relative">
              {/* Línea vertical entre paradas */}
              {i < waypoints.length - 1 && (
                <div
                  className="position-absolute"
                  style={{
                    left: "11px",
                    top: "44px",
                    width: "2px",
                    height: "24px",
                    background: "#dee2e6",
                    zIndex: 0,
                  }}
                />
              )}
              {/* Dot del tipo */}
              <div
                className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  left: "4px",
                  top: "16px",
                  width: "18px",
                  height: "18px",
                  zIndex: 1,
                  background:
                    wp.type === "start" ? "#28a745"
                    : wp.type === "sleep" ? "#6f42c1"
                    : wp.type === "end" ? "#dc3545"
                    : wp.type === "pass" ? "#6c757d"
                    : "#fd7e14",
                }}
              />

              {/* Card con margen izquierdo */}
              <div style={{ marginLeft: "30px" }}>
                <StopCard
                  waypoint={wp}
                  index={i}
                  isSelected={selectedStop?.id === wp.id}
                  onClick={onSelectStop}
                  prevCoords={i > 0 ? waypoints[i - 1].coords : null}
                  t={t}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Distancia total por las rutas grabadas */}
        {(km1 > 0 || km2 > 0) && (
          <div className="alert alert-light border mt-2 p-2" style={{ fontSize: "0.8rem" }}>
            <i className="bi bi-info-circle me-1 text-primary"></i>
            {t.total}:{" "}
            <strong>{(km1 + km2).toFixed(0)} km</strong>
            {"  ·  "}
            <i className="bi bi-car-front-fill me-1 text-warning"></i>
            <strong>{km1.toFixed(0)} km</strong>
            {"  +  "}
            <i className="bi bi-water me-1 text-primary"></i>
            <strong>{km2.toFixed(0)} km</strong>
          </div>
        )}
      </div>

    </div>
  );
}
