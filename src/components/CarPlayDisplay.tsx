import React from 'react';
import type { VehicleState } from '../types/vehicle';
import { CarModel3D } from '../dashboard/components/CarModel3D';
import './CarPlayDisplay.css';

interface CarPlayDisplayProps {
  state: VehicleState;
}

export const CarPlayDisplay: React.FC<CarPlayDisplayProps> = ({ state }) => {
  return (
    <div className="carplay-display">
      <div className="carplay-content">
        <div className="dashboard-grid">
          {/* First row */}
          <div className="tile tile-large" style={{ backgroundColor: '#f2d2dc' }}>
            <CarModel3D isEngineRunning={state.isEngineRunning} />
          </div>
          <div className="tile tile-medium" style={{ backgroundColor: '#ffdfbb' }}></div>
          
          {/* Second row */}
          <div className="tile tile-medium" style={{ backgroundColor: '#ffffba' }}></div>
          <div className="tile tile-medium" style={{ backgroundColor: '#baffc9' }}></div>
          <div className="tile tile-medium" style={{ backgroundColor: ' #ffffba' }}></div>
        </div>

        <div className="tab-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};
