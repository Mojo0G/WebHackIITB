import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// --- Loading Placeholder (Prevents Black Screen) ---
const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-neon-cyan font-rajdhani font-bold tracking-widest text-lg">INITIALIZING SENSORS...</span>
    </div>
  </Html>
);

// --- 1. Earth (High Visibility) ---
const Earth = () => {
  const earthRef = useRef();
  
  // Using standard textures
  const [colorMap, cloudsMap] = useLoader(TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.001;
  });

  return (
    <group>
      {/* Base Earth - High Emissive for "Lighter" look */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          metalness={0.4} 
          roughness={0.7}
          emissive="#1a2b4a" // Blue glow from within
          emissiveIntensity={0.8} // Very bright
        />
      </mesh>

      {/* Cloud Atmosphere - Bright White */}
      <mesh scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap} 
          transparent 
          opacity={0.4} 
          blending={THREE.AdditiveBlending} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blue Halo Glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

// --- 2. Asteroid & Orbit (Prominent) ---
const AsteroidSystem = () => {
  const asteroidRef = useRef();
  const orbitRef = useRef();
  const orbitRadius = 7;

  // Rock texture for asteroid
  const rockTexture = useLoader(TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg');

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.3;
    
    // Move Asteroid
    asteroidRef.current.position.x = Math.sin(t) * orbitRadius;
    asteroidRef.current.position.z = Math.cos(t) * orbitRadius;
    
    // Rotate Asteroid
    asteroidRef.current.rotation.x += 0.01;
    asteroidRef.current.rotation.y += 0.02;

    // Pulse Orbit opacity
    if(orbitRef.current) {
        orbitRef.current.material.opacity = 0.3 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Prominent Orbit Line (Tube instead of Ring for visibility) */}
      <mesh ref={orbitRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitRadius, 0.05, 16, 100]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
      </mesh>

      {/* Textured Asteroid Target */}
      <mesh ref={asteroidRef} position={[orbitRadius, 0, 0]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial 
            map={rockTexture} 
            color="#a0a0a0"
            roughness={0.8}
            metalness={0.2}
        />
        
        {/* Red Target Overlay */}
        <mesh scale={[1.2, 1.2, 1.2]}>
             <dodecahedronGeometry args={[0.4, 0]} />
             <meshBasicMaterial color="red" wireframe transparent opacity={0.3} />
        </mesh>

        {/* HTML Label */}
        <Html position={[0, 0.6, 0]} center distanceFactor={12}>
          <div className="flex flex-col items-center pointer-events-none">
            <div className="w-8 h-8 border border-red-500 rounded-full flex items-center justify-center animate-ping absolute opacity-50"></div>
            <div className="bg-red-900/80 text-red-100 px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/50 backdrop-blur-sm whitespace-nowrap">
              TARGET LOCKED
            </div>
            <div className="h-4 w-[1px] bg-red-500/50"></div>
          </div>
        </Html>
      </mesh>
    </group>
  );
};

// --- 3. Main Scene ---
const EarthOrbit = () => {
  return (
    // FIX: Forced height and width to ensure canvas renders
    <div style={{ width: '100%', height: '600px', position: 'relative' }} className="rounded-3xl overflow-hidden shadow-2xl border border-cosmic-border bg-black">
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg backdrop-blur-md border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white/90 font-rajdhani font-bold tracking-widest text-xs">LIVE FEED</span>
        </div>
      </div>

      <Canvas camera={{ position: [0, 6, 12], fov: 45 }} dpr={[1, 2]}>
        {/* FIX: Massive Ambient Light to prevent black screen */}
        <ambientLight intensity={1.5} color="#ffffff" />
        
        {/* Directional Light (Sun) */}
        <directionalLight position={[10, 5, 5]} intensity={3} color="#ffeedd" />
        
        {/* Fill Light (Blue from space) */}
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4444ff" />

        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Suspense fallback={<LoadingFallback />}>
          <Earth />
          <AsteroidSystem />
        </Suspense>
        
        <OrbitControls 
            enablePan={false} 
            minDistance={5} 
            maxDistance={20}
            autoRotate={true}
            autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default EarthOrbit;