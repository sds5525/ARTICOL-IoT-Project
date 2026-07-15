import { useMemo, useState } from "react";
import Header from "../components/Header";
import Gauge from "../components/Gauge";
import MuseumMap from "../components/MuseumMap";
import ManualControls from "../components/ManualControls";
import { museumData } from "../data/dummyData";

function Dashboard({
  galleries,
  setGalleries,
  lockdown,
  setLockdown,
  criticalLatched,
  setCriticalLatched,
  alertAcknowledged,
  setAlertAcknowledged,
  systemEvents,
  threatAnalysis,
  onOpenGallery,
}) {
  const [galleryCRestricted, setGalleryCRestricted] = useState(
    museumData.galleryCRestricted,
  );

  const overallThreat = useMemo(() => {
    return Math.max(...galleries.map((gallery) => gallery.threatScore));
  }, [galleries]);

  const overallStatus = useMemo(() => {
    const currentCriticalCondition =
      lockdown ||
      galleries.some(
        (gallery) =>
          gallery.status === "CRITICAL" || gallery.threatScore >= 70,
      );

    if (criticalLatched || currentCriticalCondition) {
      return "CRITICAL";
    }

    if (overallThreat >= 35) {
      return "WARNING";
    }

    return "SAFE";
  }, [criticalLatched, galleries, lockdown, overallThreat]);

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

  const activeIncidentMessage = alertAcknowledged
    ? "Alert acknowledged"
    : "Awaiting operator review";

  const galleryCModeLabel = galleryCRestricted
    ? "RESTRICTED"
    : "STANDARD";

  const overallStatusMessage =
    overallStatus === "SAFE"
      ? "Normal archive security conditions"
      : overallStatus === "WARNING"
        ? "Suspicious archive activity requires monitoring"
        : "Immediate archive-security response required";

  const operatorFieldValue = (value) => value ?? "--";

  const hasSystemEvents = systemEvents.length > 0;

  const onlineControllerCount = galleries.filter(
    (gallery) => gallery.espOnline,
  ).length;

  async function handleGalleryCModeChange(restricted) {
    setGalleryCRestricted(restricted);

    try {
      await fetch("http://localhost:1880/api/galleryC/mode", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          restricted,
        }),
      });
    } catch (error) {
      console.error(error);
    }

    setGalleries((currentGalleries) =>
      currentGalleries.map((gallery) =>
        gallery.id === "C"
          ? {
              ...gallery,
              accessMode: restricted ? "RESTRICTED" : "STANDARD",
            }
          : gallery,
      ),
    );
  }

  function handleLockdownChange(enabled) {
    setLockdown(enabled);

    if (enabled) {
      setCriticalLatched(true);
      setAlertAcknowledged(false);
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
  }

  return (
    <div className="articol-dashboard">
      <Header
        project={museumData.project}
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

            <p>{overallStatusMessage}</p>
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
                {activeIncidentMessage}
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
                {galleryCModeLabel}
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
                {hasSystemEvents ? (
                  systemEvents.map((event, index) => (
                    <article
                      className="stream-event"
                      key={`${event.time ?? index}-${event.title ?? "event"}-${index}`}
                    >
                      <time>{event.time ?? "--"}</time>

                      <span
                        className={`stream-event-dot ${(event.type || "info").toLowerCase()}`}
                      />

                      <div>
                        <strong>{event.title ?? "--"}</strong>
                        <p>{event.description ?? "--"}</p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="panel-empty-state">No recent events</p>
                )}
              </div>
            </section>

            <section className="controller-status-panel">
              <div className="panel-heading">
                <div>
                  <p className="small-label">DEVICE NETWORK</p>
                  <h2>Archive Zone Controllers</h2>
                </div>

                <span className="controller-count">
                  {onlineControllerCount}
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
                        {gallery.name}
                      </strong>

                      <p>
                        ESP32-{gallery.id} {gallery.espOnline ? "ONLINE" : "OFFLINE"}
                      </p>

                      <small>
                        Last update: {operatorFieldValue(gallery.lastUpdateTime)}
                      </small>
                    </div>

                    <span
                      className={
                        gallery.espOnline
                          ? "controller-state online"
                          : "controller-state offline"
                      }
                    >
                      {gallery.espOnline ? "CONNECTED" : "DISCONNECTED"}
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
              onAcknowledge={() => {
                setLockdown(false);
                setCriticalLatched(false);
                setAlertAcknowledged(true);
              }}
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
                <div>
                  <strong>Current Threat Level</strong>
                  <p>{operatorFieldValue(threatAnalysis.currentThreatLevel)}</p>
                </div>
              </div>

              <div className="analysis-field-list">
                <div className="analysis-field">
                  <span>Primary Trigger</span>
                  <strong>{operatorFieldValue(threatAnalysis.primaryTrigger)}</strong>
                </div>

                <div className="analysis-field">
                  <span>Affected Archive</span>
                  <strong>{operatorFieldValue(threatAnalysis.affectedArchive)}</strong>
                </div>

                <div className="analysis-field">
                  <span>Recommended Immediate Action</span>
                  <strong>{operatorFieldValue(threatAnalysis.recommendedImmediateAction)}</strong>
                </div>

                <div className="analysis-field">
                  <span>System Decision</span>
                  <strong>{operatorFieldValue(threatAnalysis.systemDecision)}</strong>
                </div>

                <div className="analysis-field analysis-field-wide">
                  <span>Operator Action Required</span>
                  <strong>{operatorFieldValue(threatAnalysis.operatorActionRequired)}</strong>
                </div>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;