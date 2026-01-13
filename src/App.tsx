import './App.css'
import { useEffect, useState } from 'react'
import { useVehicleState } from './hooks/useVehicleState'
import { VehicleContext } from './api/VehicleContext'
import { NotificationProvider } from './api/NotificationContext'
import { Dashboard } from './dashboard/components/Dashboard'
import { VehicleControls } from './controls/components/VehicleControls'

function App() {
  const vehicleAPI = useVehicleState()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "SF Pro Display", sans-serif',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#6b4a5a',
              marginBottom: '12px',
            }}
          >
            Not Supported
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#666',
              lineHeight: '1.5',
            }}
          >
            This web app is not supported on mobile devices. Please use a desktop or laptop computer to access this application.
          </div>
        </div>
      </div>
    );
  }

  // Preload images
  useEffect(() => {
    const images = [
      '/0do.png',
      '/rdo.png',
      '/ldo.png',
      '/2do.png',
      '/lcar.png',
      '/dcar.png',
      '/hc.png',
      '/vite.svg',
      '/2025_bmw_m4_competition.glb'
    ];

    images.forEach(src => {
      if (src.endsWith('.glb')) return; // Skip GLB files
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <VehicleContext.Provider value={vehicleAPI}>
      <NotificationProvider>
        <div className="app-container">
          <div className="carplay-section">
            <Dashboard />
          </div>
          <div className="controls-section">
            <VehicleControls />
          </div>
        </div>
      </NotificationProvider>
    </VehicleContext.Provider>
  )
}

export default App
