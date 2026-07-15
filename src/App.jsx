import { useEffect, useState } from "react";
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
        : "STANDARD",
    status: "SAFE",
    threatScore: 0,
    temperature: 0,
    humidity: 0,
    motion: false,
    doorOpen: false,
    artifactMoved: false,
    espOnline: false,
    lastUpdateTime: null,
    threatFactors: [],
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

function App() {
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [criticalLatched, setCriticalLatched] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  const [galleries, setGalleries] = useState(createInitialGalleries);
  const [systemEvents, setSystemEvents] = useState([]);
  const [galleryEventsById, setGalleryEventsById] = useState({
    A: [],
    B: [],
    C: [],
  });
  const [threatAnalysis, setThreatAnalysis] = useState(
    createEmptyThreatAnalysis,
  );

  useEffect(() => {
    async function fetchSensorData() {
      try {
        const [archiveA, archiveB, archiveC] = await Promise.all([
          fetch("http://localhost:1880/api/archive/A").then((r) => r.json()),
          fetch("http://localhost:1880/api/archive/B").then((r) => r.json()),
          fetch("http://localhost:1880/api/archive/C").then((r) => r.json()),
        ]);

        const sensorDataByGallery = {
          A: archiveA,
          B: archiveB,
          C: archiveC,
        };

        setGalleries((currentGalleries) =>
          currentGalleries.map((gallery) => {
            const sensorData = sensorDataByGallery[gallery.id];

            if (!sensorData) {
              return gallery;
            }

            return {
              ...gallery,
              temperature: Number(sensorData.temperature || 0),
              humidity: Number(sensorData.humidity || 0),
              motion: Number(sensorData.motion || 0) === 1,
              distance: Number(sensorData.distance || 0),
              status: sensorData.status,
              threatScore: sensorData.threatScore,
              artifactMoved: sensorData.artifactMoved,
              espOnline: sensorData.espOnline,
              accessMode: sensorData.accessMode || gallery.accessMode,
              threatFactors: sensorData.threatFactors || [],
              lastUpdateTime:
                sensorData.lastUpdateTime ||
                sensorData.updatedAt ||
                sensorData.timestamp ||
                gallery.lastUpdateTime,
            };
          }),
        );

        const hasCriticalCondition = Object.values(sensorDataByGallery).some(
          (sensorData) =>
            sensorData &&
            (sensorData.status === "CRITICAL" ||
              Number(sensorData.threatScore || 0) >= 70),
        );

        if (hasCriticalCondition) {
          setCriticalLatched(true);
          setAlertAcknowledged(false);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    }

    async function fetchEventData() {
      try {
        const response = await fetch("http://localhost:1880/api/events");

        if (!response.ok) {
          return;
        }

        const payload = await response.json();

        setSystemEvents(Array.isArray(payload.systemEvents) ? payload.systemEvents : []);

        const galleryEventsSource =
          payload.galleryEventsById || payload.recentEventsByGallery || {};

        setGalleryEventsById({
          A: Array.isArray(galleryEventsSource.A) ? galleryEventsSource.A : [],
          B: Array.isArray(galleryEventsSource.B) ? galleryEventsSource.B : [],
          C: Array.isArray(galleryEventsSource.C) ? galleryEventsSource.C : [],
        });

        setThreatAnalysis(
          payload.threatAnalysis && typeof payload.threatAnalysis === "object"
            ? {
                currentThreatLevel:
                  payload.threatAnalysis.currentThreatLevel ?? null,
                primaryTrigger: payload.threatAnalysis.primaryTrigger ?? null,
                affectedArchive: payload.threatAnalysis.affectedArchive ?? null,
                recommendedImmediateAction:
                  payload.threatAnalysis.recommendedImmediateAction ?? null,
                systemDecision: payload.threatAnalysis.systemDecision ?? null,
                operatorActionRequired:
                  payload.threatAnalysis.operatorActionRequired ?? null,
              }
            : createEmptyThreatAnalysis(),
        );
      } catch {
        return;
      }
    }

    fetchSensorData();
    fetchEventData();

    const interval = setInterval(() => {
      fetchSensorData();
      fetchEventData();
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
      criticalLatched={criticalLatched}
      setCriticalLatched={setCriticalLatched}
      alertAcknowledged={alertAcknowledged}
      setAlertAcknowledged={setAlertAcknowledged}
      systemEvents={systemEvents}
      threatAnalysis={threatAnalysis}
      onOpenGallery={openGallery}
    />
  );
}

export default App;