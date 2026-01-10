import React from 'react';
import { VehicleState } from '../types/vehicle';
import './CarPlayDisplay.css';

interface CarPlayDisplayProps {
  state: VehicleState;
}

export const CarPlayDisplay: React.FC<CarPlayDisplayProps> = ({ state }) => {
  return (
    <div className="carplay-display">
      <div className="carplay-content">
        <div className="display-header">
          <h1 className="carplay-title">test</h1>
          <div className="header-info">
            <div className="time">{state.time}</div>
            <div className="weather">{state.weather}</div>
          </div>
        </div>
        
        <div className="display-grid">
          <div className="display-card">
            <div className="display-label">Speed</div>
            <div className="display-value">{state.speed} km/h</div>
          </div>

          <div className="display-card">
            <div className="display-label">RPM</div>
            <div className="display-value">{Math.round(state.rpm)}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Gear</div>
            <div className="display-value">{state.gear}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Engine</div>
            <div className="display-value">{state.isEngineRunning ? 'ON' : 'OFF'}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Inside Temp</div>
            <div className="display-value">{Math.round(state.insideTemp)}°C</div>
          </div>

          <div className="display-card">
            <div className="display-label">Outside Temp</div>
            <div className="display-value">{Math.round(state.outsideTemp)}°C</div>
          </div>

          <div className="display-card">
            <div className="display-label">Fuel</div>
            <div className="display-value">{state.fuelLevel}%</div>
          </div>

          <div className="display-card">
            <div className="display-label">Battery</div>
            <div className="display-value">{state.batteryHealth}%</div>
          </div>

          <div className="display-card">
            <div className="display-label">Oil Level</div>
            <div className="display-value">{state.oilLevel}%</div>
          </div>

          <div className="display-card">
            <div className="display-label">Tire Pressure</div>
            <div className="display-value">{state.tirePressure}%</div>
          </div>

          <div className="display-card">
            <div className="display-label">Lights</div>
            <div className="display-value">{state.lights}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Wipers</div>
            <div className="display-value">{state.wipers}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Seat Heat</div>
            <div className="display-value">{state.seatHeat === 0 ? 'Off' : `L${state.seatHeat}`}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Volume</div>
            <div className="display-value">{state.volume}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Music</div>
            <div className="display-value">{state.musicPlaying ? '▶' : '⏸'}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Track</div>
            <div className="display-value track">{state.currentTrack}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Door Lock</div>
            <div className="display-value">{state.doorLocked ? '🔒' : '🔓'}</div>
          </div>

          <div className="display-card">
            <div className="display-label">Windows</div>
            <div className="display-value">{state.windowsOpen ? 'Open' : 'Closed'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
