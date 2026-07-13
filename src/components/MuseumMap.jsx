import GalleryCard from "./GalleryCard";

function MuseumMap({ galleries, onOpenGallery }) {
  return (
    <section className="museum-map-panel">
      <div className="museum-map-header">
        <div>
          <p className="small-label">INTERACTIVE FLOOR VIEW</p>
          <h2>ARTICOL Museum Security Map</h2>
        </div>

        <div className="museum-map-legend">
          <span>
            <i className="legend-dot safe" />
            Safe
          </span>

          <span>
            <i className="legend-dot warning" />
            Warning
          </span>

          <span>
            <i className="legend-dot critical" />
            Critical
          </span>

          <span>
            <i className="legend-dot restricted" />
            Restricted
          </span>
        </div>
      </div>

      <div className="museum-floor-plan">
        <div className="floor-grid-lines" />

        <div className="corridor corridor-top">
          <span>SECURE CORRIDOR</span>
        </div>

        <div className="corridor corridor-centre">
          <span>ACCESS PATH</span>
        </div>

        <div className="gallery-position gallery-position-a">
          <GalleryCard
            gallery={galleries.find((gallery) => gallery.id === "A")}
            onOpen={onOpenGallery}
          />
        </div>

        <div className="gallery-position gallery-position-b">
          <GalleryCard
            gallery={galleries.find((gallery) => gallery.id === "B")}
            onOpen={onOpenGallery}
          />
        </div>

        <div className="gallery-position gallery-position-c">
          <GalleryCard
            gallery={galleries.find((gallery) => gallery.id === "C")}
            onOpen={onOpenGallery}
          />
        </div>

        <div className="museum-entry">
          <span>VISITOR ENTRY</span>
          <strong>MAIN ENTRANCE</strong>
        </div>
      </div>
    </section>
  );
}

export default MuseumMap;