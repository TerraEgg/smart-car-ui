import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import './CarModel3D.css';

interface CarModel3DProps {
  isEngineRunning: boolean;
}

function CarModel() {
  const { scene } = useGLTF('/2025_bmw_m4_competition.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={1.5} 
      position={[0, -0.5, 0]} 
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

// Preload the model to avoid lag
useGLTF.preload('/2025_bmw_m4_competition.glb');

export const CarModel3D: React.FC<CarModel3DProps> = ({ isEngineRunning }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mark as ready after initial mount to ensure Canvas is set up
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="car-model-container" 
      style={{ 
        visibility: isEngineRunning ? 'visible' : 'hidden',
        opacity: isEngineRunning ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[3, 2, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <Suspense fallback={<LoadingFallback />}>
          {isReady && <CarModel />}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
