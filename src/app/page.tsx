"use client"
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { 
  getActivityOfAllTrips, 
  getStopListFromAllTrips, 
  getTrainsAssociatedWithStop, 
  onlyParseIndividualSubwayFeed, 
} from "./api/gtfs";
import { 
  AtStationStatus,
  EnRouteStatus,
  FeedData, 
  IdleStatus, 
  StopIdName, 
  SubwaySchedule, 
  TrainStatus, 
  TripStatus, 
  trainStatusToString
} from "./types";
import { TRAIN_LINE_TO_COLOR, partition } from "./util";
import Image from 'next/image'
import { Box, Button, Tooltip } from "@chakra-ui/react";

const trainLines = [
  "A", "B", "C", "D", "E",
  "F", "G", "J", "L", "M",
  "N", "Q", "R", "S", "V",
  "W", "Z", "1", "2", "3",
  "4", "5", "6", "7"
];

const RefreshButton = ({
  action, 
  timeIntervalSeconds,
  disableCriteria,
}: {
  action: () => any, 
  timeIntervalSeconds: number,
  disableCriteria?: boolean,
}) => {
  const [refreshTimer, setRefreshTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshTimer > 0) {
        setRefreshTimer((r) => r-1);
      }
    }, 1_000);

    return () => clearInterval(interval);
  }, [refreshTimer, setRefreshTimer]);

  return (
    <Button
      colorScheme="purple"
      isDisabled={disableCriteria || refreshTimer > 0}
      onClick={() => {
        action();
        setRefreshTimer(timeIntervalSeconds);
      }}
    >
      { 
        refreshTimer > 0 
          ? `Refresh available in ${refreshTimer} seconds!` 
          : "Refresh Data!" 
      }
    </Button>
  );
}

export default function Home() {
  const [schedules, setSchedules] = useState<SubwaySchedule>({});
  const [selectedTrainLine, setTrainLine] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); 

  const getNewSchedule = (line: string) => {
    setIsLoading(true);
    onlyParseIndividualSubwayFeed(line).then(schedule => {
      if (schedule) {
        setSchedules(schedule);
      }
    });
    setIsLoading(false);
  }

  useEffect(() => {
    if (selectedTrainLine) {
      getNewSchedule(selectedTrainLine);
    }
  }, [selectedTrainLine]);

  return (
    <main className={styles.main}>
      <h1 style={{ paddingBottom: "30px", fontSize: "40px" }}>
        <u><b>{"Where are the NYC Subway Trains?"}</b></u>
      </h1>
      <Box paddingBottom={"40px"} textAlign={"center"}>
        <RefreshButton 
          action={() => getNewSchedule(selectedTrainLine)} 
          disableCriteria={!selectedTrainLine}
          timeIntervalSeconds={60}
        />
        { isLoading && <Box>{"Loading..."}</Box> }
      </Box>
      { !selectedTrainLine && (
        <Box fontSize={"25px"}>
          <i>Pick a Train to get started!</i>
        </Box>
      )}
      <TrainLineDisplay selectCallback={setTrainLine} />
      {
        (selectedTrainLine && !isLoading) ? (
          <Box paddingTop={"50px"}>
            <FeedDisplay 
              trainId={selectedTrainLine} 
              feed={schedules[selectedTrainLine]} 
            />
          </Box>
        ) : null
      }
      <h6 
        style={{ 
          margin: "50px", 
          fontSize: "16px", 
          color: "#b5abac" 
        }}
      >
        <a href="https://briansukhnandan.xyz">
          Click here to see more of my work!
        </a>
      </h6>
    </main>
  );
}

const TrainLineDisplay = ({ 
  selectCallback 
}: { 
  selectCallback: (trainLabel: string) => void 
}) => {
  const trainIdToImage: Record<string, string> = useMemo(() => {
    const mapping: Record<string, string> = {};
    for (const trainLine of trainLines) {
      mapping[trainLine] = `/images/${trainLine}_Train.png`
    }
    return mapping;
  }, [trainLines]);

  return (
    <Box margin={"auto"}>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["A"]} 
          alt="A Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("A");
          }}
        />
        <Image 
          src={trainIdToImage["C"]} 
          alt="C Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("C");
          }}
        />
        <Image 
          src={trainIdToImage["E"]} 
          alt="E Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("E");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["B"]} 
          alt="B Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("B");
          }}
        />
        <Image 
          src={trainIdToImage["D"]} 
          alt="D Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("D");
          }}
        />
        <Image 
          src={trainIdToImage["F"]} 
          alt="F Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("F");
          }}
        />
        <Image 
          src={trainIdToImage["M"]} 
          alt="M Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("M");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["J"]} 
          alt="J Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("J");
          }}
        />
        <Image 
          src={trainIdToImage["Z"]} 
          alt="Z Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("Z");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["N"]} 
          alt="N Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("N");
          }}
        />
        <Image 
          src={trainIdToImage["Q"]} 
          alt="Q Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("Q");
          }}
        />
        <Image 
          src={trainIdToImage["R"]} 
          alt="R Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("R");
          }}
        />
        <Image 
          src={trainIdToImage["W"]} 
          alt="W Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("W");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["G"]} 
          alt="G Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("G");
          }}
        />
        <Image 
          src={trainIdToImage["L"]} 
          alt="L Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("L");
          }}
        />
        <Image 
          src={trainIdToImage["S"]} 
          alt="S Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("S");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["1"]} 
          alt="1 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("1");
          }}
        />
        <Image 
          src={trainIdToImage["2"]} 
          alt="2 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("2");
          }}
        />
        <Image 
          src={trainIdToImage["3"]} 
          alt="3 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("3");
          }}
        />
      </Box>
      <Box 
        style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "5px" 
        }}
      >
        <Image 
          src={trainIdToImage["4"]} 
          alt="4 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("4");
          }}
        />
        <Image 
          src={trainIdToImage["5"]} 
          alt="5 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("5");
          }}
        />
        <Image 
          src={trainIdToImage["6"]} 
          alt="6 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("6");
          }}
        />
        <Image 
          src={trainIdToImage["7"]} 
          alt="7 Train Icon" 
          width={64} 
          height={64} 
          onClick={() => {
            selectCallback("7");
          }}
        />
      </Box>
    </Box>
  )
}

const FeedDisplay = ({ trainId, feed }: { trainId: string, feed: FeedData }) => {
  if (!feed) {
    return <div>No feeds available for this Line!</div>
  }

  const stops = getStopListFromAllTrips(feed.trips);
  const statuses = getActivityOfAllTrips(feed);
  if (!statuses.length) {
    return <div>No statuses to display!</div>;
  }
  
  return (
    <Box 
      border={"solid"} 
      borderColor={TRAIN_LINE_TO_COLOR[trainId] ?? "black"}
      borderRadius={"20px"}
    >
      <Box margin={5}>
        <Box 
          paddingBottom={"40px"}
          textAlign={"center"}
        >
          <Box
            fontSize={"40px"}
          >
            <i>Stops on this Route</i>
          </Box>
          <h6>{"* You can also hover over individual Train icons for info!"}</h6>
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
    trainsNotAtStation
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
        <Box 
          style={{ 
            fontSize: "22px", 
            paddingLeft: "10px", 
            paddingRight: "10px" 
          }}
        >
          { stop.name }
        </Box>
        <Box>
          { 
            trainsNotAtStation.map(tripStatus => (
              <TrainsNotAtStopDisplay 
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
  const stat = status as AtStationStatus;
  return (
    <Tooltip label={
      <>
        <Box>{"Currently At Station"}</Box>
        {
          stat?.nextStop?.stop?.name && (
            <Box>{`Next Station: ${stat?.nextStop?.stop.name}`}</Box>
          )
        }
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

const TrainsNotAtStopDisplay = ({ 
  iconPath, 
  status 
}: { 
  iconPath: string, 
  status: TripStatus 
}) => {
  const stat = status as EnRouteStatus | IdleStatus;
  return (
    <Tooltip label={
      <>
        <Box>{`Status: ${trainStatusToString(stat.status)}`}</Box>
        <Box>{`Arrival Time: ${stat?.nextStop?.arrivalTime}`}</Box>
        <Box>{`Next Station: ${stat?.nextStop?.stop.name}`}</Box>
        {
          stat?.lastSeenStop?.stop?.name && (
            <Box>{`Last Seen Station: ${stat?.lastSeenStop?.stop.name}`}</Box>
          )
        }
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
