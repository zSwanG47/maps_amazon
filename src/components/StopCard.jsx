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
      className={`card mb-2 stop-card ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(waypoint)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(waypoint)}
    >
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span
            className="badge rounded-pill stop-type-badge px-2 py-1"
            style={{ backgroundColor: type.color }}
          >
            <i className={`bi ${type.icon} me-1`}></i>
            {typeLabel}
          </span>
          <span className="text-muted" style={{ fontSize: "0.72rem", fontWeight: 600 }}>
            #{index + 1}
          </span>
        </div>

        <h6 className="card-title mb-1 fw-bold" style={{ fontSize: "0.88rem" }}>{displayName}</h6>

        {waypoint.image && (
          <img
            src={waypoint.image}
            alt={displayName}
            className="stop-card-img"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        <p className="card-text mb-0" style={{ fontSize: "0.8rem", color: "var(--ae-text-muted)", lineHeight: 1.45 }}>
          {displayDesc}
        </p>

        {index > 0 && !waypoint.hideTime && (
          <div className="stop-meta">
            <span>
              <i className="bi bi-arrows-angle-expand"></i>
              {dist.toFixed(1)} km
            </span>
            <span>
              <i className="bi bi-clock"></i>
              {estimateTime(dist)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
