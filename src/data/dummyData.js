export const museumData = {
  project: {
    name: "BIOVAULT",
    subtitle: "Smart Biological Specimen Preservation & Access System",
    descriptor: "Specimen Intelligence & Threat Correlation Operations Layer",
    location: "Bengaluru Archive Facility, India",
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
      name: "Specimen Archive A",
      collection: "Biological Tissue Specimen Repository",
      icon: "🔬",
    },

    {
      id: "B",
      name: "Specimen Archive B",
      collection: "Research Specimen Repository",
      icon: "🧫",
    },

    {
      id: "C",
      name: "Specimen Archive C",
      collection: "Specialized Biological Specimen Repository",
      icon: "🧬",
    },
  ],
};