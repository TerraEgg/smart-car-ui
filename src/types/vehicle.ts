export interface VehicleState {
  speed: number;
  gear: 'P' | 'R' | 'N' | 'D';
  isEngineRunning: boolean;
  insideTemp: number;
  outsideTemp: number;
  fuelLevel: number;
  lights: 'off' | 'parking' | 'dipped' | 'high';
  wipers: 'off' | 'slow' | 'medium' | 'fast';
  doorLocked: boolean;
  windowsOpen: boolean;
  seatHeat: 0 | 1 | 2 | 3; // 0 = off, 1 = low, 2 = medium, 3 = high
  volume: number; // 0-100
  musicPlaying: boolean;
  currentTrack: string;
  weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  time: string;
  batteryHealth: number; // 0-100
  oilLevel: number; // 0-100
  tirePressure: number; // 0-100
  rpm: number; // 0-7000
}

export type VehicleAction = 
  | { type: 'START_ENGINE' }
  | { type: 'STOP_ENGINE' }
  | { type: 'ACCELERATE' }
  | { type: 'BRAKE' }
  | { type: 'CHANGE_GEAR'; gear: 'P' | 'R' | 'N' | 'D' }
  | { type: 'TOGGLE_LIGHTS'; lights: 'off' | 'parking' | 'dipped' | 'high' }
  | { type: 'TOGGLE_WIPERS'; wipers: 'off' | 'slow' | 'medium' | 'fast' }
  | { type: 'TOGGLE_DOOR_LOCK' }
  | { type: 'TOGGLE_WINDOWS' }
  | { type: 'SET_SEAT_HEAT'; level: 0 | 1 | 2 | 3 }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'SET_WEATHER'; weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' }
  | { type: 'UPDATE_TIME' }
  | { type: 'RESET' };
