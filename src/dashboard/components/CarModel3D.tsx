// Interactive 3D vehicle visualization component using Three.js to show real-time state of windows and wheel rotation.
import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Preload } from "@react-three/drei";
import { useVehicleAPI } from "../../api/VehicleContext";
import "./CarModel3D.css";
interface CarModel3DProps {
  isEngineRunning: boolean;
}
function CarModel({ onLoaded }: { onLoaded: () => void }) {
  const gltf = useGLTF("/2025_bmw_m4_competition.glb");
  const { state } = useVehicleAPI();
  const meshRefsRef = useRef<any[]>([]);
  const wheelsRef = useRef<any[]>([]);
  const offsetAppliedRef = useRef(false);
  const wheelRotationRef = useRef(0);
  useEffect(() => {
    if (!gltf.scene || offsetAppliedRef.current) return;
    const windowMeshNames = {
      frontRight: "m4window_Mesh_4_car_glass_m4car_glass1_0",
      frontLeft: "m4left_door_Mesh_2_car_body_m4car_glass1_0",
    };
    gltf.scene.traverse((child: any) => {
      if (child.name === windowMeshNames.frontRight) {
        meshRefsRef.current.push({
          name: "frontRight",
          mesh: child,
          originalPosition: child.position.clone(),
          originalScale: child.scale.clone(),
        });
        console.log("Found right window mesh:", child.name);
      } else if (child.name === windowMeshNames.frontLeft) {
        meshRefsRef.current.push({
          name: "frontLeft",
          mesh: child,
          originalPosition: child.position.clone(),
          originalScale: child.scale.clone(),
        });
        console.log("Found left window mesh:", child.name);
      }
      if (
        (child.isMesh && child.name.includes("Tire")) ||
        child.name.includes("Rim") ||
        child.name.includes("TireBlur") ||
        child.name.includes("BrakeDisc") ||
        child.name.includes("TNRRims")
      ) {
        wheelsRef.current.push({
          name: child.name,
          mesh: child,
        });
      }
    });
    console.log("Total wheel meshes found:", wheelsRef.current.length);
    wheelsRef.current.forEach((w) => console.log("Wheel mesh:", w.name));
    offsetAppliedRef.current = true;
  }, [gltf]);
  useFrame(() => {
    if (meshRefsRef.current.length > 0) {
      meshRefsRef.current.forEach((ref) => {
        const slideDistance = 0.5;
        const slideSpeed = 0.02;
        if (ref.name === "frontRight") {
          const targetZ = state.windows.frontRight
            ? ref.originalPosition.z - slideDistance
            : ref.originalPosition.z;
          if (Math.abs(ref.mesh.position.z - targetZ) > 0.001) {
            ref.mesh.position.z += (targetZ - ref.mesh.position.z) * slideSpeed;
          } else {
            ref.mesh.position.z = targetZ;
          }
        } else if (ref.name === "frontLeft") {
          const targetZ = state.windows.frontLeft
            ? ref.originalPosition.z - slideDistance
            : ref.originalPosition.z;
          if (Math.abs(ref.mesh.position.z - targetZ) > 0.001) {
            ref.mesh.position.z += (targetZ - ref.mesh.position.z) * slideSpeed;
          } else {
            ref.mesh.position.z = targetZ;
          }
        }
      });
    }
    if (wheelsRef.current.length > 0) {
      const rotationPerFrame = (state.speed / 100) * 0.15;
      wheelRotationRef.current += rotationPerFrame;
      console.log(
        "Speed:",
        state.speed,
        "Rotation per frame:",
        rotationPerFrame,
        "Total rotation:",
        wheelRotationRef.current
      );
      wheelsRef.current.forEach((wheel) => {
        if (wheel.mesh) {
          wheel.mesh.rotation.x = wheelRotationRef.current;
        }
      });
    }
  });
  useEffect(() => {
    onLoaded();
  }, [gltf, onLoaded]);
  return (
    <primitive
      object={gltf.scene}
      scale={40}
      position={[0.5, 0, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  );
}
function SceneContent({ onLoaded }: { onLoaded: () => void }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 8]} intensity={1.2} />
      <directionalLight position={[-10, -8, -5]} intensity={0.5} />
      <Suspense fallback={null}>
        <CarModel onLoaded={onLoaded} />
      </Suspense>
      <Preload all />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
        makeDefault
        minDistance={1.0}
        maxDistance={3.5}
      />
    </>
  );
}
export const CarModel3D: React.FC<CarModel3DProps> = ({ isEngineRunning }) => {
  const [isLoading, setIsLoading] = useState(true);
  const handleModelLoaded = React.useCallback(() => {
    setIsLoading(false);
  }, []);
  if (!isEngineRunning) {
    return null;
  }
  return (
    <div
      className="car-model-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(242, 210, 220, 0.3)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "4px solid rgba(107, 74, 90, 0.2)",
                borderTop: "4px solid #6b4a5a",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                color: "#6b4a5a",
                fontWeight: "500",
              }}
            >
              Loading vehicle model...
            </div>
          </div>
        </div>
      )}
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: true,
        }}
        camera={{ position: [1.99, 1, 1.51], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <SceneContent onLoaded={handleModelLoaded} />
        </Suspense>
      </Canvas>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
