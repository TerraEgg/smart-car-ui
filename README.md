# Smart Car UI

## Project Overview

The Smart Car UI is a web-based application designed to replicate the interface and control systems of a  2025 BMW M4 Competition. This application provides a mock in-car dashboard (resembling CarPlay) and a enviroment panel for simulating physical vehicle states.

## Thingys I used
- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **3D Graphics Engine:** Three.js (via @react-three/fiber and @react-three/drei)
- **Icons:** Lucide React
- **Package Manager:** pnpm
- **Linting:** ESLint

### Vehicle Controls
A environment manager panel allows users to manipulate the physical state of the simulated vehicle, including:
- Door mechanisms (locking/unlocking, opening/closing)
- Lighting systems (headlights, indicators, ambient lighting)
- Ignition status
- Window controls

## Installation and Execution

### Prerequisites
Ensure that a compatible version of Node.js is installed on the host machine.

### Setup
1. Clone the repository
2. Install the required dependencies using pnpm:
   ```bash
   pnpm install
   ```

### Development Server
To launch the application in a local development environment:
```bash
pnpm dev
```
The application will be served locally, typically accessible at `http://localhost:5173`.

### Production Build
To generate a production-ready build:
```bash
pnpm build
```

## Compatibility Note
This web app will not work on mobile devices or small screens. As it was built around a 1920x1080 display.
