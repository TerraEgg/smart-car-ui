// Custom hook that implements the vehicle's state logic using a reducer for complex state transitions.
import { useReducer, useCallback, useEffect, useState } from "react";
import type { VehicleState, VehicleAction } from "../types/vehicle";
const initialState: VehicleState = {
  speed: 0,
  gear: "P",
  isEngineRunning: false,
  insideTemp: 20,
  outsideTemp: 15,
  fuelLevel: 80,
  fuel: 80,
  lights: "off",
  wipers: "off",
  doorLocked: true,
  doors: {
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
  },
  windows: {
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
  },
  seatHeat: {
    driver: 0,
    passenger: 0,
    rearLeft: 0,
    rearRight: 0,
  },
  volume: 50,
  musicPlaying: false,
  currentTrack: "No track",
  weather: "clear",
  time: new Date().toLocaleTimeString(),
  batteryHealth: 95,
  battery: 95,
  oilLevel: 85,
  oil: 85,
  mileage: 12345,
  tirePressure: 90,
  rpm: 0,
  RPM: 0,
};
function vehicleReducer(
  state: VehicleState,
  action: VehicleAction
): VehicleState {
  switch (action.type) {
    case "START_ENGINE":
      return {
        ...state,
        isEngineRunning: true,
        rpm: 800,
      };
    case "STOP_ENGINE":
      return {
        ...state,
        isEngineRunning: false,
        speed: 0,
        gear: "P",
        rpm: 0,
      };
    case "SET_SPEED":
      if (!state.isEngineRunning) return state;
      const newSpeed = Math.max(0, Math.min(200, action.speed));
      const newRpm = state.isEngineRunning ? 800 + newSpeed * 30 : 0;
      return {
        ...state,
        speed: newSpeed,
        rpm: Math.min(newRpm, 7000),
      };
    case "CHANGE_GEAR":
      return { ...state, gear: action.gear };
    case "TOGGLE_LIGHTS":
      return { ...state, lights: action.lights };
    case "TOGGLE_WIPERS":
      return { ...state, wipers: action.wipers };
    case "TOGGLE_DOOR_LOCK":
      return { ...state, doorLocked: !state.doorLocked };
    case "TOGGLE_DOOR":
      return {
        ...state,
        doors: {
          ...state.doors,
          [action.door]: !state.doors[action.door],
        },
      };
    case "TOGGLE_WINDOW":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.window]: !state.windows[action.window],
        },
      };
    case "SET_SEAT_HEAT":
      return {
        ...state,
        seatHeat: {
          ...state.seatHeat,
          [action.seat]: action.level,
        },
      };
    case "SET_INSIDE_TEMP":
      return { ...state, insideTemp: Math.max(15, Math.min(30, action.temp)) };
    case "SET_VOLUME":
      return { ...state, volume: Math.max(0, Math.min(100, action.volume)) };
    case "TOGGLE_MUSIC":
      return {
        ...state,
        musicPlaying: !state.musicPlaying,
        currentTrack: !state.musicPlaying
          ? [
              "Summer Breeze",
              "Midnight Drive",
              "Highway Dreams",
              "Neon Nights",
            ][Math.floor(Math.random() * 4)]
          : "No track",
      };
    case "SET_WEATHER":
      return { ...state, weather: action.weather };
    case "UPDATE_TIME":
      return { ...state, time: new Date().toLocaleTimeString() };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}
export function useVehicleState() {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);
  const [, setUpdateTrigger] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "UPDATE_TIME" });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const startEngine = useCallback(() => dispatch({ type: "START_ENGINE" }), []);
  const stopEngine = useCallback(() => dispatch({ type: "STOP_ENGINE" }), []);
  const setSpeed = useCallback(
    (speed: number) => dispatch({ type: "SET_SPEED", speed }),
    []
  );
  const changeGear = useCallback(
    (gear: "P" | "R" | "N" | "D") => dispatch({ type: "CHANGE_GEAR", gear }),
    []
  );
  const toggleLights = useCallback(
    (lights: "off" | "low" | "high") =>
      dispatch({ type: "TOGGLE_LIGHTS", lights }),
    []
  );
  const toggleWipers = useCallback(
    (wipers: "off" | "slow" | "medium" | "fast") =>
      dispatch({ type: "TOGGLE_WIPERS", wipers }),
    []
  );
  const toggleDoorLock = useCallback(
    () => dispatch({ type: "TOGGLE_DOOR_LOCK" }),
    []
  );
  const toggleDoor = useCallback(
    (door: "frontLeft" | "frontRight" | "rearLeft" | "rearRight") =>
      dispatch({ type: "TOGGLE_DOOR", door }),
    []
  );
  const toggleWindow = useCallback(
    (window: "frontLeft" | "frontRight" | "rearLeft" | "rearRight") =>
      dispatch({ type: "TOGGLE_WINDOW", window }),
    []
  );
  const setSeatHeat = useCallback(
    (
      seat: "driver" | "passenger" | "rearLeft" | "rearRight",
      level: 0 | 1 | 2 | 3
    ) => dispatch({ type: "SET_SEAT_HEAT", seat, level }),
    []
  );
  const setInsideTemp = useCallback(
    (temp: number) => dispatch({ type: "SET_INSIDE_TEMP", temp }),
    []
  );
  const setVolume = useCallback(
    (volume: number) => dispatch({ type: "SET_VOLUME", volume }),
    []
  );
  const toggleMusic = useCallback(() => dispatch({ type: "TOGGLE_MUSIC" }), []);
  const setWeather = useCallback(
    (weather: "clear" | "cloudy" | "rainy" | "snowy" | "foggy") =>
      dispatch({ type: "SET_WEATHER", weather }),
    []
  );
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  return {
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
    setVolume,
    toggleMusic,
    setWeather,
    reset,
  };
}
