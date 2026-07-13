export const museumData = {
    project: {
      name: "ARTICOL",
      subtitle: "Smart Museum Security & Threat Correlation System",
      location: "Bengaluru, India",
      mode: "DEMO MODE",
    },
  
    system: {
      status: "WARNING",
      overallThreat: 46,
      visitorCount: 24,
      activeIncidentCount: 1,
      averageTemperature: 24.6,
      averageHumidity: 58,
    },
  
    galleryCRestricted: true,
  
    galleries: [
      {
        id: "A",
        name: "Gallery A",
        collection: "Ancient Collection",
        icon: "🏺",
        accessMode: "PUBLIC",
        status: "SAFE",
        threatScore: 12,
        temperature: 23.8,
        humidity: 54,
        motion: false,
        doorOpen: false,
        artifactMoved: false,
        espOnline: true,
  
        threatFactors: [
          {
            label: "Normal operating conditions",
            points: 0,
          },
        ],
  
        recentEvents: [
          {
            time: "12:28 PM",
            title: "Sensor heartbeat received",
            description: "Gallery A ESP32 is operating normally",
            type: "SAFE",
          },
          {
            time: "12:21 PM",
            title: "Artifact verified secure",
            description: "No movement detected",
            type: "SAFE",
          },
        ],
      },
  
      {
        id: "B",
        name: "Gallery B",
        collection: "Modern Art Collection",
        icon: "🖼️",
        accessMode: "PUBLIC",
        status: "WARNING",
        threatScore: 46,
        temperature: 25.2,
        humidity: 59,
        motion: true,
        doorOpen: false,
        artifactMoved: false,
        espOnline: true,
  
        threatFactors: [
          {
            label: "Motion detected",
            points: 25,
          },
          {
            label: "Repeated activity pattern",
            points: 15,
          },
          {
            label: "Activity duration",
            points: 6,
          },
        ],
  
        recentEvents: [
          {
            time: "12:30 PM",
            title: "Motion detected",
            description: "Movement detected near the modern art display",
            type: "WARNING",
          },
          {
            time: "12:29 PM",
            title: "Threat score updated",
            description: "Threat score increased from 18 to 46",
            type: "WARNING",
          },
          {
            time: "12:25 PM",
            title: "Sensor heartbeat received",
            description: "Gallery B ESP32 is online",
            type: "SAFE",
          },
        ],
      },
  
      {
        id: "C",
        name: "Gallery C",
        collection: "Exotic Artifact Vault",
        icon: "👑",
        accessMode: "RESTRICTED",
        status: "SAFE",
        threatScore: 8,
        temperature: 24.9,
        humidity: 61,
        motion: false,
        doorOpen: false,
        artifactMoved: false,
        espOnline: true,
  
        threatFactors: [
          {
            label: "Restricted access active",
            points: 4,
          },
          {
            label: "No unauthorized activity",
            points: 4,
          },
        ],
  
        recentEvents: [
          {
            time: "12:27 PM",
            title: "Restricted mode confirmed",
            description: "Gallery C access is limited to authorized personnel",
            type: "INFO",
          },
          {
            time: "12:20 PM",
            title: "Door lock verified",
            description: "Electronic lock is functioning correctly",
            type: "SAFE",
          },
        ],
      },
    ],
  
    systemEvents: [
      {
        time: "12:30 PM",
        title: "Gallery B warning",
        description: "Motion activity increased the threat score",
        type: "WARNING",
      },
      {
        time: "12:27 PM",
        title: "Gallery C restricted mode",
        description: "Restricted access remains active",
        type: "INFO",
      },
      {
        time: "12:25 PM",
        title: "All ESP32 devices online",
        description: "Three gallery controllers responding",
        type: "SAFE",
      },
    ],
  
    analysis: {
      title: "Current Situation",
      observations: [
        {
          status: "SAFE",
          text: "Gallery A is operating normally.",
        },
        {
          status: "WARNING",
          text: "Gallery B shows abnormal motion activity.",
        },
        {
          status: "SAFE",
          text: "Gallery C remains secure in restricted mode.",
        },
      ],
      recommendation:
        "Continue monitoring Gallery B and verify the detected movement.",
    },
  
    demoScenarios: [
      {
        id: "all-safe",
        label: "All Safe",
      },
      {
        id: "gallery-b-warning",
        label: "Gallery B Suspicious Activity",
      },
      {
        id: "gallery-c-intrusion",
        label: "Gallery C Restricted Intrusion",
      },
      {
        id: "correlated-threat",
        label: "Multi-Gallery Correlated Threat",
      },
      {
        id: "esp-offline",
        label: "ESP32 Offline",
      },
    ],
  };