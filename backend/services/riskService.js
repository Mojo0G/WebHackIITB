/**
 * Calculates Risk Score (0-100)
 * Logic based on:
 * 1. Is Hazardous? (Base 50 pts)
 * 2. Size (Max 30 pts)
 * 3. Proximity (Max 20 pts)
 */
exports.calculateRiskScore = (asteroid) => {
  let score = 0;

  // 1. Hazardous Status (0 or 50)
  if (asteroid.is_potentially_hazardous_asteroid) {
    score += 50;
  }

  // 2. Diameter Impact (0-30)
  // Avg diameter in km
  const diameter = (asteroid.estimated_diameter.kilometers.estimated_diameter_min + 
                    asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2;
  // Cap diameter score at 30 (assuming 2km is "huge" for this scale)
  const sizeScore = Math.min((diameter * 15), 30);
  score += sizeScore;

  // 3. Distance Factor (0-20)
  // Closer = Higher Risk. Let's say < 1,000,000 km is max risk add
  const distanceKm = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers);
  
  if (distanceKm < 1000000) score += 20;
  else if (distanceKm < 5000000) score += 10;
  else if (distanceKm < 10000000) score += 5;

  return Math.min(Math.round(score), 100);
};

exports.getRiskColor = (score) => {
  if (score >= 80) return '#FF4D4D'; // Critical (Red)
  if (score >= 50) return '#FF9F1C'; // High (Orange)
  if (score >= 20) return '#FFD166'; // Medium (Yellow)
  return '#06D6A0'; // Low (Green)
};
