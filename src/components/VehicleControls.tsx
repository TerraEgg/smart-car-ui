import React from 'react';
import { VehicleState } from '../types/vehicle';
import './VehicleControls.css';

interface VehicleControlsProps {
  state: VehicleState;
  onStartEngine: () => void;
  onStopEngine: () => void;
  onAccelerate: () => void;
  onBrake: () => void;
  onChangeGear: (gear: 'P' | 'R' | 'N' | 'D') => void;
  onToggleLights: (lights: 'off' | 'parking' | 'dipped' | 'high') => void;
  onToggleWipers: (wipers: 'off' | 'slow' | 'medium' | 'fast') => void;
  onToggleDoorLock: () => void;
  onToggleWindows: () => void;
  onReset: () => void;
}

export const VehicleControls: React.FC<VehicleControlsProps> = ({
  state,
  onStartEngine,
  onStopEngine,
  onAccelerate,
  onBrake,
  onChangeGear,
  onToggleLights,
  onToggleWipers,
  onToggleDoorLock,
  onToggleWindows,
  onReset,
}) => {
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
      <h2 className="controls-title">Vehicle Controls</h2>

      <div className="control-section">
        <h3>Engine</h3>
        <div className="button-group">
          <button
            onClick={onStartEngine}
            disabled={state.isEngineRunning}
            className="control-btn start"
          >
            Start
          </button>
          <button
            onClick={onStopEngine}
            disabled={!state.isEngineRunning}
            className="control-btn stop"
          >
            Stop
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Driving</h3>
        <div className="button-group">
          <button
            onClick={onAccelerate}
            disabled={!state.isEngineRunning}
            className="control-btn accelerate"
          >
            Accelerate
          </button>
          <button
            onClick={onBrake}
            disabled={!state.isEngineRunning}
            className="control-btn brake"
          >
            Brake
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Gears</h3>
        <div className="button-group">
          {(['P', 'R', 'N', 'D'] as const).map((gear) => (
            <button
              key={gear}
              onClick={() => onChangeGear(gear)}
              disabled={!state.isEngineRunning}
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
          onClick={() => onToggleLights(getNextLights())}
          className="control-btn lights"
        >
          {state.lights === 'off' ? 'Off' : state.lights.charAt(0).toUpperCase() + state.lights.slice(1)}
        </button>
      </div>

      <div className="control-section">
        <h3>Wipers</h3>
        <button
          onClick={() => onToggleWipers(getNextWipers())}
          className="control-btn wipers"
        >
          {state.wipers === 'off' ? 'Off' : state.wipers.charAt(0).toUpperCase() + state.wipers.slice(1)}
        </button>
      </div>

      <div className="control-section">
        <h3>Security</h3>
        <button
          onClick={onToggleDoorLock}
          className={`control-btn lock ${state.doorLocked ? 'locked' : 'unlocked'}`}
        >
          {state.doorLocked ? 'Locked' : 'Unlocked'}
        </button>
      </div>

      <div className="control-section">
        <h3>Windows</h3>
        <button
          onClick={onToggleWindows}
          className={`control-btn windows ${state.windowsOpen ? 'open' : 'closed'}`}
        >
          {state.windowsOpen ? 'Open' : 'Closed'}
        </button>
      </div>

      <div className="control-section">
        <button onClick={onReset} className="control-btn reset">
          Reset All
        </button>
      </div>
    </div>
  );
};
