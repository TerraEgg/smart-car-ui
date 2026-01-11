import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import './CarModel3D.css';

interface CarModel3DProps {
  isEngineRunning: boolean;
}

let setIsLoadingRef: ((value: boolean) => void) | null = null;

function CarModel() {
  const { scene } = useGLTF('/2025_bmw_m4_competition.glb');
  
  useEffect(() => {
    // Model is ready as soon as this component mounts
    if (setIsLoadingRef) {
      setIsLoadingRef(false);
    }
  }, []);
  
  return (
    <primitive 
      object={scene} 
      scale={40} 
      position={[0.5, 0, 0]} 
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}

export const CarModel3D: React.FC<CarModel3DProps> = ({ isEngineRunning }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoadingRef = setIsLoading;
    
    if (isEngineRunning) {
      setIsLoading(true);
    }
    
    return () => {
      setIsLoadingRef = null;
    };
  }, [isEngineRunning]);

  if (!isEngineRunning) {
    return null;
  }

  return (
    <div
      className="car-model-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(242, 210, 220, 0.3)',
            backdropFilter: 'blur(8px)',
            zIndex: 50,
            borderRadius: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                border: '4px solid rgba(107, 74, 90, 0.2)',
                borderTop: '4px solid #6b4a5a',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <div
              style={{
                fontSize: '14px',
                color: '#6b4a5a',
                fontWeight: '500',
              }}
            >
              Loading 3D Model...
            </div>
          </div>
        </div>
      )}
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [1.99, 1, 1.51], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 15, 8]} intensity={1.2} />
        <directionalLight position={[-10, -8, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <CarModel />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          makeDefault
          minDistance={1.0}
          maxDistance={3.5}
        />
      </Canvas>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
