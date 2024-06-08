"use client"
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { 
  getActivityOfAllTrips, 
  getStopListFromAllTrips, 
  getTrainsAssociatedWithStop, 
  parseAllSubwaySchedules 
} from "./api/gtfs";
import { 
  EnRouteStatus,
  FeedData, 
  StopIdName, 
  SubwaySchedule, 
  TrainStatus, 
  TripStatus 
} from "./types";
import { partition } from "./util";
import Image from 'next/image'
import { Box, Tooltip } from "@chakra-ui/react";

const trainLines = [
  "A", "B", "C", "D", "E",
  "F", "G", "J", "L", "M",
  "N", "Q", "R", "S", "V",
  "W", "Z", "1", "2", "3",
  "4", "5", "6", "7"
];

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
      <Box
        fontSize={"40px"}
      >
        <u>
          <i>Stops on this Route</i>
        </u>
      </Box>
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
    </Box>
  );
}

const StopDisplay = ({ trainId, stop, statuses }: {
  trainId: string,
  stop: StopIdName,
  statuses: TripStatus[]
}) => {
  const trainIdToImage: Record<string, string> = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (const trainLine of trainLines) {
      mapping[trainLine] = `/images/${trainLine}_Train.png`
    }
    return mapping;
  }, [trainLines]);

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
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          alignItems: "center",
          justifyContent: "center"
        }}>
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
        <Box style={{ fontSize: "22px" }}>
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
    <Tooltip label="Currently At Station">
      <Image 
        src={iconPath} 
        alt="Train Icon" 
        width={TRAIN_ICON_DISPLAY_SIZE} 
        height={TRAIN_ICON_DISPLAY_SIZE} 
      />
    </Tooltip>
  );
}

const TrainsEnRouteDisplay = ({ 
  iconPath, 
  status 
}: { 
  iconPath: string, 
  status: TripStatus 
}) => {
  const stat = status as EnRouteStatus;
  return (
    <Tooltip label={
      <>
        <Box>{`Arrival Time: ${stat?.nextStop?.arrivalTime}`}</Box>
        <Box>{`Next Station: ${stat?.nextStop?.stop.name}`}</Box>
      </>
    }>
      <Image 
        src={iconPath} 
        alt="Train Icon" 
        width={TRAIN_ICON_DISPLAY_SIZE} 
        height={TRAIN_ICON_DISPLAY_SIZE} 
      />
    </Tooltip>
  );
}
