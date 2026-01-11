import React, { useState, useEffect } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { CarModel3D } from './CarModel3D';
import { StartScreen } from './StartScreen';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { state } = useVehicleAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mergeStep, setMergeStep] = useState(0);
  const [dragPosition, setDragPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Preload car images
  useEffect(() => {
    const img1 = new Image();
    img1.src = '/dcar.png';
    img1.onload = () => setImageLoaded(true);
    const img2 = new Image();
    img2.src = '/lcar.png';
  }, []);

  useEffect(() => {
    if (state.isEngineRunning && !showDashboard) {
      setIsLoading(true);
      setMergeStep(0);
      // Wait for image to load only, no artificial delay
      const checkAndShow = () => {
        if (imageLoaded) {
          setIsLoading(false);
          setShowDashboard(true);
        } else {
          setTimeout(checkAndShow, 50);
        }
      };
      checkAndShow();
    } else if (!state.isEngineRunning) {
      setShowDashboard(false);
      setIsLoading(false);
      setMergeStep(0);
    }
  }, [state.isEngineRunning, showDashboard, imageLoaded]);

  const handleLargeTileClick = () => {
    if (mergeStep === 0) {
      setMergeStep(1);
      setTimeout(() => setMergeStep(2), 1000);
      setTimeout(() => setMergeStep(3), 2500);
      setTimeout(() => setMergeStep(4), 4000);
    }
  };

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
    const container = document.querySelector('.carplay-display');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const panelWidth = 320;
    const panelHeight = 350;
    
    // Calculate distances to each corner
    const distances = {
      'top-left': Math.sqrt(dragPosition.x ** 2 + dragPosition.y ** 2),
      'top-right': Math.sqrt((dragPosition.x - (rect.width - panelWidth)) ** 2 + dragPosition.y ** 2),
      'bottom-left': Math.sqrt(dragPosition.x ** 2 + (dragPosition.y - (rect.height - panelHeight)) ** 2),
      'bottom-right': Math.sqrt((dragPosition.x - (rect.width - panelWidth)) ** 2 + (dragPosition.y - (rect.height - panelHeight)) ** 2),
    };
    
    // Find closest corner
    let nearestCorner = 'top-left';
    let minDistance = distances['top-left'];
    Object.entries(distances).forEach(([corner, distance]) => {
      if (distance < minDistance) {
        minDistance = distance;
        nearestCorner = corner;
      }
    });
    
    // Snap to corner with padding
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

  if (!state.isEngineRunning) {
    return <StartScreen />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen-full">
        <div className="loading-content">
          <div className="loading-title">SmartCarOS</div>
          <div className="spinner" style={{ pointerEvents: 'none' }}></div>
        </div>
      </div>
    );
  }

  // Show 3D model view after animation completes
  if (mergeStep >= 4) {
    return (
      <div className={`carplay-display ${showDashboard ? 'fade-in' : ''}`} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="carplay-content" style={{ 
          backgroundColor: '#f2d2dc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0'
        }}>
          {/* 3D Model - Main Focus */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CarModel3D isEngineRunning={state.isEngineRunning} />
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
              fontSize: '18px', 
              fontWeight: '400', 
              color: '#6b4a5a',
              letterSpacing: '-0.5px',
              marginBottom: '16px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
            }}>
              myBMW
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
      </div>
    );
  }

  return (
    <>
      <div className={`carplay-display ${showDashboard ? 'fade-in' : ''}`} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="carplay-content" style={{
          backgroundColor: mergeStep >= 2 ? '#f2d2dc' : 'transparent',
          transition: 'background-color 1s ease 0.5s'
        }}>
          <div className="dashboard-grid">
            {/* First row */}
            <div 
              className="tile tile-large" 
              onClick={handleLargeTileClick}
              style={{ 
                backgroundColor: '#f2d2dc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden',
                gap: '0',
                cursor: 'pointer',
                boxShadow: mergeStep >= 2 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '20px',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: mergeStep >= 2 ? 'none' : 'auto',
                position: 'relative'
              }}>
              <img 
                src={state.lights !== 'off' ? '/lcar.png' : '/dcar.png'} 
                alt="Car" 
                className="car-image"
                style={{
                  width: 'calc(100% * 5 / 7)',
                  height: 'calc(100% * 5 / 7)',
                  objectFit: 'contain',
                  marginLeft: '-70px',
                  flexShrink: 0,
                  opacity: mergeStep >= 1 ? 0 : 1,
                  transition: 'opacity 1s ease',
                  pointerEvents: 'none'
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                paddingRight: '100px',
                opacity: mergeStep >= 1 ? 0 : 1,
                transition: 'opacity 1s ease'
              }}>
                <div style={{ 
                  fontSize: '52px', 
                  fontWeight: '300',
                  letterSpacing: '-2px',
                  color: '#6b4a5a',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif'
                }}>
                  myBMW
                </div>
              </div>
            </div>
            <div 
              className="tile tile-medium" 
              style={{ 
                backgroundColor: mergeStep >= 1 ? '#f2d2dc' : '#ffdfbb',
                transition: 'all 1s ease',
                boxShadow: mergeStep >= 2 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: mergeStep >= 3 ? 0 : 1,
                transform: mergeStep >= 3 ? 'scale(0.9)' : 'scale(1)',
                pointerEvents: mergeStep >= 3 ? 'none' : 'auto'
              }}
            ></div>
            
            {/* Second row */}
            
            <div 
              className="tile tile-medium" 
              style={{ 
                backgroundColor: mergeStep >= 1 ? '#f2d2dc' : '#ffffba',
                transition: 'all 1s ease',
                boxShadow: mergeStep >= 2 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: mergeStep >= 3 ? 0 : 1,
                transform: mergeStep >= 3 ? 'scale(0.9)' : 'scale(1)',
                pointerEvents: mergeStep >= 3 ? 'none' : 'auto'
              }}
            ></div>
            
            <div 
              className="tile tile-medium" 
              style={{ 
                backgroundColor: mergeStep >= 1 ? '#f2d2dc' : '#baffc9',
                transition: 'all 1s ease',
                boxShadow: mergeStep >= 2 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: mergeStep >= 3 ? 0 : 1,
                transform: mergeStep >= 3 ? 'scale(0.9)' : 'scale(1)',
                pointerEvents: mergeStep >= 3 ? 'none' : 'auto'
              }}
            ></div>
            
            <div 
              className="tile tile-medium" 
              style={{ 
                backgroundColor: mergeStep >= 1 ? '#f2d2dc' : '#bae1ff',
                transition: 'all 1s ease',
                boxShadow: mergeStep >= 2 ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                opacity: mergeStep >= 3 ? 0 : 1,
                transform: mergeStep >= 3 ? 'scale(0.9)' : 'scale(1)',
                pointerEvents: mergeStep >= 3 ? 'none' : 'auto'
              }}
            ></div>
          </div>

          {/* Info Panel - Pre-rendered hidden, fades in at step 4 */}

        </div>
      </div>
    </>
  );
};
