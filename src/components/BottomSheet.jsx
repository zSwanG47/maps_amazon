import { stopTypes } from "../data/waypoints";
import { haversineKm, estimateTime } from "../utils/geo";

export default function BottomSheet({ waypoint, waypoints, onClose, t }) {
  if (!waypoint) return null;

  const index = waypoints.findIndex((wp) => wp.id === waypoint.id);
  const prevCoords = index > 0 ? waypoints[index - 1].coords : null;
  const type = stopTypes[waypoint.type] || stopTypes.stop;
  const wpT = t?.waypoints?.[waypoint.id];
  const displayName = wpT?.name || waypoint.name;
  const displayDesc = wpT?.description || waypoint.description;
  const typeLabel = t?.types?.[waypoint.type] || type.label;
  const dist = prevCoords ? haversineKm(prevCoords, waypoint.coords) : 0;

  return (
    <>
      <button
        type="button"
        className="bottom-sheet-backdrop"
        aria-label={t.hide}
        onClick={onClose}
      />
      <div className="bottom-sheet" role="dialog" aria-modal="true">
        <div className="bottom-sheet-handle" />
        <button type="button" className="bottom-sheet-close" onClick={onClose} aria-label={t.hide}>
          <i className="bi bi-x-lg" />
        </button>

        <div className="bottom-sheet-body">
          <div className="bottom-sheet-meta">
            <span className="bottom-sheet-number">#{index + 1}</span>
            <span
              className="badge rounded-pill stop-type-badge px-2 py-1"
              style={{ backgroundColor: type.color }}
            >
              <i className={`bi ${type.icon} me-1`} />
              {typeLabel}
            </span>
          </div>

          <h2 className="bottom-sheet-title">{displayName}</h2>

          {waypoint.image && (
            <img
              src={waypoint.image}
              alt={displayName}
              className="bottom-sheet-img"
              loading="lazy"
              decoding="async"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          )}

          <p className="bottom-sheet-desc">{displayDesc}</p>

          {index > 0 && !waypoint.hideTime && (
            <div className="bottom-sheet-stats">
              <span>
                <i className="bi bi-arrows-angle-expand" />
                {dist.toFixed(1)} km
              </span>
              <span>
                <i className="bi bi-clock" />
                {estimateTime(dist)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
