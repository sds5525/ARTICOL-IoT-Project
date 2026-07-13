function CorrelationEngine({ galleries }) {
  const galleryA = galleries.find((gallery) => gallery.id === "A");
  const galleryB = galleries.find((gallery) => gallery.id === "B");
  const galleryC = galleries.find((gallery) => gallery.id === "C");

  const correlationActive =
    galleryB?.motion ||
    galleryC?.doorOpen ||
    galleryC?.artifactMoved;

  return (
    <section
      className={`correlation-panel ${
        correlationActive ? "active" : "normal"
      }`}
    >
      <div className="correlation-header">
        <div>
          <p className="small-label">EVENT CORRELATION ENGINE</p>
          <h2>Cross-Gallery Analysis</h2>
        </div>

        <span
          className={`correlation-state ${
            correlationActive ? "active" : "normal"
          }`}
        >
          <i />
          {correlationActive ? "CORRELATION FOUND" : "NO CORRELATION"}
        </span>
      </div>

      <div className="correlation-flow">
        <article className={`correlation-node ${galleryA.status.toLowerCase()}`}>
          <div className="correlation-node-top">
            <span className="correlation-gallery-id">A</span>
            <strong>Gallery A</strong>
          </div>

          <div className="correlation-node-icon">
            {galleryA.motion ? "◉" : "✓"}
          </div>

          <span>
            {galleryA.motion ? "Motion detected" : "Normal conditions"}
          </span>

          <small>{galleryA.threatScore} threat points</small>
        </article>

        <div className="correlation-link">
          <span />
          <strong>EVENT CHECK</strong>
          <span />
        </div>

        <article className={`correlation-node ${galleryB.status.toLowerCase()}`}>
          <div className="correlation-node-top">
            <span className="correlation-gallery-id">B</span>
            <strong>Gallery B</strong>
          </div>

          <div className="correlation-node-icon">
            {galleryB.motion ? "◉" : "✓"}
          </div>

          <span>
            {galleryB.motion ? "Abnormal motion" : "Normal conditions"}
          </span>

          <small>{galleryB.threatScore} threat points</small>
        </article>

        <div
          className={`correlation-link ${
            correlationActive ? "active" : ""
          }`}
        >
          <span />
          <strong>
            {correlationActive ? "MATCH FOUND" : "EVENT CHECK"}
          </strong>
          <span />
        </div>

        <article
          className={`correlation-node ${galleryC.status.toLowerCase()}`}
        >
          <div className="correlation-node-top">
            <span className="correlation-gallery-id">C</span>
            <strong>Gallery C</strong>
          </div>

          <div className="correlation-node-icon">
            {galleryC.accessMode === "RESTRICTED" ? "🔒" : "🔓"}
          </div>

          <span>
            {galleryC.accessMode === "RESTRICTED"
              ? "Restricted access"
              : "Public access"}
          </span>

          <small>{galleryC.threatScore} threat points</small>
        </article>
      </div>

      <div className="correlation-result">
        <div className="correlation-result-icon">
          {correlationActive ? "⚠" : "✓"}
        </div>

        <div>
          <span>ARTICOL CORRELATION RESULT</span>

          <strong>
            {correlationActive
              ? "Suspicious activity identified across monitored areas"
              : "No connected threat sequence detected"}
          </strong>

          <p>
            {correlationActive
              ? "Gallery B motion is being cross-validated against Gallery A activity and Gallery C access conditions."
              : "Gallery events currently appear independent and within normal operating conditions."}
          </p>
        </div>

        <div className="correlation-confidence">
          <span>Confidence</span>
          <strong>{correlationActive ? "87%" : "96%"}</strong>
        </div>
      </div>
    </section>
  );
}

export default CorrelationEngine;