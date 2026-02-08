export default function Earth() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}
