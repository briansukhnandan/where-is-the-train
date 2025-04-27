export const TRAIN_LINE_TO_URL_MAP: Record<string, string> = {
  /** 8th Ave */
  A: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  C: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  E: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",

  /** 6th Ave */
  B: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  D: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  F: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  M: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",

  /** BK/QNZ Crosstown */
  G: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",

  /** BMT Broad St. / Jamaica Ave. */
  J: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
  Z: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",

  /** BMT Broadway */
  N: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  Q: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  R: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  W: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",

  /** Canarsie */
  L: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",

  /** IRT Land */
  1: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  2: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  3: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  4: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  5: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  6: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  7: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs"
}

export const TRAIN_LINE_TO_COLOR: Record<string, string> = {
  // Dark Blue
  A: "#081df7",
  C: "#081df7",
  E: "#081df7",
  
  // Orange
  B: "#f89407",
  D: "#f89407",
  F: "#f89407",
  M: "#f89407",

  // Light Green
  G: "#adff00",

  // Yellow
  N: "#eeff00",
  Q: "#eeff00",
  R: "#eeff00",
  W: "#eeff00",

  // Brown
  J: "#704901",
  Z: "#704901",

  // Light Grey
  L: "#b3b3b3",

  // Slightly Darker Grey 
  S: "#878787",

  // Red 
  1: "#ff0300",
  2: "#ff0300",
  3: "#ff0300",

  // Green 
  4: "#00ae13",
  5: "#00ae13",
  6: "#00ae13",

  // Deep Pink
  7: "#ff00df",
}

/** Slightly darker versions of the colors above */
export const TRAIN_LINE_TO_DIVIDER_COLOR: Record<string, string> = {
  A: "#05129d",
  C: "#05129d",
  E: "#05129d",

  B: "#a56305",
  D: "#a56305",
  F: "#a56305",
  M: "#a56305",

  G: "#73a900",

  N: "#96a100",
  Q: "#96a100",
  R: "#96a100",
  W: "#96a100",

  J: "#704901",
  Z: "#704901",

  L: "#b3b3b3",
  S: "#b3b3b3",

  1: "#9e0200",
  2: "#9e0200",
  3: "#9e0200",

  4: "#00680c",
  5: "#00680c",
  6: "#00680c",

  7: "#8d007b",
}

export const TRAIN_LINE_TO_TERMINATING_STOPS: Record<string, string[]> = {
  A: [
    "H11", // Far Rockaway
    "H11N",
    "H11S",
    "A02", // Inwood 207 St 
    "A02N",
    "A02S",
    "A65", // Ozone Park - Lefferts Blvd
    "A65N",
    "A65S",
  ],
  B: [
    "D03", // Bedford Park Blvd
    "D03N",
    "D03S",
    "D40", // Brighton Beach
    "D40N",
    "D40S",
  ],
  C: [
    "112", // 168 St.
    "112N",
    "112S",
    "A55", // Euclid Ave.
    "A55N",
    "A55S",
  ],
  D: [
    "D43", // Coney Island - Stillwell Ave.
    "D43N",
    "D43S",
    "D01", // Norwood 205th St.
    "D01N",
    "D01S",
  ],
  E: [
    "G05", // Jamaica Center
    "G05N",
    "G05S",
    "E01", // World Trade Center
    "E01N",
    "E01S",
  ],
  F: [
    "F01", // Jamaica 179th St 
    "F01N",
    "F01S",
    "D43",
    "D43N",
    "D43S",
  ],
  G: [
    "G22", // Court Sq
    "G22N",
    "G22S",
    "F27", // Church Av
    "F27N",
    "F27S",
  ],
  J: [
    "G05", // Jamaica Center
    "G05N",
    "G05S",
    "M23", // Broad St 
    "M23N",
    "M23S",
  ],
  L: [
    "L29", // Canarsie Rockaway Pkwy
    "L29N",
    "L29S",
    "A31", // 14th St 
    "A31N",
    "A31S",
  ],
  M: [
    "M01", // Middle Village, Metropolitan Ave
    "M01N",
    "M01S",
    "G08", // Forest Hills 71st Ave
    "G08N",
    "G08S",
  ],
  N: [
    "R01", // Astoria - Ditmars Blvd
    "R01N",
    "R01S",
    "N12", // Coney Island - Stillwell Ave
    "N12N",
    "N12S",
  ],
  Q: [
    "Q05", // 96th St 
    "Q05N",
    "Q05S",
    "N12", // Coney Island - Stillwell Ave
    "N12N",
    "N12S",
  ],
  R: [
    "R45", // Bay Ridge - 95th St
    "R45N",
    "R45S",
    "G08", // Forest Hills 71st Ave
    "G08N",
    "G08S",
  ],
  S: [],
  W: [
    "R27", // Whitehall St - South Ferry
    "R27N",
    "R27S",
    "R01", // Astoria - Ditmars Blvd
    "R01N",
    "R01S",
  ],
  Z: [
    "G05", // Jamaica Center
    "G05N",
    "G05S",
    "M23", // Broad St 
    "M23N",
    "M23S",
  ],
  1: [
    "142", // South Ferry
    "142N",
    "142S",
    "101", // Van Cortlandt - 242 St
    "101N",
    "101S",
  ],
  2: [
    "201", // Wakefield 241 St
    "201N",
    "201S",
    "247", // Flatbush Ave - Brooklyn College
    "247N",
    "247S",
  ],
  3: [
    "301", // Harlem 148th St
    "301N",
    "301S",
    "257", // New Lots Ave
    "257N",
    "257S",
  ],
  4: [
    "250", // Crown Heights - Utica Ave
    "250N",
    "250S",
    "401",
    "401N",
    "401S",
  ],
  5: [
    "501", // Eastchester - Dyre Ave
    "501N",
    "501S",
    "247", // Flatbush Ave - Brooklyn College
    "247N",
    "247S",
  ],
  6: [
    "601", // Pelham Bay Park
    "601N",
    "601S",
    "640", // Brooklyn Bridge - City Hall
    "640N",
    "640S",
  ],
  7: [
    "701", // Flushing Main St.
    "701N",
    "701S",
    "726", // 34 St. Hudson Yards
    "726N",
    "726S",
  ],
}


// Strips out N/S from the stop code
export const getGeneralStopId = (fullStopId: string) => {
  return fullStopId.slice(0, 3);
}
