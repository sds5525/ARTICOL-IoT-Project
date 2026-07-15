function GalleryCard({ gallery, onOpen }) {
  const statusClass = gallery.espOnline
    ? gallery.status.toLowerCase()
    : "offline";

  const isRestricted = gallery.accessMode === "RESTRICTED";
  const galleryStatusLabel = gallery.espOnline ? gallery.status : "OFFLINE";
  const accessModeLabel = isRestricted ? "RESTRICTED" : "PUBLIC";
  const accessModeDescription = isRestricted
    ? "Authorized only"
    : "Visitor access";

  return (
    <button
      type="button"
      className={`gallery-card gallery-${gallery.id.toLowerCase()} ${statusClass}`}
      onClick={() => onOpen(gallery.id)}
    >
      <div className="gallery-card-top">
        <div className="gallery-identity">
          <span className="gallery-id">{gallery.id}</span>

          <div>
            <h3>{gallery.name}</h3>
            <p>{gallery.collection}</p>
          </div>
        </div>

        <span className={`gallery-status ${statusClass}`}>
          {galleryStatusLabel}
        </span>
      </div>

      {gallery.id === "C" && (
        <div
          className={`access-mode-banner compact ${
            isRestricted ? "restricted" : "public"
          }`}
        >
          <span>{isRestricted ? "🔒" : "🔓"}</span>

          <div>
            <strong>{accessModeLabel}</strong>

            <small>{accessModeDescription}</small>
          </div>
        </div>
      )}

      <div className="gallery-compact-body">
        <div className="compact-artifact">
          <div className="artifact-orbit compact">
            <span>{gallery.icon}</span>
          </div>
        </div>

        <div className="compact-gallery-readings">
          <div>
            <span>Threat</span>
            <strong>{gallery.threatScore}</strong>
          </div>

          <div>
            <span>Temperature</span>
            <strong>{gallery.temperature}°C</strong>
          </div>

          <div>
            <span>Humidity</span>
            <strong>{gallery.humidity}%</strong>
          </div>
        </div>
      </div>

      <div className="compact-sensor-summary">
        <span className={gallery.motion ? "active" : ""}>
          ◉ {gallery.motion ? "Motion" : "Clear"}
        </span>

        <span className={gallery.doorOpen ? "active" : ""}>
          ▣ {gallery.doorOpen ? "Door open" : "Door closed"}
        </span>

        <span className={gallery.artifactMoved ? "active" : ""}>
          ◆ {gallery.artifactMoved ? "Moved" : "Secure"}
        </span>
      </div>

      <div className="gallery-threat">
        <div className="gallery-threat-track">
          <div
            className="gallery-threat-fill"
            style={{ width: `${gallery.threatScore}%` }}
          />
        </div>
      </div>

      <div className="open-gallery-indicator">
        Open detailed view
        <span>→</span>
      </div>
    </button>
  );
}

export default GalleryCard;