import React from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
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
    toggleWindow,
    setSeatHeat,
    setInsideTemp,
    setVolume,
    toggleMusic,
    setWeather,
    reset,
  } = useVehicleAPI();
  const getNextLights = () => {
    const lights: Array<'off' | 'parking' | 'dipped' | 'high'> = ['off', 'parking', 'dipped', 'high'];
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
            onClick={startEngine}
            disabled={state.isEngineRunning}
            className="control-btn start"
          >
            Start
          </button>
          <button
            onClick={stopEngine}
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
              onClick={() => changeGear(gear)}
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
          onClick={() => toggleLights(getNextLights())}
          className="control-btn lights"
        >
          {state.lights === 'off' ? 'Off' : state.lights.charAt(0).toUpperCase() + state.lights.slice(1)}
        </button>
      </div>

      <div className="control-section">
        <h3>Wipers</h3>
        <button
          onClick={() => toggleWipers(getNextWipers())}
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
                  onClick={() => setSeatHeat('driver', level as 0 | 1 | 2 | 3)}
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
                  onClick={() => setSeatHeat('passenger', level as 0 | 1 | 2 | 3)}
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
                  onClick={() => setSeatHeat('rearLeft', level as 0 | 1 | 2 | 3)}
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
                  onClick={() => setSeatHeat('rearRight', level as 0 | 1 | 2 | 3)}
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
        <h3>Music</h3>
        <button
          onClick={toggleMusic}
          className={`control-btn music ${state.musicPlaying ? 'playing' : ''}`}
        >
          {state.musicPlaying ? 'Stop' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={state.volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="volume-slider"
        />
        <div className="volume-label">Vol: {state.volume}</div>
      </div>

      <div className="control-section">
        <h3>Security</h3>
        <button
          onClick={toggleDoorLock}
          className={`control-btn lock ${state.doorLocked ? 'locked' : 'unlocked'}`}
        >
          {state.doorLocked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      <div className="control-section">
        <h3>Windows</h3>
        <div className="button-group">
          <button
            onClick={() => toggleWindow('frontLeft')}
            className={`control-btn window ${state.windows.frontLeft ? 'open' : 'closed'}`}
          >
            Front L: {state.windows.frontLeft ? 'Open' : 'Closed'}
          </button>
          <button
            onClick={() => toggleWindow('frontRight')}
            className={`control-btn window ${state.windows.frontRight ? 'open' : 'closed'}`}
          >
            Front R: {state.windows.frontRight ? 'Open' : 'Closed'}
          </button>
          <button
            onClick={() => toggleWindow('rearLeft')}
            className={`control-btn window ${state.windows.rearLeft ? 'open' : 'closed'}`}
          >
            Rear L: {state.windows.rearLeft ? 'Open' : 'Closed'}
          </button>
          <button
            onClick={() => toggleWindow('rearRight')}
            className={`control-btn window ${state.windows.rearRight ? 'open' : 'closed'}`}
          >
            Rear R: {state.windows.rearRight ? 'Open' : 'Closed'}
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
