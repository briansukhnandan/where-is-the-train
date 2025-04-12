import { transit_realtime as TransitRealtime } from "gtfs-realtime-bindings"

export type MaybeNullishString = string | null | undefined;
export type MaybeNullishNumber = number | null | undefined;

export type StopIdName = {
  id: MaybeNullishString;
  name: MaybeNullishString;
}

export enum TrainStatus {
  IDLING,
  EN_ROUTE,
  AT_STATION,
  OUT_OF_SERVICE,
}

export const trainStatusToString = (stat: TrainStatus) => ({
  [TrainStatus.IDLING]: "IDLING",
  [TrainStatus.EN_ROUTE]: "EN_ROUTE",
  [TrainStatus.AT_STATION]: "AT_STATION",
  [TrainStatus.OUT_OF_SERVICE]: "OUT_OF_SERVICE"
})[stat];

// Taken directly from the MTA.
export type MtaStop = {
  stop_id: string;
  stop_name: string;
  parent_station: string;
}

// Our own Stop datatype.
export type Stop = {
  arrivalTime: string;
  arrivalTimeRaw: MaybeNullishNumber; // Unix timestamp
  departureTime: string;
  departureTimeRaw: MaybeNullishNumber; // Unix timestamp
  // The departure times provided by the MTA are literally 
  // equivalent to the arrival times... Instead we put a 30s 
  // addition to the arrival time which acts as a pseudo departure 
  // time for our calculations.
  fixedDepartureTimeRaw: MaybeNullishNumber;
  stop: {
    id: MaybeNullishString,
    name: MaybeNullishString,
  }
};

export type _TripUpdate = TransitRealtime.ITripUpdate;
export type TrainSymbol = string;
export type Trip = {
  trainLine: TrainSymbol;
  tripId: string;
  startDate: string;
  startTime: MaybeNullishString;
  stops: Stop[];
};
export type FeedData = {
  trips: Trip[];
};
export type SubwaySchedule = Record<TrainSymbol, FeedData>;

export type AtStationStatus = {
  status: TrainStatus.AT_STATION; 
  lastSeenStop: Stop;
  nextStop?: Stop;
}
export type EnRouteStatus = {
  status: TrainStatus.EN_ROUTE;
  lastSeenStop: Stop;
  nextStop?: Stop;
  timeUntilNextStop?: number;
}
export type IdleStatus = {
  status: TrainStatus.IDLING;
  lastSeenStop: Stop;
  nextStop?: Stop;
  timeUntilNextStop?: number;
}
export type TripStatus = {
  tripId: string;
} & ({
  status: TrainStatus.OUT_OF_SERVICE;
} 
  | AtStationStatus 
  | EnRouteStatus
  | IdleStatus
);
