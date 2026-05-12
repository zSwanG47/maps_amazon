import { stopTypes } from "../data/waypoints";
import { haversineKm, estimateTime } from "../utils/geo";

export default function StopCard({ waypoint, index, isSelected, onClick, prevCoords, t }) {
  const type = stopTypes[waypoint.type] || stopTypes.stop;
  const dist = prevCoords ? haversineKm(prevCoords, waypoint.coords) : 0;
  const wpT = t?.waypoints?.[waypoint.id];
  const displayName = wpT?.name || waypoint.name;
  const displayDesc = wpT?.description || waypoint.description;
  const typeLabel = t?.types?.[waypoint.type] || type.label;

  return (
    <div
      className={`card mb-2 stop-card ${isSelected ? "border-primary shadow" : "border-0 shadow-sm"}`}
      style={{ cursor: "pointer", transition: "all 0.2s" }}
      onClick={() => onClick(waypoint)}
    >
      <div className="card-body p-3">
        {/* Header */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <span
            className={`badge rounded-pill px-2 py-1`}
            style={{ backgroundColor: type.color, fontSize: "0.7rem" }}
          >
            <i className={`bi ${type.icon} me-1`}></i>
            {typeLabel}
          </span>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            {t?.stopNumber || "Parada"} {index + 1}
          </span>
        </div>

        {/* Nombre */}
        <h6 className="card-title mb-1 fw-bold">{displayName}</h6>

        {/* Foto */}
        {waypoint.image && (
          <img
            src={waypoint.image}
            alt={waypoint.name}
            className="img-fluid rounded mb-2"
            style={{ maxHeight: "130px", width: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {/* Descripción */}
        <p className="card-text text-muted mb-2" style={{ fontSize: "0.82rem" }}>
          {displayDesc}
        </p>

        {/* Distancia y tiempo — solo si no está oculto */}
        {index > 0 && !waypoint.hideTime && (
          <div className="d-flex gap-3">
            <span className="text-secondary" style={{ fontSize: "0.78rem" }}>
              <i className="bi bi-arrows-collapse me-1 text-primary"></i>
              {dist.toFixed(1)} km
            </span>
            <span className="text-secondary" style={{ fontSize: "0.78rem" }}>
              <i className="bi bi-clock me-1 text-primary"></i>
              {estimateTime(dist)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
