# Three.js Lights Playground

Interactive demonstration of different light types in Three.js. Experiment with various light properties and see their effects in real-time.

🔗 [Live Demo](https://threejs-lights-playground.netlify.app/)

## Light Types Included
- Ambient Light
- Directional Light
- Hemisphere Light
- Point Light
- Rect Area Light
- Spot Light

## Features
- Interactive GUI controls for each light type:
  - Color and intensity adjustments
  - Position and target controls
  - Light-specific properties (decay, distance, angle, etc.)
- Visual helpers to understand light behavior and positioning
- Real-time preview of all adjustments on 3D objects

## Tech Stack
- Three.js
- Vite
- lil-gui for controls

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
