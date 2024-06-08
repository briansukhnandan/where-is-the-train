import { transit_realtime as TransitRealtime } from "gtfs-realtime-bindings"

export type PossiblyNullishString = string | null | undefined;
export type PossiblyNullishNumber = number | null | undefined;

export type StopIdName = {
  id: PossiblyNullishString;
  name: PossiblyNullishString;
}

export enum TrainStatus {
  EN_ROUTE,
  AT_STATION,
  OUT_OF_SERVICE,
}

// Taken directly from the MTA.
export type MtaStop = {
  stop_id: string;
  stop_name: string;
  parent_station: string;
}

// Our own Stop datatype.
export type Stop = {
  arrivalTime: string;
  arrivalTimeRaw: PossiblyNullishNumber; // Unix timestamp
  departureTime: string;
  departureTimeRaw: PossiblyNullishNumber; // Unix timestamp
  // The departure times provided by the MTA are literally 
  // equivalent to the arrival times... Instead we put a 30s 
  // addition to the arrival time which acts as a pseudo departure 
  // time for our calculations.
  fixedDepartureTimeRaw: PossiblyNullishNumber;
  stop: {
    id: PossiblyNullishString,
    name: PossiblyNullishString,
  }
};

export type _TripUpdate = TransitRealtime.ITripUpdate;
export type TrainSymbol = string;
export type Trip = {
  tripId: string;
  startDate: string;
  startTime: PossiblyNullishString;
  stops: Stop[];
};
export type FeedData = {
  trips: Trip[];
};
export type SubwaySchedule = Record<TrainSymbol, FeedData>;

export type TripActivity = {
  tripId: string;
} & ({
  status: TrainStatus.OUT_OF_SERVICE;
} | {
  status: TrainStatus.AT_STATION; 
  lastSeenStop: Stop;
  nextStop?: Stop;
} | {
  // Only available on route.
  status: TrainStatus.EN_ROUTE
  lastSeenStop: Stop;
  nextStop?: Stop;
  timeUntilNextStop?: number;
});
