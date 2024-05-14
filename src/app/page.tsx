"use client"
import { useEffect } from "react";
import styles from "./page.module.css";
import { parseAllSubwaySchedules } from "./api/gtfs";

export default function Home() {
  useEffect(() => {
    parseAllSubwaySchedules().then((schedule) => {
      console.log("scheudle", schedule);
    });
  }, [])

  return (
    <main className={styles.main}>
      Hello World
    </main>
  );
}
