import { transit_realtime as TransitRealtime } from "gtfs-realtime-bindings"
import stops from "./stops.json";
import { 
  SubwaySchedule, 
  FeedData, 
  MtaStop, 
  _TripUpdate, 
  TripStatus, 
  Trip, 
  TrainStatus, 
  StopIdName,
  TrainSymbol
} from "../types";
import { TRAIN_LINE_TO_TERMINATING_STOPS, TRAIN_LINE_TO_URL_MAP } from "../util";

const ACE_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace";
const BDFM_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm";
const G_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g";
const JZ_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz";
const NQRW_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw";
const L_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l";
const IRT_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs";

const getStopMap = () => {
  const stopMap: Record<string, MtaStop> = {};
  for (const stop of stops) {
    stopMap[stop.stop_id] = stop;
  }
  return stopMap;
}

const parseGtfsFeed = async(specificEndpoint: string, trainLine: TrainSymbol) => {
  const tripIdToUpdateMap: Record<string, _TripUpdate> = {};
  try {
    const response = await fetch(specificEndpoint);
    if (!response.ok) {
      return null;
    }

    // GTFS feeds are sent back as buffers. We must decode accordingly.
    const buffer = await response.arrayBuffer();
    const feed = TransitRealtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );
    feed.entity.forEach((entity) => {
      if (entity.tripUpdate) {
        if (entity.tripUpdate?.trip?.tripId) {
          tripIdToUpdateMap[entity.tripUpdate.trip.tripId] = entity.tripUpdate;
        }
      }
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  const dataFromThisFeed: SubwaySchedule = {};
  const stopMap = getStopMap();
  for (const { stopTimeUpdate, trip } of Object.values(tripIdToUpdateMap)) {
    if (!stopTimeUpdate?.length) continue;
    if (trip.routeId && trip.startDate) {
      const validRouteId = trip.routeId as string;
      const validStartDate = !!trip.startDate && /\d{8}/.test(trip.startDate)
        ? `${trip.startDate.slice(0, 4)}/${trip.startDate.slice(4,6)}/${trip.startDate.slice(6,8)}`
        : trip.startDate as string;
      const validStartTime = trip.startTime;

      dataFromThisFeed[validRouteId] ??= { trips: [] };
      dataFromThisFeed[validRouteId].trips.push({
        trainLine,
        tripId: trip.tripId as string,
        startDate: validStartDate,
        startTime: validStartTime,
        stops: (stopTimeUpdate ?? []).map(stop => {
          const validStopId = stop.stopId ? stop.stopId : null;
          const validStopName = validStopId && !!stopMap[validStopId] 
            ? stopMap[validStopId]?.stop_name ?? "" 
            : null;

          if (!stop.arrival?.time || !stop.departure?.time) {
            return {
              arrivalTime: "",
              arrivalTimeRaw: null,
              departureTime: "",
              departureTimeRaw: null,
              fixedDepartureTimeRaw: null,
              stop: {
                id: validStopId,
                name: validStopName
              }
            };
          }

          const validArrivalTime = new Date((stop.arrival.time as number) * 1000)
            .toLocaleTimeString("en-US");
          const validDepartureTime = new Date((stop.departure.time as number) * 1000)
            .toLocaleTimeString("en-US");
          
          // Addresses a weird issue where some MTA data 
          // has the same arrival/departure time.
          let fixedDepartureTimeRaw = null;
          if (
            stop.arrival.time && stop.departure.time && 
            stop.arrival.time === stop.departure.time
          ) {
            fixedDepartureTimeRaw = stop.arrival.time + 30;
          }

          return {
            arrivalTime: validArrivalTime,
            arrivalTimeRaw: stop.arrival.time,
            departureTime: validDepartureTime,
            departureTimeRaw: stop.departure.time,
            fixedDepartureTimeRaw,
            stop: {
              id: validStopId,
              name: validStopName,
            }
          };
        }).filter(stop => !!stop.arrivalTime)
      });
    }
  }

  return dataFromThisFeed;
}

export const onlyParseIndividualSubwayFeed = async(trainLine: string) => {
  const url = TRAIN_LINE_TO_URL_MAP[trainLine];
  const schedule = await parseGtfsFeed(url, trainLine);
  return schedule;
}

export const getActivityOfAllTrips = (feedData: FeedData): TripStatus[] => {
  const trips = feedData.trips;
  const tripActivites: TripStatus[] = [];
  for (const trip of trips) {
    const tripActivity = processTrip(trip);
    tripActivites.push(tripActivity);
  }
  return tripActivites;
}

const processTrip = (trip: Trip): TripStatus => {
  const currStops = trip.stops;
  if (!currStops.length) {
    return {
      tripId: trip.tripId,
      status: TrainStatus.OUT_OF_SERVICE
    };
  }

  /** 
   * Calculate whether or not the train is en route or at a station.
   * This can be done by:
   *    - First identifying the current UNIX time.
   *    - We also keep track of an outside variable which describes if 
   *      the train has past the previous stop: hasPastLastStop
   *    - Loop through each stop and evaluate the following:
   *      - If the current time is BETWEEN the arrival/departure time of the train at that stop.
   *        - Train is AT_STATION.
   *      - Else If the current time is before the arrival time of the current stop and hasPastLastStop
   *        is TRUE, the train is EN_ROUTE.
   *      - Else If the current time is after the arrival/departure time of the current station,
   *        it has past this station.
   */
  const currUnixTimeSeconds = parseInt(`${Date.now() / 1000}`);
  let lastSeenStop = currStops[0];
  for (const stopIdx in currStops) {
    const stop = currStops[stopIdx];
    lastSeenStop = stop;
    // If the arrival/departure times taken from the MTA are the same val,
    // we use the fixedDepartureTimeRaw.
    const departureTimeToUse = stop.arrivalTimeRaw === stop.departureTimeRaw
      ? stop.fixedDepartureTimeRaw
      : stop.departureTimeRaw;
    
    const nextStop = currStops[parseInt(stopIdx) + 1];

    /** 
     * There is some hairy logic here that determines the state 
     * of whether a train has started its trip. The logic is as follows:
     *
     * - If the train's last seen station is a terminating stop, and 
     *   the time until the next stop is < 3 mins, most likely the train 
     *   is EN_ROUTE to the next stop.
     * - Else, we assume the train is IDLING at the last stop.
     */
    const SECONDS_THRESHOLD_LAST_STOP = 180;
    if (
      lastSeenStop?.stop?.id && 
      TRAIN_LINE_TO_TERMINATING_STOPS[trip.trainLine].includes(
        lastSeenStop.stop.id
      )
    ) {
      if (
        nextStop?.arrivalTimeRaw &&
        (nextStop.arrivalTimeRaw - currUnixTimeSeconds) > 0 &&
        (nextStop.arrivalTimeRaw - currUnixTimeSeconds) <= SECONDS_THRESHOLD_LAST_STOP
      ) {
        return {
          tripId: trip.tripId,
          status: TrainStatus.EN_ROUTE,
          lastSeenStop,
          nextStop: currStops[parseInt(stopIdx) + 1]
        };
      } else {
        return {
          tripId: trip.tripId,
          status: TrainStatus.IDLING,
          lastSeenStop,
          nextStop: currStops[parseInt(stopIdx) + 1]
        };
      }
    }

    if (
      stop.arrivalTimeRaw && 
      (currUnixTimeSeconds >= stop.arrivalTimeRaw) && 
      departureTimeToUse && 
      (currUnixTimeSeconds <= departureTimeToUse)
    ) {
      return {
        tripId: trip.tripId,
        status: TrainStatus.AT_STATION,
        lastSeenStop,
        nextStop: currStops[parseInt(stopIdx) + 1]
      }
    } else if (stop.arrivalTimeRaw && currUnixTimeSeconds < stop.arrivalTimeRaw) {
      return {
        tripId: trip.tripId,
        status: TrainStatus.EN_ROUTE,
        lastSeenStop,
        nextStop: currStops[parseInt(stopIdx) + 1]
      };
    }
  }

  return {
    tripId: trip.tripId,
    status: TrainStatus.OUT_OF_SERVICE
  };
}

export const getStopListFromAllTrips = (trips: Trip[]): StopIdName[] => {
  const tripWithMostStops = trips.reduce((prev, curr) => {
    if (prev?.stops?.length > curr?.stops?.length) {
      return prev;
    }
    return curr;
  }, trips[0]);

  const currStops = tripWithMostStops.stops;
  return currStops.map(stopData => {
    const stop = stopData.stop;
    return {
      id: stop.id,
      name: stop.name
    };
  });
}

export const getTrainsAssociatedWithStop = (
  stop: StopIdName, 
  statuses: TripStatus[]
): TripStatus[] => {
  /** 
   * We either look for trip activities with 
   * the status "AT_STATION", where the lastSeenStop
   * is the stop provided to this fn, 
   *
   * Or we look for trip activities with the status "EN_ROUTE"
   * where the next stop is the current stop.
   */
  const trainsAtStation = statuses.filter(s => 
    s.status === TrainStatus.AT_STATION && 
    s.lastSeenStop.stop.id === stop.id
  );

  const trainsEnRouteToStop = statuses.filter(s =>
    s.status === TrainStatus.EN_ROUTE && 
    s.nextStop?.stop.id === stop.id
  );

  const trainIdlingAtStop = statuses.filter(s => 
    s.status === TrainStatus.IDLING && 
    s.lastSeenStop?.stop?.id === stop.id
  );

  return [
    ...trainsAtStation, 
    ...trainsEnRouteToStop,
    ...trainIdlingAtStop
  ];
}
