import GalleryCard from "./GalleryCard";

function MuseumMap({ galleries, onOpenGallery }) {
  const gallerySlots = ["A", "B", "C"];

  return (
    <section className="museum-map-panel">
      <div className="museum-map-header">
        <div>
          <p className="small-label">INTERACTIVE FLOOR VIEW</p>
          <h2>BIOVAULT Specimen Archive Map</h2>
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

        {gallerySlots.map((galleryId) => (
          <div
            key={galleryId}
            className={`gallery-position gallery-position-${galleryId.toLowerCase()}`}
          >
            <GalleryCard
              gallery={galleries.find((gallery) => gallery.id === galleryId)}
              onOpen={onOpenGallery}
            />
          </div>
        ))}

        <div className="museum-entry">
          <span>AUTHORIZED ENTRY</span>
          <strong>MAIN ENTRANCE</strong>
        </div>
      </div>
    </section>
  );
}

export default MuseumMap;