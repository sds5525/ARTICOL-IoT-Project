export const museumData = {
project: {
  name: "ARTICOL",
  subtitle: "Intelligent Artifact Archive Security System",
  descriptor: "Artifact Intelligence & Threat Correlation Operations Layer",
  location: "Bengaluru Archive Facility, India",
  mode: "DEMO MODE",
},
  
    system: {
      status: "WARNING",
      overallThreat: 46,
      occupancyCount: 24,
      maximumOccupancy: 60,
      activeIncidentCount: 1,
      averageTemperature: 24.6,
      averageHumidity: 58,
    },
  
    galleryCRestricted: true,
  
    galleries: [
      {
        id: "A",
        name: "Archive Zone A",
        collection: "Historical Ceramic Repository",
        accessMode: "STANDARD",
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
            description: "Archive Zone A controller is operating normally",
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
        name: "Archive Zone B",
        collection: "Visual Artifact Repository",
        accessMode: "STANDARD",
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
            description: "Movement detected near the visual artifact storage racks",
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
            description: "Archive Zone B controller is online",
            type: "SAFE",
          },
        ],
      },
  
      {
        id: "C",
        name: "High-Security Vault C",
        collection: "Rare and Restricted Artifact Archive",
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
            description: "Vault C access is limited to authorized archive personnel",
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
    title: "Archive Zone B warning",
    description: "Motion activity increased the archive threat score",
    type: "WARNING",
  },
  {
    time: "12:27 PM",
    title: "Vault C restricted mode",
    description: "Restricted archive access remains active",
    type: "INFO",
  },
  {
    time: "12:25 PM",
    title: "All archive controllers online",
    description: "Three archive-zone controllers are responding",
    type: "SAFE",
  },
],
  
   analysis: {
  title: "Archive Security Assessment",

  observations: [
    {
      status: "SAFE",
      text: "Archive Zone A is operating under normal storage conditions.",
    },
    {
      status: "WARNING",
      text: "Archive Zone B shows abnormal movement activity.",
    },
    {
      status: "SAFE",
      text: "High-Security Vault C remains secured in restricted mode.",
    },
  ],

  recommendation:
    "Continue monitoring Archive Zone B and verify the detected movement before authorizing further access.",
},
  
demoScenarios: [
  {
    id: "all-safe",
    label: "All Archive Zones Secure",
  },
  {
    id: "zone-b-warning",
    label: "Archive Zone B Suspicious Activity",
  },
  {
    id: "vault-c-intrusion",
    label: "Restricted Vault Intrusion",
  },
  {
    id: "correlated-threat",
    label: "Multi-Zone Correlated Threat",
  },
  {
    id: "controller-offline",
    label: "Archive Controller Offline",
  },
],
  };