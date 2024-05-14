"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { parseAllSubwaySchedules } from "./api/gtfs";

export default function Home() {
  const [schedules, setSchedules] = useState({});
  useEffect(() => {
    parseAllSubwaySchedules().then((schedule) => {
      setSchedules(schedule);
    });
  }, [])

  console.log("all schedules", schedules);

  return (
    <main className={styles.main}>
      Hello World
    </main>
  );
}
