import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import GalleryPage from "./pages/GalleryPage";
import { museumData } from "./data/dummyData";

function App() {
  const [selectedGalleryId, setSelectedGalleryId] = useState(null);

  const selectedGallery = museumData.galleries.find(
    (gallery) => gallery.id === selectedGalleryId,
  );

  function openGallery(galleryId) {
    setSelectedGalleryId(galleryId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeGallery() {
    setSelectedGalleryId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (selectedGalleryId) {
    return (
      <GalleryPage
        gallery={selectedGallery}
        onBack={closeGallery}
      />
    );
  }

  return <Dashboard onOpenGallery={openGallery} />;
}

export default App;