import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { CarModel3D } from '../components/CarModel3D';

interface MyBMWPageProps {
  onBack: () => void;
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Error in 3D model:', error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export const MyBMWPage: React.FC<MyBMWPageProps> = ({ onBack }) => {
  const { state } = useVehicleAPI();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [animationsEnabled] = useState(() => {
    const saved = localStorage.getItem('animationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [is3D, setIs3D] = useState(() => {
    const saved = localStorage.getItem('defaultModelMode');
    return saved === '3D';
  });

  useEffect(() => {
    // Preload all car images
    const images = ['/0do.png', '/rdo.png', '/ldo.png', '/2do.png'];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
    
    setIsFadingIn(false);
  }, []);
  const [dragPosition, setDragPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to nearest corner
    const container = document.querySelector('.mybmw-view');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const panelWidth = 320;
    const panelHeight = 350;
    
    const distances = {
      'top-left': Math.sqrt(dragPosition.x ** 2 + dragPosition.y ** 2),
      'top-right': Math.sqrt((dragPosition.x - (rect.width - panelWidth)) ** 2 + dragPosition.y ** 2),
      'bottom-left': Math.sqrt(dragPosition.x ** 2 + (dragPosition.y - (rect.height - panelHeight)) ** 2),
      'bottom-right': Math.sqrt((dragPosition.x - (rect.width - panelWidth)) ** 2 + (dragPosition.y - (rect.height - panelHeight)) ** 2),
    };
    
    let nearestCorner = 'top-left';
    let minDistance = distances['top-left'];
    Object.entries(distances).forEach(([corner, distance]) => {
      if (distance < minDistance) {
        minDistance = distance;
        nearestCorner = corner;
      }
    });
    
    const padding = 20;
    let newPos = { x: padding, y: padding };
    
    if (nearestCorner === 'top-right') {
      newPos = { x: rect.width - panelWidth - padding, y: padding };
    } else if (nearestCorner === 'bottom-left') {
      newPos = { x: padding, y: rect.height - panelHeight - padding };
    } else if (nearestCorner === 'bottom-right') {
      newPos = { x: rect.width - panelWidth - padding, y: rect.height - panelHeight - padding };
    }
    
    setDragPosition(newPos);
  };

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBack();
      setIsFadingOut(false);
    }, animationsEnabled ? 300 : 0);
  };

  const getCarImage = () => {
    const frontLeft = state.doors.frontLeft;
    const frontRight = state.doors.frontRight;

    if (frontLeft && frontRight) {
      return '/2do.png'; // Both doors open
    } else if (frontRight) {
      return '/rdo.png'; // Right door open
    } else if (frontLeft) {
      return '/ldo.png'; // Left door open
    } else {
      return '/0do.png'; // No doors open
    }
  };

  return (
    <div 
      className="mybmw-view" 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp} 
      onMouseLeave={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    >
      <div style={{ 
        opacity: isFadingOut ? 0 : isFadingIn ? 0 : 1,
        transition: animationsEnabled ? 'opacity 0.3s ease-out' : 'none',
        backgroundColor: '#f2d2dc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '0',
        flexDirection: 'column'
      }}>
        {/* 2D/3D Switch */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          gap: '8px',
          zIndex: 200,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setIs3D(false)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: !is3D ? '#6b4a5a' : 'transparent',
              color: !is3D ? '#fff' : '#6b4a5a',
              fontWeight: '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            2D
          </button>
          <button
            onClick={() => setIs3D(true)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: is3D ? '#6b4a5a' : 'transparent',
              color: is3D ? '#fff' : '#6b4a5a',
              fontWeight: '500',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            3D
          </button>
        </div>

        {/* 2D/3D Model - Main Focus */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!is3D ? (
            // 2D Image View
            <img
              src={getCarImage()}
              alt="BMW M4 Competition"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                animation: 'fadeIn 0.5s ease-out'
              }}
            />
          ) : (
            // 3D Model View
            <ErrorBoundary>
              <CarModel3D isEngineRunning={state.isEngineRunning} />
            </ErrorBoundary>
          )}
        </div>

        {/* Stats Panel - Draggable */}
        <div 
          style={{
            position: 'absolute',
            top: `${dragPosition.y}px`,
            left: `${dragPosition.x}px`,
            width: '320px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(242, 210, 220, 0.1) 100%)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            zIndex: 100,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            opacity: 1,
            transform: 'scale(1)',
            transition: isDragging ? 'none' : 'all 0.3s ease',
            pointerEvents: 'auto'
          }}
          onMouseDown={handleMouseDown}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '400', 
              color: '#6b4a5a',
              letterSpacing: '-0.5px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
            }}>
              myBMW
            </div>
            <button
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '14px',
                color: '#6b4a5a',
                cursor: 'pointer',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              title="Go back"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: '12px 16px',
            fontSize: '13px',
            color: '#333'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>KM</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{Math.round(state.mileage || 0).toLocaleString()}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Speed</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{state.speed}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Fuel</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{Math.round(state.fuel || 0)}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Battery</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{Math.round(state.battery || 0)}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Oil</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{Math.round(state.oil || 0)}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Gear</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{state.gear}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>Temp</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{state.insideTemp}°C</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', opacity: 0.75 }}>RPM</span>
              <span style={{ fontWeight: '600', color: '#6b4a5a', fontSize: '14px' }}>{Math.round(state.RPM || 0)}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
