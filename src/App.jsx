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

  return {
    currentThreatLevel: `${Math.max(...galleries.map((gallery) => gallery.threatScore))}/100`,
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

function App() {
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);
  const [criticalLatched, setCriticalLatched] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [lockdown, setLockdown] = useState(false);

  const [galleries, setGalleries] = useState(createInitialGalleries);

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
              if (!lockdown) {
                return gallery;
              }

              return {
                ...gallery,
                status: "CRITICAL",
                threatScore: Math.max(gallery.threatScore, 90),
                doorOpen: false,
              };
            }

            const nextGallery = {
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
              recentEvents: Array.isArray(sensorData.recentEvents)
                ? sensorData.recentEvents
                : gallery.recentEvents,
              lastUpdateTime:
                sensorData.lastUpdateTime ||
                sensorData.updatedAt ||
                sensorData.timestamp ||
                gallery.lastUpdateTime,
            };

            if (lockdown) {
              return {
                ...nextGallery,
                status: "CRITICAL",
                threatScore: Math.max(Number(nextGallery.threatScore || 0), 90),
                doorOpen: false,
              };
            }

            return nextGallery;
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

    fetchSensorData();

    const interval = setInterval(() => {
      fetchSensorData();
    }, 2000);

    return () => clearInterval(interval);
  }, [lockdown]);

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

  const systemEvents = galleries.flatMap((gallery) =>
    Array.isArray(gallery.recentEvents) ? gallery.recentEvents : [],
  );

  const threatAnalysis = deriveThreatAnalysis(galleries);

  if (selectedGalleryId && selectedGallery) {
    return (
      <GalleryPage
        gallery={selectedGallery}
        recentEvents={selectedGallery.recentEvents || []}
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
      systemEvents={systemEvents}
      threatAnalysis={threatAnalysis}
      onOpenGallery={openGallery}
    />
  );
}

export default App;