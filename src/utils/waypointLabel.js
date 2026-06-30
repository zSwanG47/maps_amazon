/** Nombre corto para etiquetas en el mapa móvil. */
export function shortWaypointName(name) {
  if (!name) return "";
  const part = name.split(" — ")[0].split(" - ")[0].trim();
  return part.length > 14 ? `${part.slice(0, 12)}…` : part;
}
