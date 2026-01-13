import React, { useState, useEffect } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';

interface DetectionPoint {
  id: string;
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

interface DetectionZone {
  id: string;
  label: string;
  points: DetectionPoint[];
  curved: boolean; // true for curved lines (bumpers), false for straight (sides)
  type: 'front-bumper' | 'back-bumper' | 'side';
}

interface ReverseCamPageProps {
  onClose: () => void;
}

export const ReverseCamPage: React.FC<ReverseCamPageProps> = ({ onClose }) => {
  const { state } = useVehicleAPI();
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [zones, setZones] = useState<DetectionZone[]>([
    // Front bumper zones (curved)
    {
      id: 'fb-left',
      label: 'Front Bumper Left',
      points: [
        { id: 'fb-left-1', x: 25, y: 15 },
        { id: 'fb-left-2', x: 40, y: 10 },
        { id: 'fb-left-3', x: 50, y: 15 },
      ],
      curved: true,
      type: 'front-bumper',
    },
    {
      id: 'fb-right',
      label: 'Front Bumper Right',
      points: [
        { id: 'fb-right-1', x: 50, y: 15 },
        { id: 'fb-right-2', x: 60, y: 10 },
        { id: 'fb-right-3', x: 75, y: 15 },
      ],
      curved: true,
      type: 'front-bumper',
    },
    // Back bumper zones (curved)
    {
      id: 'bb-left',
      label: 'Back Bumper Left',
      points: [
        { id: 'bb-left-1', x: 25, y: 85 },
        { id: 'bb-left-2', x: 40, y: 90 },
        { id: 'bb-left-3', x: 50, y: 85 },
      ],
      curved: true,
      type: 'back-bumper',
    },
    {
      id: 'bb-right',
      label: 'Back Bumper Right',
      points: [
        { id: 'bb-right-1', x: 50, y: 85 },
        { id: 'bb-right-2', x: 60, y: 90 },
        { id: 'bb-right-3', x: 75, y: 85 },
      ],
      curved: true,
      type: 'back-bumper',
    },
    // Front side zones (straight lines)
    {
      id: 'fs-left',
      label: 'Front Side Left',
      points: [
        { id: 'fs-left-1', x: 27, y: 20 },
        { id: 'fs-left-2', x: 27, y: 33.5 },
        { id: 'fs-left-3', x: 27, y: 47 },
      ],
      curved: false,
      type: 'side',
    },
    {
      id: 'fs-right',
      label: 'Front Side Right',
      points: [
        { id: 'fs-right-1', x: 73, y: 20 },
        { id: 'fs-right-2', x: 73, y: 33.5 },
        { id: 'fs-right-3', x: 73, y: 47 },
      ],
      curved: false,
      type: 'side',
    },
    // Back side zones (straight lines)
    {
      id: 'bs-left',
      label: 'Back Side Left',
      points: [
        { id: 'bs-left-1', x: 27, y: 52 },
        { id: 'bs-left-2', x: 27, y: 65.5 },
        { id: 'bs-left-3', x: 27, y: 79 },
      ],
      curved: false,
      type: 'side',
    },
    {
      id: 'bs-right',
      label: 'Back Side Right',
      points: [
        { id: 'bs-right-1', x: 73, y: 52 },
        { id: 'bs-right-2', x: 73, y: 65.5 },
        { id: 'bs-right-3', x: 73, y: 79 },
      ],
      curved: false,
      type: 'side',
    },
  ]);

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

  const handlePointMouseDown = (e: React.MouseEvent, zoneId: string, pointId: string) => {
    e.stopPropagation();
    setDraggingPoint({ zoneId, pointId });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingPoint || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZones((prevZones) =>
      prevZones.map((zone) => ({
        ...zone,
        points: zone.points.map((point) =>
          point.id === draggingPoint.pointId
            ? { ...point, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
            : point
        ),
      }))
    );
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  const handleCopyPositions = () => {
    const config = zones.map((zone) => ({
      id: zone.id,
      label: zone.label,
      points: zone.points.map((p) => ({ id: p.id, x: p.x.toFixed(2), y: p.y.toFixed(2) })),
    }));
    const json = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(json);
    alert('Zone positions copied to clipboard!');
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
