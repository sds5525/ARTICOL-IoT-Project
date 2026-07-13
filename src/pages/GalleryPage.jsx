import Gauge from "../components/Gauge";

function SensorCard({
  title,
  value,
  icon,
  active = false,
  type = "",
  description,
}) {
  return (
    <article
      className={`gallery-sensor-card ${active ? "active" : ""} ${type}`}
    >
      <div className={`sensor-visual ${active ? "active" : ""}`}>
        <span className="sensor-main-icon">{icon}</span>

        {type === "motion" && (
          <>
            <i className="radar-ring radar-ring-one" />
            <i className="radar-ring radar-ring-two" />
          </>
        )}

        {type === "esp" && active && (
          <>
            <i className="signal-wave signal-wave-one" />
            <i className="signal-wave signal-wave-two" />
          </>
        )}
      </div>

      <div className="sensor-card-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}

function GalleryPage({ gallery, onBack }) {
  if (!gallery) {
    return (
      <div className="gallery-page">
        <button type="button" className="back-button" onClick={onBack}>
          ← Back to dashboard
        </button>

        <p>Gallery data is unavailable.</p>
      </div>
    );
  }

  const statusClass = gallery.espOnline
    ? gallery.status.toLowerCase()
    : "offline";

  const threatDescription =
    gallery.threatScore >= 70
      ? "Critical threat"
      : gallery.threatScore >= 35
        ? "Elevated activity"
        : "Normal conditions";

  return (
    <div className="gallery-page">
      <header className="gallery-page-header">
        <button type="button" className="back-button" onClick={onBack}>
          <span>←</span>
          Back to Command Centre
        </button>

        <div className="gallery-page-brand">
          <span>ARTICOL</span>
          <small>Gallery Intelligence View</small>
        </div>
      </header>

      <main className="gallery-page-content">
        <section className="gallery-hero">
          <div className="gallery-hero-identity">
            <div className="gallery-hero-icon">{gallery.icon}</div>

            <div>
              <p className="small-label">SECURITY MONITORING AREA</p>
              <h1>{gallery.name}</h1>
              <p className="gallery-collection-name">
                {gallery.collection}
              </p>

              <div className="gallery-hero-badges">
                <span className={`gallery-status ${statusClass}`}>
                  {gallery.espOnline ? gallery.status : "OFFLINE"}
                </span>

                <span
                  className={`gallery-access-badge ${
                    gallery.accessMode === "RESTRICTED"
                      ? "restricted"
                      : "public"
                  }`}
                >
                  {gallery.accessMode === "RESTRICTED" ? "🔒" : "🔓"}
                  {gallery.accessMode}
                </span>
              </div>
            </div>
          </div>

          <div className={`large-threat-card ${statusClass}`}>
            <div className="large-threat-heading">
              <span>ARTICOL THREAT SCORE</span>
              <strong>
                {gallery.threatScore}
                <small>/100</small>
              </strong>
            </div>

            <div className="large-threat-track">
              <div
                className="large-threat-fill"
                style={{ width: `${gallery.threatScore}%` }}
              />
            </div>

            <p>{threatDescription}</p>
          </div>
        </section>

        <section className="gallery-detail-grid">
          <section className="gallery-sensors-panel">
            <div className="gallery-section-heading">
              <div>
                <p className="small-label">LIVE SENSOR NETWORK</p>
                <h2>Gallery Sensors</h2>
              </div>

              <span className="live-reading-badge">LIVE DATA</span>
            </div>

            <div className="gallery-sensor-grid">
              <SensorCard
                title="Motion Sensor"
                value={gallery.motion ? "DETECTED" : "CLEAR"}
                icon="◉"
                active={gallery.motion}
                type="motion"
                description={
                  gallery.motion
                    ? "Movement is currently detected."
                    : "No movement detected."
                }
              />

              <SensorCard
                title="Door Sensor"
                value={gallery.doorOpen ? "OPEN" : "CLOSED"}
                icon={gallery.doorOpen ? "🚪" : "▣"}
                active={gallery.doorOpen}
                type="door"
                description={
                  gallery.doorOpen
                    ? "The gallery entrance is open."
                    : "The gallery entrance is secured."
                }
              />

              <SensorCard
                title="Artifact Sensor"
                value={gallery.artifactMoved ? "MOVED" : "SECURE"}
                icon={gallery.artifactMoved ? "⚠" : "◆"}
                active={gallery.artifactMoved}
                type="artifact"
                description={
                  gallery.artifactMoved
                    ? "Artifact displacement detected."
                    : "Protected artifact remains secure."
                }
              />

              <SensorCard
                title="ESP32 Controller"
                value={gallery.espOnline ? "ONLINE" : "OFFLINE"}
                icon="📡"
                active={gallery.espOnline}
                type="esp"
                description={
                  gallery.espOnline
                    ? `ESP32-${gallery.id} is transmitting normally.`
                    : `ESP32-${gallery.id} is not responding.`
                }
              />
            </div>
          </section>

          <aside className="gallery-environment-panel">
            <div className="gallery-section-heading">
              <div>
                <p className="small-label">ENVIRONMENT</p>
                <h2>Room Conditions</h2>
              </div>
            </div>

            <div className="gallery-gauge-grid">
              <Gauge
                label="Temperature"
                value={gallery.temperature}
                min={0}
                max={50}
                unit="°C"
                helperText={`${gallery.name} temperature`}
              />

              <Gauge
                label="Humidity"
                value={gallery.humidity}
                min={0}
                max={100}
                unit="%"
                helperText={`${gallery.name} humidity`}
              />
            </div>
          </aside>
        </section>

        <section className="gallery-lower-grid">
          <section className="threat-factor-panel">
            <div className="gallery-section-heading">
              <div>
                <p className="small-label">EXPLAINABLE ASSESSMENT</p>
                <h2>Threat Score Factors</h2>
              </div>

              <span className="factor-total">
                TOTAL: {gallery.threatScore}
              </span>
            </div>

            <div className="threat-factor-list">
              {gallery.threatFactors.map((factor, index) => (
                <article
                  className="threat-factor-item"
                  key={`${factor.label}-${index}`}
                >
                  <div>
                    <span className="factor-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <strong>{factor.label}</strong>
                  </div>

                  <span
                    className={
                      factor.points > 0
                        ? "factor-points positive"
                        : "factor-points neutral"
                    }
                  >
                    +{factor.points}
                  </span>
                </article>
              ))}
            </div>

            <div className="threat-explanation">
              <span>ARTICOL INTERPRETATION</span>

              <p>
                {gallery.status === "SAFE" &&
                  "Current sensor readings indicate normal gallery conditions."}

                {gallery.status === "WARNING" &&
                  "One or more sensor readings require continued operator monitoring."}

                {gallery.status === "CRITICAL" &&
                  "Multiple high-risk conditions require immediate operator action."}
              </p>
            </div>
          </section>

          <section className="gallery-events-panel">
            <div className="gallery-section-heading">
              <div>
                <p className="small-label">GALLERY HISTORY</p>
                <h2>Recent Events</h2>
              </div>

              <span className="event-count">
                {gallery.recentEvents.length} EVENTS
              </span>
            </div>

            <div className="gallery-event-list">
              {gallery.recentEvents.map((event, index) => (
                <article
                  className="gallery-event-item"
                  key={`${event.time}-${event.title}-${index}`}
                >
                  <time>{event.time}</time>

                  <span
                    className={`gallery-event-dot ${event.type.toLowerCase()}`}
                  />

                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default GalleryPage;