# Three.js Physics Playground

Interactive physics simulation built with Three.js and Cannon.js. Drop spheres and boxes, watch them collide with realistic physics, and hear impact sounds that vary based on collision strength.

🔗 [Live Demo](https://threejs-physics-playground.netlify.app/)

## Features
- Realistic gravity and collision simulation
- Dynamic object creation (spheres and boxes)
- Collision sounds with volume based on impact strength
- Automatic cleanup of fallen objects
- GUI interface for easy interaction:
  - Create random-sized spheres and boxes
  - Reset the simulation at any time
  - Adjust object removal height threshold

## Tech Stack
- Three.js for 3D rendering
- Cannon.js for physics simulation
- lil-gui for controls
- Vite for development and building

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server
npm run dev

# Build for production in the dist/ directory
npm run build
