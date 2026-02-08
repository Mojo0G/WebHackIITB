// Mock asteroid data for development/testing when NASA API is unavailable
const mockAsteroids = [
  {
    "id": "2000433",
    "neo_reference_id": "2000433",
    "name": "(433) Eros",
    "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2000433",
    "absolute_magnitude_h": 10.4,
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 16.84,
        "estimated_diameter_max": 17.96
      },
      "meters": {
        "estimated_diameter_min": 16840.0,
        "estimated_diameter_max": 17960.0
      }
    },
    "is_potentially_hazardous_asteroid": false,
    "close_approach_data": [
      {
        "close_approach_date": "2026-02-08",
        "epoch_date_close_approach": 1744156800000,
        "relative_velocity": {
          "kilometers_per_second": "24.5",
          "kilometers_per_hour": "88200",
          "miles_per_hour": "54800"
        },
        "miss_distance": {
          "astronomical": "0.25",
          "kilometers": "37400000",
          "miles": "23200000"
        }
      }
    ]
  },
  {
    "id": "2023DW",
    "neo_reference_id": "2023DW",
    "name": "2023 DW",
    "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2023DW",
    "absolute_magnitude_h": 23.5,
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.042,
        "estimated_diameter_max": 0.094
      },
      "meters": {
        "estimated_diameter_min": 42.0,
        "estimated_diameter_max": 94.0
      }
    },
    "is_potentially_hazardous_asteroid": false,
    "close_approach_data": [
      {
        "close_approach_date": "2026-02-15",
        "epoch_date_close_approach": 1744761600000,
        "relative_velocity": {
          "kilometers_per_second": "18.3",
          "kilometers_per_hour": "65880",
          "miles_per_hour": "40920"
        },
        "miss_distance": {
          "astronomical": "0.045",
          "kilometers": "6730000",
          "miles": "4180000"
        }
      }
    ]
  },
  {
    "id": "2022AP7",
    "neo_reference_id": "2022AP7",
    "name": "2022 AP7",
    "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2022AP7",
    "absolute_magnitude_h": 17.8,
    "estimated_diameter": {
      "kilometers": {
        "estimated_diameter_min": 0.61,
        "estimated_diameter_max": 1.37
      },
      "meters": {
        "estimated_diameter_min": 610.0,
        "estimated_diameter_max": 1370.0
      }
    },
    "is_potentially_hazardous_asteroid": true,
    "close_approach_data": [
      {
        "close_approach_date": "2026-02-20",
        "epoch_date_close_approach": 1745193600000,
        "relative_velocity": {
          "kilometers_per_second": "22.1",
          "kilometers_per_hour": "79560",
          "miles_per_hour": "49400"
        },
        "miss_distance": {
          "astronomical": "0.32",
          "kilometers": "47800000",
          "miles": "29700000"
        }
      }
    ]
  }
];

module.exports = { mockAsteroids };
