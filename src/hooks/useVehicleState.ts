import { useReducer, useCallback, useEffect, useState } from 'react';
import { VehicleState, VehicleAction } from '../types/vehicle';

const initialState: VehicleState = {
  speed: 0,
  gear: 'P',
  isEngineRunning: false,
  insideTemp: 20,
  outsideTemp: 15,
  fuelLevel: 80,
  lights: 'off',
  wipers: 'off',
  doorLocked: true,
  windowsOpen: false,
  seatHeat: 0,
  volume: 50,
  musicPlaying: false,
  currentTrack: 'No track',
  weather: 'clear',
  time: new Date().toLocaleTimeString(),
  batteryHealth: 95,
  oilLevel: 85,
  tirePressure: 90,
  rpm: 0,
};

function vehicleReducer(state: VehicleState, action: VehicleAction): VehicleState {
  switch (action.type) {
    case 'START_ENGINE':
      return { 
        ...state, 
        isEngineRunning: true, 
        insideTemp: Math.min(state.insideTemp + 5, 25),
        rpm: 800,
      };
    
    case 'STOP_ENGINE':
      return { 
        ...state, 
        isEngineRunning: false, 
        speed: 0, 
        gear: 'P', 
        insideTemp: Math.max(state.insideTemp - 2, state.outsideTemp),
        rpm: 0,
      };
    
    case 'ACCELERATE':
      if (!state.isEngineRunning || state.speed >= 200) return state;
      const newSpeed = Math.min(state.speed + 10, 200);
      return { 
        ...state, 
        speed: newSpeed, 
        insideTemp: Math.min(state.insideTemp + 1, 30),
        rpm: Math.min(state.rpm + 1000, 7000),
      };
    
    case 'BRAKE':
      return { 
        ...state, 
        speed: Math.max(state.speed - 15, 0),
        rpm: Math.max(state.rpm - 500, 800),
      };
    
    case 'CHANGE_GEAR':
      if (!state.isEngineRunning) return state;
      return { ...state, gear: action.gear, speed: action.gear === 'P' ? 0 : state.speed };
    
    case 'TOGGLE_LIGHTS':
      return { ...state, lights: action.lights };
    
    case 'TOGGLE_WIPERS':
      return { ...state, wipers: action.wipers };
    
    case 'TOGGLE_DOOR_LOCK':
      return { ...state, doorLocked: !state.doorLocked };
    
    case 'TOGGLE_WINDOWS':
      return { 
        ...state, 
        windowsOpen: !state.windowsOpen,
        insideTemp: state.windowsOpen 
          ? Math.min(state.insideTemp + 3, 35)
          : Math.max(state.insideTemp - 2, state.outsideTemp),
      };
    
    case 'SET_SEAT_HEAT':
      return { ...state, seatHeat: action.level };
    
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(100, action.volume)) };
    
    case 'TOGGLE_MUSIC':
      return { 
        ...state, 
        musicPlaying: !state.musicPlaying,
        currentTrack: !state.musicPlaying 
          ? ['Summer Breeze', 'Midnight Drive', 'Highway Dreams', 'Neon Nights'][Math.floor(Math.random() * 4)]
          : 'No track',
      };
    
    case 'SET_WEATHER':
      return { ...state, weather: action.weather };
    
    case 'UPDATE_TIME':
      return { ...state, time: new Date().toLocaleTimeString() };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function useVehicleState() {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);
  const [, setUpdateTrigger] = useState(0);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate outside temperature change
  useEffect(() => {
    const interval = setInterval(() => {
      // Slightly vary outside temp (between 5-25°C)
      const newOutsideTemp = 15 + Math.sin(Date.now() / 10000) * 10;
      setUpdateTrigger(prev => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const startEngine = useCallback(() => dispatch({ type: 'START_ENGINE' }), []);
  const stopEngine = useCallback(() => dispatch({ type: 'STOP_ENGINE' }), []);
  const accelerate = useCallback(() => dispatch({ type: 'ACCELERATE' }), []);
  const brake = useCallback(() => dispatch({ type: 'BRAKE' }), []);
  const changeGear = useCallback((gear: 'P' | 'R' | 'N' | 'D') => 
    dispatch({ type: 'CHANGE_GEAR', gear }), []);
  const toggleLights = useCallback((lights: 'off' | 'parking' | 'dipped' | 'high') => 
    dispatch({ type: 'TOGGLE_LIGHTS', lights }), []);
  const toggleWipers = useCallback((wipers: 'off' | 'slow' | 'medium' | 'fast') => 
    dispatch({ type: 'TOGGLE_WIPERS', wipers }), []);
  const toggleDoorLock = useCallback(() => dispatch({ type: 'TOGGLE_DOOR_LOCK' }), []);
  const toggleWindows = useCallback(() => dispatch({ type: 'TOGGLE_WINDOWS' }), []);
  const setSeatHeat = useCallback((level: 0 | 1 | 2 | 3) => 
    dispatch({ type: 'SET_SEAT_HEAT', level }), []);
  const setVolume = useCallback((volume: number) => 
    dispatch({ type: 'SET_VOLUME', volume }), []);
  const toggleMusic = useCallback(() => dispatch({ type: 'TOGGLE_MUSIC' }), []);
  const setWeather = useCallback((weather: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'foggy') => 
    dispatch({ type: 'SET_WEATHER', weather }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
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
    setSeatHeat,
    setVolume,
    toggleMusic,
    setWeather,
    reset,
  };
}
