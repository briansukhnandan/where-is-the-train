"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { 
  getActivityOfAllTrips, 
  getStopListFromAllTrips, 
  getTrainsAssociatedWithStop, 
  parseAllSubwaySchedules 
} from "./api/gtfs";
import { 
  FeedData, 
  StopIdName, 
  SubwaySchedule, 
  TrainStatus, 
  TripActivity 
} from "./types";
import { partition } from "./util";

export default function Home() {
  const [schedules, setSchedules] = useState<SubwaySchedule>({});
  const getNewSetOfSchedules = () => {
    parseAllSubwaySchedules().then((schedule) => {
      setSchedules(schedule);
    });
  }

  useEffect(() => {
    getNewSetOfSchedules();
  }, []);

  if (!Object.keys(schedules).length) {
    return <div>Loading...</div>
  }

  return (
    <main className={styles.main}>
      <FeedDisplay feed={schedules["D"]} />
    </main>
  );
}

const FeedDisplay = ({ feed }: { feed: FeedData }) => {
  const stops = getStopListFromAllTrips(feed.trips);
  const statuses = getActivityOfAllTrips(feed);
  if (!statuses.length) {
    return <div>No statuses to display!</div>;
  }
  
  return (
    <div>
      {stops.map(stop => 
        <StopDisplay stop={stop} statuses={statuses} />
      )}
    </div>
  );
}

const StopDisplay = ({ stop, statuses }: {
  stop: StopIdName,
  statuses: TripActivity[]
}) => {
  const trainsAssociatedWithStop = getTrainsAssociatedWithStop(stop, statuses);
  const [
    trainsAtStation, 
    trainsEnRouteToStation
  ] = partition(
    trainsAssociatedWithStop, 
    (trip) => trip.status === TrainStatus.AT_STATION
  );

  return (
    <div
      style={{ 
        textAlign: "center", 
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>{ trainsAtStation.map(t => "-") }</div>
        <div>{ stop.name }</div>
        <div>{ trainsEnRouteToStation.map(t => "-") }</div>
      </div>
    </div>
  );
}
