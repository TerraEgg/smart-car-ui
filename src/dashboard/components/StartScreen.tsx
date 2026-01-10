import React from 'react';
import { useVehicleAPI } from '../../api/VehicleContext';
import './StartScreen.css';

export const StartScreen: React.FC = () => {
  return (
    <div className="start-screen">
      <div className="start-text">Press Start Engine</div>
    </div>
  );
};
