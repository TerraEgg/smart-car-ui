import React from 'react';
import { Zap, Power, Gauge, Lightbulb, Wind, Lock, Thermometer, Lock as LockIcon } from 'lucide-react';
import { useVehicleAPI } from '../../api/VehicleContext';
import { useNotifications } from '../../api/NotificationContext';
import './VehicleControls.css';

export const VehicleControls: React.FC = () => {
  const {
    state,
    startEngine,
    stopEngine,
    setSpeed,
    changeGear,
    toggleLights,
    toggleWipers,
    toggleDoorLock,
    toggleDoor,
    toggleWindow,
    setSeatHeat,
    setInsideTemp,
    setWeather,
    reset,
  } = useVehicleAPI();

  const { showNotification } = useNotifications();

  const handleStartEngine = () => {
    startEngine();
  };

  const handleStopEngine = () => {
    stopEngine();
  };

  const handleToggleLights = () => {
    const nextLights = getNextLights();
    toggleLights(nextLights);
    const messages: Record<string, string> = {
      off: 'Lights Off',
      low: 'Low Beam',
      high: 'High Beam',
    };
    showNotification({
      type: 'info',
      title: 'Lights',
      message: messages[nextLights],
      icon: <Lightbulb size={20} />,
    });
  };

  const handleChangeGear = (gear: string) => {
    changeGear(gear as any);
    const gearNames: Record<string, string> = {
      P: 'Park',
      R: 'Reverse',
      N: 'Neutral',
      D: 'Drive',
    };
    showNotification({
      type: 'info',
      title: 'Gear',
      message: `Shifted into ${gearNames[gear] || gear}`,
      icon: <Gauge size={20} />,
    });
  };

  const handleToggleWipers = () => {
    const nextWipers = getNextWipers();
    toggleWipers(nextWipers);
    const messages: Record<string, string> = {
      off: 'Wipers Off',
      slow: 'Slow',
      medium: 'Medium',
      fast: 'Fast',
    };
    showNotification({
      type: 'info',
      title: 'Wipers',
      message: messages[nextWipers],
      icon: <Wind size={20} />,
    });
  };

  const handleToggleDoorLock = () => {
    toggleDoorLock();
    showNotification({
      type: 'success',
      title: 'Security',
      message: state.isLocked ? 'Vehicle Unlocked' : 'Vehicle Locked',
      icon: <LockIcon size={20} />,
    });
  };

  const handleToggleDoor = (door: 'frontLeft' | 'frontRight') => {
    toggleDoor(door);
    showNotification({
      type: 'info',
      title: 'Door',
      message: state.doors[door] ? `${door === 'frontLeft' ? 'Left' : 'Right'} Door Open` : `${door === 'frontLeft' ? 'Left' : 'Right'} Door Closed`,
      icon: <LockIcon size={20} />,
    });
  };

  const handleToggleWindow = (window: 'frontLeft' | 'frontRight') => {
    toggleWindow(window);
    showNotification({
      type: 'info',
      title: 'Window',
      message: state.windows[window] ? `${window === 'frontLeft' ? 'Left' : 'Right'} Window Down` : `${window === 'frontLeft' ? 'Left' : 'Right'} Window Up`,
      icon: <Wind size={20} />,
    });
  };

  const handleSetSeatHeat = (seat: 'driver' | 'passenger', level: number) => {
    setSeatHeat(seat, level);
    showNotification({
      type: 'info',
      title: 'Seat Heat',
      message: level > 0 ? `${seat === 'driver' ? 'Driver' : 'Passenger'} Seat Heat: ${level}` : `${seat === 'driver' ? 'Driver' : 'Passenger'} Seat Heat Off`,
      icon: <Thermometer size={20} />,
    });
  };
  const getNextLights = () => {
    const lights: Array<'off' | 'low' | 'high'> = ['off', 'low', 'high'];
    const currentIndex = lights.indexOf(state.lights);
    return lights[(currentIndex + 1) % lights.length];
  };

  const getNextWipers = () => {
    const wipers: Array<'off' | 'slow' | 'medium' | 'fast'> = ['off', 'slow', 'medium', 'fast'];
    const currentIndex = wipers.indexOf(state.wipers);
    return wipers[(currentIndex + 1) % wipers.length];
  };

  return (
    <div className="vehicle-controls">
      <h2 className="controls-title">Controls</h2>

      <div className="control-section">
        <h3>Engine</h3>
        <div className="button-group">
          <button
            onClick={handleStartEngine}
            disabled={state.isEngineRunning}
            className="control-btn start"
          >
            Start
          </button>
          <button
            onClick={handleStopEngine}
            disabled={!state.isEngineRunning}
            className="control-btn stop"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Driving</h3>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={state.speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          disabled={!state.isEngineRunning}
          className="speed-slider"
        />
        <div className="speed-label">Speed: {state.speed} km/h</div>
      </div>

      <div className="control-section">
        <h3>Gears</h3>
        <div className="button-group">
          {(['P', 'R', 'N', 'D'] as const).map((gear) => (
            <button
              key={gear}
              onClick={() => handleChangeGear(gear)}
              className={`control-btn gear ${state.gear === gear ? 'active' : ''}`}
            >
              {gear}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <h3>Lights</h3>
        <button
          onClick={handleToggleLights}
          className="control-btn lights"
        >
          {state.lights === 'off' ? 'Off' : state.lights.charAt(0).toUpperCase() + state.lights.slice(1)}
        </button>
      </div>

      <div className="control-section">
        <h3>Wipers</h3>
        <button
          onClick={handleToggleWipers}
          className="control-btn wipers"
        >
          {state.wipers === 'off' ? 'Off' : state.wipers.charAt(0).toUpperCase() + state.wipers.slice(1)}
        </button>
      </div>

      <div className="control-section">
        <h3>Seat Heat</h3>
        <div className="seat-heat-container">
          <div className="seat-row">
            <span className="seat-label">Driver</span>
            <div className="button-group-inline">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetSeatHeat('driver', level as 0 | 1 | 2 | 3)}
                  className={`control-btn heat ${state.seatHeat.driver === level ? 'active' : ''}`}
                >
                  {level === 0 ? 'Off' : level}
                </button>
              ))}
            </div>
          </div>
          <div className="seat-row">
            <span className="seat-label">Passenger</span>
            <div className="button-group-inline">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetSeatHeat('passenger', level as 0 | 1 | 2 | 3)}
                  className={`control-btn heat ${state.seatHeat.passenger === level ? 'active' : ''}`}
                >
                  {level === 0 ? 'Off' : level}
                </button>
              ))}
            </div>
          </div>
          <div className="seat-row">
            <span className="seat-label">Rear Left</span>
            <div className="button-group-inline">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetSeatHeat('rearLeft', level as 0 | 1 | 2 | 3)}
                  className={`control-btn heat ${state.seatHeat.rearLeft === level ? 'active' : ''}`}
                >
                  {level === 0 ? 'Off' : level}
                </button>
              ))}
            </div>
          </div>
          <div className="seat-row">
            <span className="seat-label">Rear Right</span>
            <div className="button-group-inline">
              {[0, 1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetSeatHeat('rearRight', level as 0 | 1 | 2 | 3)}
                  className={`control-btn heat ${state.seatHeat.rearRight === level ? 'active' : ''}`}
                >
                  {level === 0 ? 'Off' : level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h3>Inside Temperature</h3>
        <input
          type="range"
          min="15"
          max="30"
          step="0.5"
          value={state.insideTemp}
          onChange={(e) => setInsideTemp(Number(e.target.value))}
          className="temp-slider"
        />
        <div className="temp-label">{Math.round(state.insideTemp)}°C</div>
      </div>

      <div className="control-section">
        <h3>Security</h3>
        <button
          onClick={handleToggleDoorLock}
          className={`control-btn lock ${state.doorLocked ? 'locked' : 'unlocked'}`}
        >
          {state.doorLocked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      <div className="control-section">
        <h3>Doors</h3>
        <div className="button-group">
          <button
            onClick={() => handleToggleDoor('frontLeft')}
            className={`control-btn door ${state.doors.frontLeft ? 'open' : 'closed'}`}
          >
            Front L: {state.doors.frontLeft ? 'Open' : 'Closed'}
          </button>
          <button
            onClick={() => handleToggleDoor('frontRight')}
            className={`control-btn door ${state.doors.frontRight ? 'open' : 'closed'}`}
          >
            Front R: {state.doors.frontRight ? 'Open' : 'Closed'}
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Windows</h3>
        <div className="button-group">
          <button
            onClick={() => handleToggleWindow('frontLeft')}
            className={`control-btn window ${state.windows.frontLeft ? 'open' : 'closed'}`}
          >
            Front L: {state.windows.frontLeft ? 'Down' : 'Up'}
          </button>
          <button
            onClick={() => handleToggleWindow('frontRight')}
            className={`control-btn window ${state.windows.frontRight ? 'open' : 'closed'}`}
          >
            Front R: {state.windows.frontRight ? 'Down' : 'Up'}
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Weather</h3>
        <div className="button-group">
          {['clear', 'cloudy', 'rainy', 'snowy'].map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w as 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy')}
              className={`control-btn weather ${state.weather === w ? 'active' : ''}`}
            >
              {w.charAt(0).toUpperCase() + w.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="control-section">
        <button onClick={reset} className="control-btn reset">
          Reset All
        </button>
      </div>
    </div>
  );
};
