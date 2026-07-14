import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Gauge from "../components/Gauge";
import MuseumMap from "../components/MuseumMap";
import ManualControls from "../components/ManualControls";
import { museumData } from "../data/dummyData";

function Dashboard({
  galleries,
  setGalleries,
  onOpenGallery,
}) {

  const [galleryCRestricted, setGalleryCRestricted] = useState(
    museumData.galleryCRestricted,
  );

  const [lockdown, setLockdown] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);

  useEffect(() => {
  async function fetchSensorData() {
    try {
      const [archiveA, archiveB, archiveC] = await Promise.all([
        fetch("http://localhost:1880/api/archive/A").then((r) =>
          r.json(),
        ),
        fetch("http://localhost:1880/api/archive/B").then((r) =>
          r.json(),
        ),
        fetch("http://localhost:1880/api/archive/C").then((r) =>
          r.json(),
        ),
      ]);

      setGalleries((currentGalleries) =>
        currentGalleries.map((gallery) => {
          let sensorData;

          if (gallery.id === "A") sensorData = archiveA;
          if (gallery.id === "B") sensorData = archiveB;
          if (gallery.id === "C") sensorData = archiveC;

          return {
  ...gallery,

  temperature: Number(
    sensorData.temperature || 0,
  ),

  humidity: Number(
    sensorData.humidity || 0,
  ),

  motion: Number(
    sensorData.motion || 0,
  ) === 1,

  distance: Number(
    sensorData.distance || 0,
  ),

  status: sensorData.status,

  threatScore: sensorData.threatScore,

  artifactMoved:
    sensorData.artifactMoved,

  espOnline: sensorData.espOnline,

  accessMode:
    sensorData.accessMode ||
    gallery.accessMode,

  threatFactors:
    sensorData.threatFactors || [],
};
        }),
      );
    } catch (error) {
      console.error(
        "Error fetching sensor data:",
        error,
      );
    }
  }

  fetchSensorData();

  const interval = setInterval(
    fetchSensorData,
    2000,
  );

  return () => clearInterval(interval);
}, []);

  const overallThreat = useMemo(() => {
    return Math.max(...galleries.map((gallery) => gallery.threatScore));
  }, [galleries]);

  const overallStatus = useMemo(() => {
    if (lockdown || overallThreat >= 70) {
      return "CRITICAL";
    }

    if (overallThreat >= 35) {
      return "WARNING";
    }

    return "SAFE";
  }, [lockdown, overallThreat]);

  const activeIncidents = galleries.filter(
    (gallery) =>
      gallery.status === "CRITICAL" ||
      gallery.doorOpen ||
      gallery.artifactMoved,
  ).length;

  const averageTemperature =
    galleries.reduce(
      (total, gallery) => total + gallery.temperature,
      0,
    ) / galleries.length;

  const averageHumidity =
    galleries.reduce(
      (total, gallery) => total + gallery.humidity,
      0,
    ) / galleries.length;

  async function handleGalleryCModeChange(
  restricted,
) {
  setGalleryCRestricted(restricted);

  try {
    await fetch(
      "http://localhost:1880/api/galleryC/mode",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          restricted,
        }),
      },
    );
  } catch (error) {
    console.error(error);
  }

  setGalleries((currentGalleries) =>
    currentGalleries.map((gallery) =>
      gallery.id === "C"
        ? {
            ...gallery,

            accessMode: restricted
              ? "RESTRICTED"
              : "STANDARD",
          }
        : gallery,
    ),
  );
}

  function handleLockdownChange(enabled) {
    setLockdown(enabled);

    if (enabled) {
      setGalleries((currentGalleries) =>
        currentGalleries.map((gallery) => ({
          ...gallery,
          status: "CRITICAL",
          threatScore: Math.max(gallery.threatScore, 90),
          doorOpen: false,
        })),
      );

      return;
    }

    setGalleries(
      museumData.galleries.map((gallery) => ({
        ...structuredClone(gallery),
        accessMode:
          gallery.id === "C"
            ? galleryCRestricted
              ? "RESTRICTED"
              : "STANDARD"
            : gallery.accessMode,
      })),
    );
  }

  function resetDashboard() {
  setGalleryCRestricted(
    museumData.galleryCRestricted,
  );

  setLockdown(false);

  setAlertAcknowledged(false);
}

  return (
    <div className="articol-dashboard">
      <Header
        project={museumData.project}
        systemStatus={overallStatus}
      />

      <main className="articol-main">
        <section className="dashboard-intro">
          <div>
            <p className="small-label">
              CENTRAL ARCHIVE SECURITY OVERVIEW
            </p>

            <h2>Real-Time Artifact Archive Operations</h2>

            <p>
              Monitoring protected artifacts, archive-zone access,
              environmental conditions and correlated security events.
            </p>
          </div>

          <div className={`risk-index ${overallStatus.toLowerCase()}`}>
            <div className="risk-index-heading">
              <span>ARTICOL Risk Index</span>

              <strong>
                {overallThreat}
                <small>/100</small>
              </strong>
            </div>

            <div className="risk-index-track">
              <div
                className="risk-index-fill"
                style={{ width: `${overallThreat}%` }}
              />
            </div>

            <p>
              {overallStatus === "SAFE" &&
                "Normal archive security conditions"}

              {overallStatus === "WARNING" &&
                "Suspicious archive activity requires monitoring"}

              {overallStatus === "CRITICAL" &&
                "Immediate archive-security response required"}
            </p>
          </div>
        </section>

        <section className="articol-summary-grid">
          <article className="articol-summary-card">
            <span className="summary-card-icon">🛡️</span>

            <div>
              <p>Security Status</p>

              <h3
                className={`status-text ${overallStatus.toLowerCase()}`}
              >
                {overallStatus}
              </h3>

              <small>
                Maximum threat score: {overallThreat}
              </small>
            </div>
          </article>

          <article className="articol-summary-card">
            <span className="summary-card-icon">👥</span>

            <div>
              <p>Authorized Occupancy</p>

              <h3>
                {museumData.system.occupancyCount}

                <small className="occupancy-limit">
                  /{museumData.system.maximumOccupancy}
                </small>
              </h3>

              <small>
                Personnel currently inside the archive
              </small>
            </div>
          </article>

          <article className="articol-summary-card">
            <span className="summary-card-icon">🚨</span>

            <div>
              <p>Active Incidents</p>
              <h3>{activeIncidents}</h3>

              <small>
                {alertAcknowledged
                  ? "Alert acknowledged"
                  : "Awaiting operator review"}
              </small>
            </div>
          </article>

          <article className="articol-summary-card">
            <span className="summary-card-icon">
              {galleryCRestricted ? "🔒" : "🔓"}
            </span>

            <div>
              <p>Vault C Access</p>

              <h3 className="gallery-mode-text">
                {galleryCRestricted ? "RESTRICTED" : "STANDARD"}
              </h3>

              <small>
                {galleryCRestricted
                  ? "Authorized archive personnel only"
                  : "Standard archive access enabled"}
              </small>
            </div>
          </article>
        </section>

        <section className="dashboard-workspace">
          <div className="dashboard-main-column">
            <MuseumMap
              galleries={galleries}
              onOpenGallery={onOpenGallery}
            />

            <section className="live-event-panel">
              <div className="panel-heading">
                <div>
                  <p className="small-label">
                    LIVE EVENT STREAM
                  </p>

                  <h2>Archive System Activity</h2>
                </div>

                <span className="stream-status">
                  <i />
                  STREAMING
                </span>
              </div>

              <div className="event-stream-list">
                {museumData.systemEvents.map((event, index) => (
                  <article
                    className="stream-event"
                    key={`${event.time}-${event.title}-${index}`}
                  >
                    <time>{event.time}</time>

                    <span
                      className={`stream-event-dot ${event.type.toLowerCase()}`}
                    />

                    <div>
                      <strong>{event.title}</strong>
                      <p>{event.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="controller-status-panel">
              <div className="panel-heading">
                <div>
                  <p className="small-label">DEVICE NETWORK</p>
                  <h2>Archive Zone Controllers</h2>
                </div>

                <span className="controller-count">
                  {
                    galleries.filter(
                      (gallery) => gallery.espOnline,
                    ).length
                  }
                  /{galleries.length} ONLINE
                </span>
              </div>

              <div className="controller-list">
                {galleries.map((gallery) => (
                  <article
                    className="controller-item"
                    key={gallery.id}
                  >
                    <div className="controller-signal">
                      <span
                        className={
                          gallery.espOnline
                            ? "signal-ring online"
                            : "signal-ring offline"
                        }
                      >
                        📡
                      </span>
                    </div>

                    <div>
                      <strong>
                        {gallery.name} Controller
                      </strong>

                      <p>
                        ESP32-{gallery.id} · Archive sensor gateway
                      </p>
                    </div>

                    <span
                      className={
                        gallery.espOnline
                          ? "controller-state online"
                          : "controller-state offline"
                      }
                    >
                      {gallery.espOnline
                        ? "ONLINE"
                        : "OFFLINE"}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="environment-panel">
              <div className="panel-heading">
                <div>
                  <p className="small-label">
                    ENVIRONMENTAL MONITORING
                  </p>

                  <h2>Archive Conditions</h2>
                </div>

                <span className="live-reading-badge">
                  LIVE READINGS
                </span>
              </div>

              <div className="environment-gauges">
                <Gauge
                  label="Average Temperature"
                  value={Number(
                    averageTemperature.toFixed(1),
                  )}
                  min={0}
                  max={50}
                  unit="°C"
                  helperText="Archive facility average"
                />

                <Gauge
                  label="Average Humidity"
                  value={Number(
                    averageHumidity.toFixed(1),
                  )}
                  min={0}
                  max={100}
                  unit="%"
                  helperText="Archive facility average"
                />
              </div>
            </section>

            <ManualControls
              galleryCRestricted={galleryCRestricted}
              lockdown={lockdown}
              alertAcknowledged={alertAcknowledged}
              onGalleryCModeChange={
                handleGalleryCModeChange
              }
              onLockdownChange={
                handleLockdownChange
              }
              onAcknowledge={() =>
                setAlertAcknowledged(true)
              }
              onReset={resetDashboard}
            />

            <section className="ai-analysis-panel">
              <div className="ai-panel-header">
                <div>
                  <p className="small-label">
                    ARTICOL INTELLIGENCE
                  </p>

                  <h2>Threat Analysis</h2>
                </div>

                <span className="ai-indicator">
                  <i />
                  ACTIVE
                </span>
              </div>

              <div className="analysis-status">
                <span
                  className={`analysis-status-icon ${overallStatus.toLowerCase()}`}
                >
                  ◈
                </span>

                <div>
                  <strong>
                    {museumData.analysis.title}
                  </strong>

                  <p>
                    Automated interpretation of archive-zone sensor
                    conditions and cross-zone activity.
                  </p>
                </div>
              </div>

              <div className="analysis-observations">
                {museumData.analysis.observations.map(
                  (observation, index) => (
                    <div
                      className="analysis-observation"
                      key={`${observation.text}-${index}`}
                    >
                      <span
                        className={`observation-dot ${observation.status.toLowerCase()}`}
                      />

                      <p>{observation.text}</p>
                    </div>
                  ),
                )}
              </div>

              <div className="analysis-recommendation">
                <span>RECOMMENDATION</span>

                <p>
                  {museumData.analysis.recommendation}
                </p>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;