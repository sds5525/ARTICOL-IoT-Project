function Gauge({
    label,
    value,
    min = 0,
    max = 100,
    unit = "",
    helperText = "",
  }) {
    const safeValue = Math.min(Math.max(value, min), max);
    const percentage = ((safeValue - min) / (max - min)) * 100;
  
    const radius = 78;
    const circumference = Math.PI * radius;
    const progress = (percentage / 100) * circumference;
  
    function getLevelClass() {
      if (percentage >= 80) {
        return "critical";
      }
  
      if (percentage >= 60) {
        return "warning";
      }
  
      return "normal";
    }
  
    const levelClass = getLevelClass();
  
    return (
      <div className={`gauge-card ${levelClass}`}>
        <div className="gauge-heading">
          <span>{label}</span>
          <strong>
            {value}
            {unit}
          </strong>
        </div>
  
        <div className="gauge-visual">
          <svg
            viewBox="0 0 200 110"
            role="img"
            aria-label={`${label}: ${value}${unit}`}
          >
            <path
              className="gauge-background"
              d="M 22 95 A 78 78 0 0 1 178 95"
            />
  
            <path
              className="gauge-progress"
              d="M 22 95 A 78 78 0 0 1 178 95"
              strokeDasharray={`${progress} ${circumference}`}
            />
          </svg>
  
          <div className="gauge-value">
            <strong>
              {value}
              {unit}
            </strong>
            <span>{helperText}</span>
          </div>
        </div>
  
        <div className="gauge-scale">
          <span>
            {min}
            {unit}
          </span>
  
          <span>
            {max}
            {unit}
          </span>
        </div>
      </div>
    );
  }
  
  export default Gauge;