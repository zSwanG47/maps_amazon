const commonEs = {
  appName: "Amazon Experience",
  live: "En vivo",
  highway: "Carretera",
  river: "Río",
  bycar: "En auto",
  byboat: "En bote",
  estimated: "Estimado",
  itinerary: "Itinerario",
  stops: "paradas",
  total: "Total",
  hide: "Ocultar",
  show: "Itinerario",
  stopNumber: "Parada",
  types: {
    start: "Inicio",
    stop: "Parada",
    pass: "Referencia",
    sleep: "Pernocte",
    end: "Destino",
  },
};

const commonEn = {
  appName: "Amazon Experience",
  live: "Live",
  highway: "Highway",
  river: "River",
  bycar: "By car",
  byboat: "By boat",
  estimated: "Estimated",
  itinerary: "Itinerary",
  stops: "stops",
  total: "Total",
  hide: "Hide",
  show: "Itinerary",
  stopNumber: "Stop",
  types: {
    start: "Start",
    stop: "Stop",
    pass: "Reference",
    sleep: "Overnight",
    end: "Destination",
  },
};

const eldoradoWaypointsEs = {
  1: { name: "Iquitos — Partida", description: "Salida desde Iquitos en auto por la Carretera Iquitos-Nauta (~100 km). Punto de encuentro con el grupo." },
  2: { name: "Puerto de Nauta", description: "Llegada al Puerto de Nauta. Aquí se embarca en el bote para continuar por el río Marañon." },
  3: { name: "Control — Reserva Nacional Pacaya Samiria", description: "Control de ingreso a la Reserva Nacional Pacaya Samiria, una de las reservas más grandes de Sudamérica." },
  4: { name: "Yanayacu", description: "Punto de referencia en el río camino a la comunidad." },
  5: { name: "Comunidad Buenos Aires", description: "Comunidad nativa en plena Amazonia peruana. Inicio del siguiente tramo." },
  6: { name: "El Renacal", description: "Punto de referencia." },
  7: { name: "Yarina", description: "Comunidad donde se acampará una noche." },
  9: { name: "Soledad", description: "Acá se pasará una noche." },
  10: { name: "El Pungal", description: "Cerca al Dorado." },
  11: { name: "PV ACHONG", description: "Punto de paso en el río dentro de la Reserva Nacional Pacaya Samiria." },
  12: { name: "Pato Cocha", description: "Punto de referencia." },
  13: { name: "Reserva Nacional El Dorado", description: "Destino final del recorrido. Corazón de la Amazonía peruana." },
};

const eldoradoWaypointsEn = {
  1: { name: "Iquitos — Departure", description: "Departure from Iquitos by car along the Iquitos-Nauta Highway (~100 km). Group meeting point." },
  2: { name: "Nauta Port", description: "Arrival at Nauta Port. Board the boat to continue along the Marañon River." },
  3: { name: "Checkpoint — Pacaya Samiria National Reserve", description: "Entry checkpoint to Pacaya Samiria National Reserve, one of the largest reserves in South America." },
  4: { name: "Yanayacu", description: "River reference point on the way to the community." },
  5: { name: "Buenos Aires Community", description: "Native community in the heart of the Peruvian Amazon. Start of the next leg." },
  6: { name: "El Renacal", description: "Reference point." },
  7: { name: "Yarina", description: "Community where one night will be spent camping." },
  9: { name: "Soledad", description: "One night will be spent here." },
  10: { name: "El Pungal", description: "Near El Dorado." },
  11: { name: "PV ACHONG", description: "River stop inside Pacaya Samiria National Reserve." },
  12: { name: "Pato Cocha", description: "Reference point." },
  13: { name: "El Dorado National Reserve", description: "Final destination of the journey. Heart of the Peruvian Amazon." },
};

const lupunaWaypointsEs = {
  1: eldoradoWaypointsEs[1],
  2: eldoradoWaypointsEs[2],
  3: eldoradoWaypointsEs[3],
  4: eldoradoWaypointsEs[4],
  5: {
    name: "Comunidad Buenos Aires",
    description: "Comunidad nativa en plena Amazonia peruana. Punto de partida hacia Lupuna.",
  },
};

const lupunaWaypointsEn = {
  1: eldoradoWaypointsEn[1],
  2: eldoradoWaypointsEn[2],
  3: eldoradoWaypointsEn[3],
  4: eldoradoWaypointsEn[4],
  5: {
    name: "Buenos Aires Community",
    description: "Native community in the heart of the Peruvian Amazon. Departure point toward Lupuna.",
  },
};

export const translations = {
  es: {
    eldorado: {
      ...commonEs,
      routeTitle: "Rutas Reserva Nacional Pacaya Samiria",
      subtitle: "Tour El Dorado",
      waypoints: eldoradoWaypointsEs,
    },
    lupuna: {
      ...commonEs,
      routeTitle: "Ruta Comunidad Lupuna",
      subtitle: "Tour Lupuna",
      waypoints: lupunaWaypointsEs,
    },
  },
  en: {
    eldorado: {
      ...commonEn,
      routeTitle: "Pacaya Samiria National Reserve Routes",
      subtitle: "El Dorado Tour",
      waypoints: eldoradoWaypointsEn,
    },
    lupuna: {
      ...commonEn,
      routeTitle: "Lupuna Community Route",
      subtitle: "Lupuna Tour",
      waypoints: lupunaWaypointsEn,
    },
  },
};
