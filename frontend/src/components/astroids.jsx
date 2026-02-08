import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import OrbitRing from "./orbiting";

export default function AsteroidWithOrbit({ missDistance, risk }) {
  const asteroidRef = useRef();
  const angle = useRef(0);

  const SCALE = 100000;
  const radius = missDistance / SCALE;

  useFrame(() => {
    angle.current += 0.01;
    asteroidRef.current.position.x =
      Math.cos(angle.current) * radius;
    asteroidRef.current.position.z =
      Math.sin(angle.current) * radius;
  });

  return (
    <>
      <OrbitRing radius={radius} risk={risk} />

      <mesh ref={asteroidRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={risk > 70 ? "red" : "gray"}
        />
      </mesh>
    </>
  );
}
