import { transit_realtime as TransitRealtime } from "gtfs-realtime-bindings"

const ACE_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace";
const BDFM_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm";
const G_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g";
const JZ_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz";
const NQRW_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw";
const L_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l";
const IRT_GTFS_URL = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs";

type _PossiblyNullishString = string | null | undefined;

type _TripUpdate = TransitRealtime.ITripUpdate;
type _TrainSymbol = string;
type _FeedData = {
  trips: {
    tripId: string;
    startDate: string;
    startTime: _PossiblyNullishString;
    stops: {
      arrivalTime: string;
      departureTime: string;
      stopId: string;
    }[];
  }[];
};
type SubwaySchedule = Record<_TrainSymbol, _FeedData>;

export const parseGtfsFeed = async(specificEndpoint: string) => {
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
        tripId: trip.tripId as string,
        startDate: validStartDate,
        startTime: validStartTime,
        stops: (stopTimeUpdate ?? []).map(stop => {
          if (!stop.arrival?.time || !stop.departure?.time) {
            return {
              arrivalTime: "",
              departureTime: "",
              stopId: stop.stopId as string
            };
          }

          const validArrivalTime = new Date((stop.arrival.time as number) * 1000)
            .toLocaleTimeString("en-US");
          const validDepartureTime = new Date((stop.departure.time as number) * 1000)
            .toLocaleTimeString("en-US");

          return {
            arrivalTime: validArrivalTime,
            departureTime: validDepartureTime,
            stopId: stop.stopId as string
          };
        }).filter(stop => !!stop.arrivalTime)
      });
    }
  }

  return dataFromThisFeed;
}

export const parseAllSubwaySchedules = async() => {
  const URLS_TO_ITERATE_THROUGH = [
    ACE_GTFS_URL,
    BDFM_GTFS_URL,
    G_GTFS_URL,
    JZ_GTFS_URL,
    NQRW_GTFS_URL,
    L_GTFS_URL,
    IRT_GTFS_URL,
  ];

  let allSchedules: SubwaySchedule = {};
  for (const URL of URLS_TO_ITERATE_THROUGH) {
    const schedule = await parseGtfsFeed(URL);
    if (schedule && Object.keys(schedule).length) {
      allSchedules = {
        ...allSchedules,
        ...schedule
      };
    }
  }

  return allSchedules;
}
