/** 
 * Takes in a list of elements and divides them into 
 * 2 sub-lists where one list passes a condition and the
 * other doesn't.
 */
export const partition = <T>(elems: T[], condition: (elem: T) => boolean) => {
  const validElems: T[] = [];
  const invalidElems: T[] = [];
  for (const elem of elems) {
    const listToPushTo = condition(elem)
      ? validElems
      : invalidElems;
    listToPushTo.push(elem);
  }
  return [validElems, invalidElems];
}

export const TRAIN_LINE_TO_URL_MAP: Record<string, string> = {
  A: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  C: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  E: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  B: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  D: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  F: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  M: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  G: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
  J: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
  Z: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
  N: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  Q: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  R: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  W: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  L: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
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
