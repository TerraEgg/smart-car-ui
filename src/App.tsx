import './App.css'
import { useVehicleState } from './hooks/useVehicleState'
import { VehicleContext } from './api/VehicleContext'
import { Dashboard } from './dashboard/components/Dashboard'
import { VehicleControls } from './controls/components/VehicleControls'

function App() {
  const vehicleAPI = useVehicleState()

  return (
    <VehicleContext.Provider value={vehicleAPI}>
      <div className="app-container">
        <div className="carplay-section">
          <Dashboard />
        </div>
        <div className="controls-section">
          <VehicleControls />
        </div>
      </div>
    </VehicleContext.Provider>
  )
}

export default App
