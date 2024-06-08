"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { getActivityOfAllTrips, parseAllSubwaySchedules } from "./api/gtfs";
import { FeedData, SubwaySchedule } from "./types";

export default function Home() {
  const [schedules, setSchedules] = useState<SubwaySchedule>({});
  useEffect(() => {
    parseAllSubwaySchedules().then((schedule) => {
      setSchedules(schedule);
    });
  }, []);

  console.log("all schedules", schedules);
  if (!Object.keys(schedules).length) {
    return <div>Loading...</div>
  }

  return (
    <main className={styles.main}>
      Hello World
      <FeedDisplay feed={schedules["D"]} />
    </main>
  );
}

const FeedDisplay = ({ feed }: { feed: FeedData }) => {
  const statuses = getActivityOfAllTrips(feed);
  console.log(statuses);
  
  return (
    <div>Feed</div>
  )
}
