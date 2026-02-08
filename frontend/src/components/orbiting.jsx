export default function OrbitRing({ radius, risk }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial
        color={risk > 70 ? "red" : "white"}
        wireframe
        opacity={0.6}
        transparent
      />
    </mesh>
  );
}
