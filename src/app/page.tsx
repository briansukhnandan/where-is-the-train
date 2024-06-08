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
  TripStatus 
} from "./types";
import { partition } from "./util";
import Image from 'next/image'
import { Box } from "@chakra-ui/react";

const trainIdToImage: Record<string, string> = {
  D: "/images/D_Train.png"
}

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
      <FeedDisplay trainId={"D"} feed={schedules["D"]} />
    </main>
  );
}

const FeedDisplay = ({ trainId, feed }: { trainId: string, feed: FeedData }) => {
  const stops = getStopListFromAllTrips(feed.trips);
  const statuses = getActivityOfAllTrips(feed);
  if (!statuses.length) {
    return <div>No statuses to display!</div>;
  }
  
  return (
    <Box>
      {stops.map(stop => 
        <StopDisplay
          key={stop.id}
          trainId={trainId} 
          stop={stop} 
          statuses={statuses} 
        />
      )}
    </Box>
  );
}

const StopDisplay = ({ trainId, stop, statuses }: {
  trainId: string,
  stop: StopIdName,
  statuses: TripStatus[]
}) => {
  const trainsAssociatedWithStop = getTrainsAssociatedWithStop(stop, statuses);
  const associatedIconPath = trainIdToImage[trainId];
  const [
    trainsAtStation, 
    trainsEnRouteToStation
  ] = partition(
    trainsAssociatedWithStop, 
    (trip) => trip.status === TrainStatus.AT_STATION
  );

  return (
    <Box
      style={{ 
        textAlign: "center", 
        paddingTop: 6,
        paddingBottom: 6,
      }}
    >
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Box>
          {
            trainsAtStation.map(tripStatus => (
              <TrainsAtStationDisplay 
                key={tripStatus.tripId}
                status={tripStatus} 
                iconPath={associatedIconPath} 
              />
            ))
          }
        </Box>
        <Box 
          style={{ 
            fontSize: "22px", 
            transform: "translate(0px, 2px)" 
          }}
        >
          { stop.name }
        </Box>
        <Box>
          { 
            trainsEnRouteToStation.map(tripStatus => (
              <TrainsEnRouteDisplay 
                key={tripStatus.tripId}
                status={tripStatus}
                iconPath={associatedIconPath}
              />
            )) 
          }
        </Box>
      </Box>
    </Box>
  );
}

const TRAIN_ICON_DISPLAY_SIZE = 32;
const TrainsAtStationDisplay = ({ 
  iconPath, 
  status 
}: { 
  iconPath: string, 
  status: TripStatus 
}) => {
  return (
    <Image 
      src={iconPath} 
      alt="Train Icon" 
      width={TRAIN_ICON_DISPLAY_SIZE} 
      height={TRAIN_ICON_DISPLAY_SIZE} 
    />
  );
}

const TrainsEnRouteDisplay = ({ 
  iconPath, 
  status 
}: { 
  iconPath: string, 
  status: TripStatus 
}) => {
  return (
    <Image 
      src={iconPath} 
      alt="Train Icon" 
      width={TRAIN_ICON_DISPLAY_SIZE} 
      height={TRAIN_ICON_DISPLAY_SIZE} 
    />
  );
}
