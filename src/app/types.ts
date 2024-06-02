import { transit_realtime as TransitRealtime } from "gtfs-realtime-bindings"

type _PossiblyNullishString = string | null | undefined;
type _PossiblyNullishNumber = number | null | undefined;

export enum TrainStatus {
  EN_ROUTE,
  AT_STATION,
  OUT_OF_SERVICE,
}

// Taken directly from the MTA.
export type Stop = {
  stop_id: string;
  stop_name: string;
  parent_station: string;
}

export type _TripUpdate = TransitRealtime.ITripUpdate;
export type TrainSymbol = string;
export type FeedData = {
  trips: {
    tripId: string;
    startDate: string;
    startTime: _PossiblyNullishString;
    stops: {
      arrivalTime: string;
      arrivalTimeRaw: _PossiblyNullishNumber; // Unix timestamp
      departureTime: string;
      departureTimeRaw: _PossiblyNullishNumber; // Unix timestamp
      stop: {
        id: _PossiblyNullishString,
        name: _PossiblyNullishString,
      }
    }[];
  }[];
};
export type SubwaySchedule = Record<TrainSymbol, FeedData>;

export type TripActivity = {
  tripId: string;
  status: TrainStatus; 
  lastSeenStop: Stop;
  timeUntilNextStop: number;
}
