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
  TripActivity 
} from "./types";

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

  console.log("all schedules", schedules);
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
  console.log(stop.name, trainsAssociatedWithStop);
  return (
    <div
      style={{ 
        textAlign: "center", 
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      { stop.name }
    </div>
  );
}
