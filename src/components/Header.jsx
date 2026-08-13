import { useEffect, useState } from "react";

function Header({ project }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="articol-header">
      <div className="brand-block">
        <div className="brand-mark">{project.name ? project.name[0] : "B"}</div>

        <div>
          <p className="brand-name">{project.name}</p>
          <h1>{project.subtitle}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="time-block">
          <strong>{formattedTime}</strong>
          <span>{formattedDate}</span>
          <small>{project.location}</small>
        </div>
      </div>
    </header>
  );
}

export default Header;