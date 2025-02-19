# Three.js Galaxy Generator

An interactive 3D spiral galaxy visualization with customizable parameters and dynamic star field background.

🔗 [Live Demo](https://spiral-galaxy-gen.netlify.app/)

## Features
- Custom-shaped spiral galaxy created with particles
- Surrounding star field with independent rotation
- Interactive orbital camera controls with zoom limits
- Real-time parameter adjustments:
  - Number and size of particles
  - Galaxy size and spiral arms count
  - Arm twist and particle spread
  - Custom inner and outer colors
- Smooth galaxy rotation animation

## Tech Stack
- Three.js
- Vite
- lil-gui for controls

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run these commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
