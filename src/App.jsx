import { useEffect, useRef, useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import GalleryPage from "./pages/GalleryPage";

import { museumData } from "./data/dummyData";

function createInitialGalleries() {
  return museumData.galleries.map((gallery) => ({
    id: gallery.id,
    name: gallery.name,
    collection: gallery.collection,
    icon: gallery.icon,
    accessMode:
      gallery.id === "C" && museumData.galleryCRestricted
        ? "RESTRICTED"
        : "PUBLIC",
    status: "SAFE",
    threatScore: 0,
    temperature: 0,
    humidity: 0,
    motion: false,
    soundAnalog: 0,
    soundDigital: 0,
    soundDetected: false,
    doorOpen: false,
    artifactMoved: false,
    espOnline: false,
    lastUpdateTime: null,
    threatFactors: [],
    recentEvents: [],
  }));
}

function createEmptyThreatAnalysis() {
  return {
    currentThreatLevel: null,
    primaryTrigger: null,
    affectedArchive: null,
    recommendedImmediateAction: null,
    systemDecision: null,
    operatorActionRequired: null,
  };
}

function deriveThreatAnalysis(galleries) {
  if (!galleries.length) {
    return createEmptyThreatAnalysis();
  }

  const mostThreatenedGallery = galleries.reduce((highest, gallery) =>
    gallery.threatScore > highest.threatScore ? gallery : highest,
  );

  const dominantFactor = mostThreatenedGallery.threatFactors[0]?.label;
  const currentThreatLevel = Math.max(
    ...galleries.map((gallery) => Number(gallery.threatScore || 0)),
  );

  return {
    currentThreatLevel,
    primaryTrigger: dominantFactor || "Waiting for Node-RED...",
    affectedArchive: mostThreatenedGallery.name || "Waiting for Node-RED...",
    recommendedImmediateAction:
      mostThreatenedGallery.status === "CRITICAL"
        ? "Immediate operator intervention"
        : "Monitor live archive conditions",
    systemDecision: mostThreatenedGallery.status || "Waiting for Node-RED...",
    operatorActionRequired:
      mostThreatenedGallery.status === "SAFE"
        ? "No action required"
        : `Review ${mostThreatenedGallery.name}`,
  };
}

function createEmptyEventMap() {
  return {
    A: [],
    B: [],
    C: [],
  };
}

function normalizeAccessMode(value, fallback) {
  const normalized = String(value ?? "").toUpperCase();

  if (normalized === "RESTRICTED" || normalized === "PUBLIC") {
    return normalized;
  }

  return fallback;
}

function createEventEntry(type, title, description) {
  const now = new Date();

  return {
    timestamp: now.toISOString(),
    time: now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
    type,
    title,
    description,
  };
}

function buildArchiveEvents(previousGallery, nextGallery) {
  if (!previousGallery) {
    return [];
  }

  const events = [];

  if (previousGallery.status !== nextGallery.status) {
    events.push(
      createEventEntry(
        nextGallery.status.toLowerCase(),
        `${nextGallery.name} status ${nextGallery.status}`,
        `Status changed from ${previousGallery.status} to ${nextGallery.status}`,
      ),
    );
  }

  if (previousGallery.threatScore !== nextGallery.threatScore) {
    events.push(
      createEventEntry(
        nextGallery.status.toLowerCase(),
        `${nextGallery.name} threat updated`,
        `Threat score changed from ${previousGallery.threatScore} to ${nextGallery.threatScore}`,
      ),
    );
  }

  if (previousGallery.motion !== nextGallery.motion) {
    events.push(
      createEventEntry(
        nextGallery.motion ? "warning" : "safe",
        `${nextGallery.name} motion ${nextGallery.motion ? "detected" : "cleared"}`,
        nextGallery.motion
          ? "Motion sensor registered activity"
          : "Motion sensor returned to clear",
      ),
    );
  }

  if (previousGallery.soundDetected !== nextGallery.soundDetected) {
    events.push(
      createEventEntry(
        nextGallery.soundDetected ? "warning" : "safe",
        `${nextGallery.name} sound ${nextGallery.soundDetected ? "detected" : "cleared"}`,
        nextGallery.soundDetected
          ? "Sound sensor detected activity"
          : "Sound sensor returned to quiet",
      ),
    );
  }

  if (previousGallery.doorOpen !== nextGallery.doorOpen) {
    events.push(
      createEventEntry(
        nextGallery.doorOpen ? "warning" : "safe",
        `${nextGallery.name} door ${nextGallery.doorOpen ? "opened" : "secured"}`,
        nextGallery.doorOpen
          ? "Door sensor reported an open state"
          : "Door sensor reported a secured state",
      ),
    );
  }

  if (previousGallery.artifactMoved !== nextGallery.artifactMoved) {
    events.push(
      createEventEntry(
        nextGallery.artifactMoved ? "critical" : "safe",
        `${nextGallery.name} artifact ${nextGallery.artifactMoved ? "moved" : "secured"}`,
        nextGallery.artifactMoved
          ? "Artifact displacement detected"
          : "Artifact returned to secure state",
      ),
    );
  }

  if (previousGallery.espOnline !== nextGallery.espOnline) {
    events.push(
      createEventEntry(
        nextGallery.espOnline ? "safe" : "critical",
        `${nextGallery.name} controller ${nextGallery.espOnline ? "online" : "offline"}`,
        nextGallery.espOnline
          ? "ESP32 controller reconnected"
          : "ESP32 controller disconnected",
      ),
    );
  }

  if (previousGallery.correlatedEvent !== nextGallery.correlatedEvent) {
    events.push(
      createEventEntry(
        nextGallery.correlatedEvent ? "warning" : "safe",
        `${nextGallery.name} correlated event ${nextGallery.correlatedEvent ? "detected" : "cleared"}`,
        nextGallery.correlatedEvent
          ? "Correlated security event detected"
          : "Correlated security event cleared",
      ),
    );
  }

  return events;
}

function App() {
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [criticalLatched, setCriticalLatched] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [lockdown, setLockdown] = useState(false);
  const [hasReceivedLiveData, setHasReceivedLiveData] = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  const [galleries, setGalleries] = useState(createInitialGalleries);
  const [systemEvents, setSystemEvents] = useState([]);
  const [galleryEventsById, setGalleryEventsById] = useState(
    createEmptyEventMap,
  );

  const previousSensorSnapshotRef = useRef(null);
  const previousCriticalConditionRef = useRef(false);

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const [archiveA, archiveB, archiveC] = await Promise.all([
          fetch("http://localhost:1880/api/archive/A").then((r) => r.json()),
          fetch("http://localhost:1880/api/archive/B").then((r) => r.json()),
          fetch("http://localhost:1880/api/archive/C").then((r) => r.json()),
        ]);

        const visitors = await fetch("http://localhost:1880/api/visitors").then((r) => r.json());

        setVisitorCount(visitors.visitorCount);

        const sensorDataByGallery = {
          A: archiveA,
          B: archiveB,
          C: archiveC,
        };

        const validLiveSensorData = Object.values(sensorDataByGallery).filter(
          (sensorData) => sensorData && sensorData.espOnline === true,
        );

        const receivedLiveData = validLiveSensorData.length > 0;
        const currentCriticalCondition = validLiveSensorData.some(
          (sensorData) =>
            sensorData.status === "CRITICAL" ||
            Number(sensorData.threatScore || 0) >= 70,
        );

        if (receivedLiveData) {
          setHasReceivedLiveData(true);
        }

        const previousSnapshot = previousSensorSnapshotRef.current;
        const nextGalleryEventsById = createEmptyEventMap();
        const nextSystemEvents = [];
        const nextGallerySnapshotById = {};

        setGalleries((currentGalleries) =>
          currentGalleries.map((gallery) => {
            const sensorData = sensorDataByGallery[gallery.id];

            if (!sensorData) {
              if (previousSnapshot) {
                nextGallerySnapshotById[gallery.id] = gallery;
              }

              return gallery;
            }

            const nextGallery = {
              ...gallery,
              temperature: Number(sensorData.temperature || 0),
              humidity: Number(sensorData.humidity || 0),
              motion: Number(sensorData.motion || 0) === 1,
              soundAnalog: Number(sensorData.soundAnalog || 0),
              soundDigital: Number(sensorData.soundDigital || 0),
              soundDetected:
                Number(sensorData.soundAnalog || 0) > 0 ||
                Number(sensorData.soundDigital || 0) === 1,
              distance: Number(sensorData.distance || 0),
              status: sensorData.status,
              threatScore: Number(sensorData.threatScore ?? 0),
              artifactMoved: sensorData.artifactMoved,
              espOnline: sensorData.espOnline,
              accessMode: normalizeAccessMode(sensorData.accessMode, gallery.accessMode),
              threatFactors: sensorData.threatFactors || [],
              museumOpen: sensorData.museumOpen,
              roomOccupied: sensorData.roomOccupied,
              correlatedEvent: sensorData.correlatedEvent,
              recentEvents: gallery.recentEvents,
              lastUpdateTime:
                sensorData.lastUpdateTime ||
                sensorData.updatedAt ||
                sensorData.timestamp ||
                gallery.lastUpdateTime,
            };

            nextGallerySnapshotById[gallery.id] = nextGallery;

            return nextGallery;
          }),
        );

        if (previousSnapshot) {
          Object.keys(sensorDataByGallery).forEach((galleryId) => {
            const previousGallery = previousSnapshot[galleryId];
            const sensorData = sensorDataByGallery[galleryId];

            if (!previousGallery || !sensorData) {
              return;
            }

            const nextGallery = {
              ...previousGallery,
              temperature: Number(sensorData.temperature || 0),
              humidity: Number(sensorData.humidity || 0),
              motion: Number(sensorData.motion || 0) === 1,
              soundAnalog: Number(sensorData.soundAnalog || 0),
              soundDigital: Number(sensorData.soundDigital || 0),
              soundDetected:
                Number(sensorData.soundAnalog || 0) > 0 ||
                Number(sensorData.soundDigital || 0) === 1,
              distance: Number(sensorData.distance || 0),
              status: sensorData.status,
              threatScore: Number(sensorData.threatScore ?? 0),
              artifactMoved: sensorData.artifactMoved,
              espOnline: sensorData.espOnline,
              accessMode: normalizeAccessMode(sensorData.accessMode, previousGallery.accessMode),
              threatFactors: sensorData.threatFactors || [],
              museumOpen: sensorData.museumOpen,
              roomOccupied: sensorData.roomOccupied,
              correlatedEvent: sensorData.correlatedEvent,
              lastUpdateTime:
                sensorData.lastUpdateTime ||
                sensorData.updatedAt ||
                sensorData.timestamp ||
                previousGallery.lastUpdateTime,
            };

            const archiveEvents = buildArchiveEvents(previousGallery, nextGallery);

            if (archiveEvents.length) {
              nextGalleryEventsById[galleryId].push(...archiveEvents);
              nextSystemEvents.push(
                ...archiveEvents.map((event) => ({
                  ...event,
                  source: galleryId,
                })),
              );
            }
          });
        }

        if (nextSystemEvents.length) {
          setSystemEvents((currentEvents) => [
            ...currentEvents,
            ...nextSystemEvents,
          ].slice(-30));

          setGalleryEventsById((currentEvents) => ({
            A: [...currentEvents.A, ...nextGalleryEventsById.A].slice(-15),
            B: [...currentEvents.B, ...nextGalleryEventsById.B].slice(-15),
            C: [...currentEvents.C, ...nextGalleryEventsById.C].slice(-15),
          }));
        }

        if (receivedLiveData) {
          previousSensorSnapshotRef.current = nextGallerySnapshotById;
        }

        if (
          currentCriticalCondition &&
          !previousCriticalConditionRef.current
        ) {
          setCriticalLatched(true);
          setAlertAcknowledged(false);
        }

        previousCriticalConditionRef.current = currentCriticalCondition;
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    }

    fetchSensorData();

    const interval = setInterval(() => {
      fetchSensorData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function openGallery(galleryId) {
    setSelectedGalleryId(galleryId);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeGallery() {
    setSelectedGalleryId(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const selectedGallery = galleries.find(
    (gallery) =>
      gallery.id === selectedGalleryId,
  );

  const threatAnalysis = deriveThreatAnalysis(galleries);

  if (selectedGalleryId && selectedGallery) {
    return (
      <GalleryPage
        gallery={selectedGallery}
        recentEvents={galleryEventsById[selectedGalleryId] || []}
        onBack={closeGallery}
      />
    );
  }

  return (
    <Dashboard
      galleries={galleries}
      setGalleries={setGalleries}
      lockdown={lockdown}
      setLockdown={setLockdown}
      criticalLatched={criticalLatched}
      setCriticalLatched={setCriticalLatched}
      alertAcknowledged={alertAcknowledged}
      setAlertAcknowledged={setAlertAcknowledged}
      hasReceivedLiveData={hasReceivedLiveData}
      visitorCount={visitorCount}
      systemEvents={systemEvents}
      galleryEventsById={galleryEventsById}
      threatAnalysis={threatAnalysis}
      onOpenGallery={openGallery}
    />
  );
}

export default App;