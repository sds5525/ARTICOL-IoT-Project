function ToggleSwitch({
    checked,
    onChange,
    label,
    activeText,
    inactiveText,
    tone = "purple",
  }) {
    return (
      <div className="manual-control-row">
        <div>
          <strong>{label}</strong>
          <p>{checked ? activeText : inactiveText}</p>
        </div>
  
        <button
          type="button"
          className={`manual-toggle ${checked ? "active" : ""} ${tone}`}
          onClick={() => onChange(!checked)}
          aria-pressed={checked}
          aria-label={label}
        >
          <span />
        </button>
      </div>
    );
  }
  
  function ManualControls({
    galleryCRestricted,
    lockdown,
    alertAcknowledged,
    onGalleryCModeChange,
    onLockdownChange,
    onAcknowledge,
    onReset,
  }) {
    return (
      <section className="manual-controls-panel">
        <div className="manual-controls-header">
          <div>
            <p className="small-label">OPERATOR ACCESS</p>
            <h2>Manual Controls</h2>
          </div>
  
          <span className="operator-badge">AUTHORIZED</span>
        </div>
  
        <ToggleSwitch
          checked={galleryCRestricted}
          onChange={onGalleryCModeChange}
          label="Gallery C access mode"
          activeText="Restricted access enabled"
          inactiveText="Public access enabled"
          tone="purple"
        />
  
        <ToggleSwitch
          checked={lockdown}
          onChange={onLockdownChange}
          label="Museum lockdown"
          activeText="Emergency lockdown active"
          inactiveText="Normal operating mode"
          tone="red"
        />
  
        <div className="manual-control-status">
          <div>
            <span>Gallery C</span>
            <strong>
              {galleryCRestricted ? "RESTRICTED" : "PUBLIC"}
            </strong>
          </div>
  
          <div>
            <span>Security mode</span>
            <strong className={lockdown ? "danger-text" : "safe-text"}>
              {lockdown ? "LOCKDOWN" : "NORMAL"}
            </strong>
          </div>
        </div>
  
        <div className="manual-control-buttons">
          <button
            type="button"
            className="acknowledge-control"
            onClick={onAcknowledge}
            disabled={alertAcknowledged}
          >
            {alertAcknowledged
              ? "Alert Acknowledged"
              : "Acknowledge Alert"}
          </button>
  
          <button
            type="button"
            className="reset-control"
            onClick={onReset}
          >
            Reset Demo
          </button>
        </div>
  
        <div className="manual-control-warning">
          <span>⚠</span>
  
          <p>
            Commands are synchronized with the
            Node-RED security controller.
          </p>
        </div>
      </section>
    );
  }
  
  export default ManualControls;