import './App.css'
import { useVehicleState } from './hooks/useVehicleState'
import { CarPlayDisplay } from './components/CarPlayDisplay'
import { VehicleControls } from './components/VehicleControls'

function App() {
  const {
    state,
    startEngine,
    stopEngine,
    accelerate,
    brake,
    changeGear,
    toggleLights,
    toggleWipers,
    toggleDoorLock,
    toggleWindows,
    reset,
  } = useVehicleState()

  return (
    <div className="app-container">
      <div className="carplay-section">
        <CarPlayDisplay state={state} />
      </div>
      <div className="controls-section">
        <VehicleControls
          state={state}
          onStartEngine={startEngine}
          onStopEngine={stopEngine}
          onAccelerate={accelerate}
          onBrake={brake}
          onChangeGear={changeGear}
          onToggleLights={toggleLights}
          onToggleWipers={toggleWipers}
          onToggleDoorLock={toggleDoorLock}
          onToggleWindows={toggleWindows}
          onReset={reset}
        />
      </div>
    </div>
  )
}

export default App
