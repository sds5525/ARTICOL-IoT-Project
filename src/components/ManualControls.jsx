import { useEffect, useState } from "react";

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
  }) {
    const [acknowledgeDisabled, setAcknowledgeDisabled] = useState(false);

    useEffect(() => {
      if (!acknowledgeDisabled) {
        return undefined;
      }

      const timeoutId = setTimeout(() => {
        setAcknowledgeDisabled(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }, [acknowledgeDisabled]);

    function handleAcknowledgeClick() {
      setAcknowledgeDisabled(true);
      onAcknowledge();
    }

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
            onClick={handleAcknowledgeClick}
            disabled={acknowledgeDisabled}
          >
            {alertAcknowledged
              ? "Alert Acknowledged"
              : "Acknowledge Alert"}
          </button>
        </div>
      </section>
    );
  }
  
  export default ManualControls;