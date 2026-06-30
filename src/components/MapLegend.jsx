export default function MapLegend({ t }) {
  return (
    <div className="map-legend-mobile" aria-hidden="false">
      <span>
        <span className="legend-line" style={{ background: "#e85d04" }} />
        {t.bycar}
      </span>
      <span>
        <span className="legend-line" style={{ background: "#0077cc" }} />
        {t.byboat}
      </span>
    </div>
  );
}
