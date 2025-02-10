# Three.js Shadows Playground

Interactive demonstration of different shadow types in Three.js. Experiment with various shadow implementations and their properties in real-time.

🔗 [Live Demo](https://threejs-shadows-playground.netlify.app/)

## Shadow Types Included
- Real-time Shadows (with different light sources)
  - Directional Light Shadows
  - Spot Light Shadows
  - Point Light Shadows
- Baked Shadow

## Features
- Interactive GUI controls for each light type (Directional, Spot, and Point):
  - Intensity and position adjustments
  - Shadow map size, near/far planes, and optional blur
  - Toggle to enable/disable real-time shadows
- Visual camera helpers for straightforward shadow debugging
- Real-time preview of all shadow changes on 3D objects
- Dynamic baked shadow with adjustable opacity

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
