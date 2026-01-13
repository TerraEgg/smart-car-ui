// React Context for global vehicle state management and API access across the application.
import { createContext, useContext } from "react";
import type { VehicleState } from "../types/vehicle";
export interface VehicleAPI {
  state: VehicleState;
  startEngine: () => void;
  stopEngine: () => void;
  setSpeed: (speed: number) => void;
  changeGear: (gear: "P" | "R" | "N" | "D") => void;
  toggleLights: (lights: "off" | "low" | "high") => void;
  toggleWipers: (wipers: "off" | "slow" | "medium" | "fast") => void;
  toggleDoorLock: () => void;
  toggleDoor: (
    door: "frontLeft" | "frontRight" | "rearLeft" | "rearRight"
  ) => void;
  toggleWindow: (
    window: "frontLeft" | "frontRight" | "rearLeft" | "rearRight"
  ) => void;
  setSeatHeat: (
    seat: "driver" | "passenger" | "rearLeft" | "rearRight",
    level: 0 | 1 | 2 | 3
  ) => void;
  setInsideTemp: (temp: number) => void;
  setVolume: (volume: number) => void;
  toggleMusic: () => void;
  setWeather: (
    weather: "clear" | "cloudy" | "rainy" | "snowy" | "foggy"
  ) => void;
  reset: () => void;
}
export const VehicleContext = createContext<VehicleAPI | null>(null);
export function useVehicleAPI(): VehicleAPI {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicleAPI must be used within a VehicleProvider");
  }
  return context;
}
