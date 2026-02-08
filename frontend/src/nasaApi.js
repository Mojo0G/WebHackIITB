// src/services/nasaApi.js

export async function fetchNeoFeed() {
  // Simulate network delay (optional, looks realistic)
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      id: "neo-1",
      name: "2026 AB",
      diameter: 120, // meters
      missDistance: 300000, // km
      hazardous: true
    },
    {
      id: "neo-2",
      name: "2026 CD",
      diameter: 60,
      missDistance: 1200000,
      hazardous: false
    },
    {
      id: "neo-3",
      name: "2026 EF",
      diameter: 250,
      missDistance: 180000,
      hazardous: true
    }
  ];
}
