import React, { useState, useEffect } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';

interface ReverseCamPageProps {
  onClose: () => void;
}

export const ReverseCamPage: React.FC<ReverseCamPageProps> = ({ onClose }) => {
  const { state } = useVehicleAPI();
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [draggingPoint, setDraggingPoint] = useState<{ zoneId: string; pointId: string } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFadingIn(false);
  }, []);

  useEffect(() => {
    if (state.gear !== 'R') {
      onClose();
    }
  }, [state.gear, onClose]);

  const handleMouseMove = () => {
    // Debug drag handler - empty
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        zIndex: 100,
        opacity: isFadingIn ? 0 : 1,
        transition: 'opacity 0.3s ease-out',
        borderRadius: '0 0 20px 0px',
      }}
    >
      {/* Rear Camera View - Left Half */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src="/reversecam.png"
          alt="Rear Camera"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Top-Down View - Right Half */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderLeft: '2px solid #444',
          cursor: draggingPoint ? 'grabbing' : 'default',
          backgroundColor: '#666',
        }}
      >
        <img
          src="/topdown.png"
          alt="Top-Down View"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            userSelect: 'none',
            pointerEvents: 'none',
            transform: 'rotate(90deg)',
          }}
        />
      </div>
    </div>
  );
};
