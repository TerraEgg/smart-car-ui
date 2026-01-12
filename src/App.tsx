import './App.css'
import { useEffect } from 'react'
import { useVehicleState } from './hooks/useVehicleState'
import { VehicleContext } from './api/VehicleContext'
import { NotificationProvider } from './api/NotificationContext'
import { Dashboard } from './dashboard/components/Dashboard'
import { VehicleControls } from './controls/components/VehicleControls'

function App() {
  const vehicleAPI = useVehicleState()

  // Preload images
  useEffect(() => {
    const images = [
      '/0do.png',
      '/rdo.png',
      '/ldo.png',
      '/2do.png',
      '/lcar.png',
      '/dcar.png',
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
