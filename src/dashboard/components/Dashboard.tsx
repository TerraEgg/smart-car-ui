import React, { useState, useEffect } from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
// import { CarModel3D } from './CarModel3D';
import { StartScreen } from './StartScreen';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { state } = useVehicleAPI();
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload car image
  useEffect(() => {
    const img = new Image();
    img.src = '/dcar.png';
    img.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (state.isEngineRunning && !showDashboard) {
      setIsLoading(true);
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
    }
  }, [state.isEngineRunning, showDashboard, imageLoaded]);

  if (!state.isEngineRunning) {
    return <StartScreen />;
  }

  if (isLoading) {
    return (
      <div className="loading-screen-full">
        <div className="loading-content">
          <div className="loading-title">SmartCarOS</div>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`carplay-display ${showDashboard ? 'fade-in' : ''}`}>
        <div className="carplay-content">
          <div className="dashboard-grid">
            {/* First row */}
            <div className="tile tile-large" style={{ 
              backgroundColor: '#f2d2dc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0',
              overflow: 'hidden',
              gap: '0'
            }}>
              <img 
                src="/dcar.png" 
                alt="Car" 
                className="car-image"
                style={{
                  width: 'calc(100% * 5 / 7)',
                  height: 'calc(100% * 5 / 7)',
                  objectFit: 'contain',
                  marginLeft: '-70px',
                  flexShrink: 0
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                height: '100%',
                paddingRight: '100px'
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
            <div className="tile tile-medium" style={{ backgroundColor: '#ffdfbb' }}></div>
            
            {/* Second row */}
            <div className="tile tile-medium" style={{ backgroundColor: '#ffffba' }}></div>
            <div className="tile tile-medium" style={{ backgroundColor: '#baffc9' }}></div>
            <div className="tile tile-medium" style={{ backgroundColor: '#bae1ff' }}></div>
          </div>

          <div className="tab-dots">
            <div className="dot active"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>
    </>
  );
};
