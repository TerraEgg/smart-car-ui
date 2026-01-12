export interface VehicleState {
  speed: number;
  gear: 'P' | 'R' | 'N' | 'D';
  isEngineRunning: boolean;
  insideTemp: number;
  outsideTemp: number;
  fuelLevel: number;
  fuel: number;
  mileage: number;
  battery: number;
  oil: number;
  rpm: number;
  RPM: number;
  lights: 'off' | 'low' | 'high';
  wipers: 'off' | 'slow' | 'medium' | 'fast';
  doorLocked: boolean;
  doors: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  };
  windows: {
    frontLeft: boolean;
    frontRight: boolean;
    rearLeft: boolean;
    rearRight: boolean;
  };
  seatHeat: {
    driver: 0 | 1 | 2 | 3;
    passenger: 0 | 1 | 2 | 3;
    rearLeft: 0 | 1 | 2 | 3;
    rearRight: 0 | 1 | 2 | 3;
  };
  volume: number; // 0-100
  musicPlaying: boolean;
  currentTrack: string;
  weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy';
  time: string;
  batteryHealth: number; // 0-100
  oilLevel: number; // 0-100
  tirePressure: number; // 0-100
}

export type VehicleAction = 
  | { type: 'START_ENGINE' }
  | { type: 'STOP_ENGINE' }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'CHANGE_GEAR'; gear: 'P' | 'R' | 'N' | 'D' }
  | { type: 'TOGGLE_LIGHTS'; lights: 'off' | 'low' | 'high' }
  | { type: 'TOGGLE_WIPERS'; wipers: 'off' | 'slow' | 'medium' | 'fast' }
  | { type: 'TOGGLE_DOOR_LOCK' }
  | { type: 'TOGGLE_DOOR'; door: 'frontLeft' | 'frontRight' | 'rearLeft' | 'rearRight' }
  | { type: 'TOGGLE_WINDOW'; window: 'frontLeft' | 'frontRight' | 'rearLeft' | 'rearRight' }
  | { type: 'SET_SEAT_HEAT'; seat: 'driver' | 'passenger' | 'rearLeft' | 'rearRight'; level: 0 | 1 | 2 | 3 }
  | { type: 'SET_INSIDE_TEMP'; temp: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'SET_WEATHER'; weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' }
  | { type: 'UPDATE_TIME' }
  | { type: 'RESET' };
