// ============================================================
//  WAYPOINTS DE TU RUTA TURÍSTICA
//  Agrega, edita o elimina paradas según tu recorrido.
//  Coordenadas: [longitud, latitud]  (igual que GeoJSON)
//  Para cada parada puedes poner:
//    - image: ruta a la foto en /public/images/
//    - type: "start" | "stop" | "sleep" | "end"
//    - duration: tiempo estimado en minutos desde el inicio
// ============================================================

export const waypoints = [
  {
    id: 1,
    name: "Iquitos — Partida",
    description: "Salida desde Iquitos, Oficina Amazon Experience en auto por la Carretera Iquitos-Nauta (~100 km).",
    coords: [-73.245396, -3.746319],   // [lng, lat] — Iquitos
    type: "start",
    image: "/images/iquitos.jpg",
    transport: "car",
  },
  {
    id: 2,
    name: "Puerto de Nauta",
    description: "Llegada al Puerto de Nauta. Aquí se embarca en el bote para continuar por el río Marañon.",
    coords: [-73.57444, -4.507987],    // [lng, lat] — Puerto de Nauta
    type: "stop",
    image: "/images/nauta.jpg",
    transport: "car",
  },
  {
    id: 3,
    name: "Control — Reserva Nacional Pacaya Samiria",
    description: "Control de ingreso a la Reserva Nacional Pacaya Samiria, una de las reservas más grandes de Sudamérica.",
    coords: [-73.795047, -4.654906],   // [lng, lat]
    type: "stop",
    image: "/images/pacaya.jpeg",
    transport: "boat",
    hideTime: true,
  },
  {
    id: 4,
    name: "Yanayacu",
    description: "Punto de referencia en el río camino a la comunidad.",
    coords: [-73.837956, -4.651282],   // [lng, lat]
    type: "pass",
    image: "/images/yanayacu.jpeg",
    transport: "boat",
    hideTime: true,
  },
  {
    id: 5,
    name: "Comunidad Buenos Aires",
    description: "Comunidad nativa en plena Amazonia peruana. Inicio del siguiente tramo.",
    coords: [-73.836651, -4.659976],   // [lng, lat]
    type: "stop",
    image: "/images/buenos-aires.jpg",
    transport: "boat",
    hideTime: true,
  },
  {
    id: 6,
    name: "El Renacal",
    description: "Punto de referencia",
    coords: [-73.973981, -4.6726],     // [lng, lat]
    type: "stop",
    image: null,
    transport: "boat",
    hideTime: true,
  },
  {
    id: 7,
    name: "Yarina",
    description: "Comunidad donde se acampara una noche.",
    coords: [-73.984258, -4.738445],   // [lng, lat]
    type: "sleep",
    image: null,
    transport: "boat",
    hideTime: true,
  },
  {
    id: 9,
    name: "Soledad",
    description: "Aca se pasara una noche.",
    coords: [-74.185931, -4.774994],   // [lng, lat]
    type: "sleep",
    image: null,
    transport: "boat",
    hideTime: true,
  },
  {
    id: 10,
    name: "El Pungal",
    description: "Cerca al Dorado.",
    coords: [-74.2049788, -5.011456],  // [lng, lat]
    type: "stop",
    image: null,
    transport: "boat",
    hideTime: true,
  },
  {
    id: 11,
    name: "PV ACHONG",
    description: "Punto de paso en el río dentro de la Reserva Nacional Pacaya Samiria.",
    coords: [-74.238894, -5.068594],   // [lng, lat]
    type: "stop",
    image: "/images/pv-achong.jpg",
    transport: "boat",
    hideTime: true,
  },
  {
    id: 12,
    name: "Pato Cocha",
    description: "Punto de referencia",
    coords: [-74.246573, -5.065832],   // [lng, lat]
    type: "stop",
    image: null,
    transport: "boat",
    hideTime: true,
  },
  {
    id: 13,
    name: "Reserva Nacional El Dorado",
    description: "Destino final del recorrido. Corazón de la Amazonía peruana.",
    coords: [-74.319261, -5.072565],   // [lng, lat]
    type: "end",
    image: "/images/el_dorado.jpeg",
    transport: "boat",
    hideTime: true,
  },
];

// Tipos de parada con sus colores e iconos (bootstrap-icons)
export const stopTypes = {
  start:  { label: "Inicio",    color: "#28a745", icon: "bi-flag-fill",       bg: "success" },
  stop:   { label: "Parada",    color: "#fd7e14", icon: "bi-geo-alt-fill",    bg: "warning" },
  pass:   { label: "Referencia",color: "#6c757d", icon: "bi-circle",          bg: "secondary"},
  sleep:  { label: "Pernocte",  color: "#6f42c1", icon: "bi-moon-stars-fill", bg: "purple"  },
  end:    { label: "Destino",   color: "#dc3545", icon: "bi-trophy-fill",     bg: "danger"  },
};
