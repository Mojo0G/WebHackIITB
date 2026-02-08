export function calculateRiskScore(diameter, missDistance) {
  const MIN_DIAMETER = 20;
  const MAX_DIAMETER = 1000;
  const MIN_DISTANCE = 50000;
  const MAX_DISTANCE = 7500000;

  const diameterScore = Math.min(
    Math.max((diameter - MIN_DIAMETER) / (MAX_DIAMETER - MIN_DIAMETER), 0),
    1
  );

  const distanceScore = Math.min(
    Math.max(
      1 - (missDistance - MIN_DISTANCE) / (MAX_DISTANCE - MIN_DISTANCE),
      0
    ),
    1
  );

  return Math.round((diameterScore * 0.4 + distanceScore * 0.6) * 100);
}
