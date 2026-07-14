import { useEffect, useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import GalleryPage from "./pages/GalleryPage";

import { museumData } from "./data/dummyData";

function App() {
  const [selectedGalleryId, setSelectedGalleryId] =
    useState(null);

  const [galleries, setGalleries] = useState(
    structuredClone(museumData.galleries),
  );

  useEffect(() => {
  async function fetchSensorData() {
    try {
      const [archiveA, archiveB, archiveC] =
        await Promise.all([
          fetch(
            "http://localhost:1880/api/archive/A"
          ).then((r) => r.json()),

          fetch(
            "http://localhost:1880/api/archive/B"
          ).then((r) => r.json()),

          fetch(
            "http://localhost:1880/api/archive/C"
          ).then((r) => r.json()),
        ]);

      setGalleries((currentGalleries) =>
        currentGalleries.map((gallery) => {
          let sensorData;

          if (gallery.id === "A")
            sensorData = archiveA;

          if (gallery.id === "B")
            sensorData = archiveB;

          if (gallery.id === "C")
            sensorData = archiveC;

          return {
            ...gallery,

            temperature: Number(
              sensorData.temperature || 0
            ),

            humidity: Number(
              sensorData.humidity || 0
            ),

            motion:
              Number(
                sensorData.motion || 0
              ) === 1,

            distance: Number(
              sensorData.distance || 0
            ),

            status: sensorData.status,

            threatScore:
              sensorData.threatScore,

            artifactMoved:
              sensorData.artifactMoved,

            espOnline:
              sensorData.espOnline,

            accessMode:
              sensorData.accessMode ||
              gallery.accessMode,

            threatFactors:
              sensorData.threatFactors || [],
          };
        })
      );
    } catch (error) {
      console.error(
        "Error fetching sensor data:",
        error
      );
    }
  }

  fetchSensorData();

  const interval = setInterval(
    fetchSensorData,
    2000
  );

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
        onBack={closeGallery}
      />
    );
  }

  return (
    <Dashboard
      galleries={galleries}
      setGalleries={setGalleries}
      onOpenGallery={openGallery}
    />
  );
}

export default App;