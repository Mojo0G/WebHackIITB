import { useEffect, useState } from "react";
import { fetchNeoFeed } from "../services/nasaApi";
import { calculateRiskScore } from "../utils/riskscore";
import AsteroidWithOrbit from "./astroids";
import { Canvas } from "@react-three/fiber";
import Earth from "./earth";

export default function Scene() {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    fetchNeoFeed().then(data => {
      const enriched = data.map(a => ({
        ...a,
        riskScore: calculateRiskScore(a.diameter, a.missDistance)
      }));
      setAsteroids(enriched);
    });
  }, []);

  return (
    <Canvas camera={{ position: [0, 10, 25] }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      <Earth />

      {asteroids.map(a => (
        <AsteroidWithOrbit
          key={a.id}
          missDistance={a.missDistance}
          risk={a.riskScore}
        />
      ))}
    </Canvas>
  );
}
