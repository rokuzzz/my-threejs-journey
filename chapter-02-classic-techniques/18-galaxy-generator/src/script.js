import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI({ title: 'Galaxy Controls' });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 200000; // Number of particles
parameters.size = 0.005; // Size of each particle
parameters.radius = 3; // How big the galaxy is
parameters.branches = 5; // Number of spiral arms
parameters.spin = 1.5; // How much the arms twist
parameters.randomness = 0.5; // How scattered the particles are
parameters.randomnessPower = 3; // How the randomness increases with radius
parameters.insideColor = '#ff4500'; // Color at galaxy center
parameters.outsideColor = '#0066ff'; // Color at galaxy edge

// Background stars parameters
parameters.starsCount = 5000;
parameters.starsSize = 0.004;
parameters.starsRadius = 70;

// Galaxy variables
let geometry = null;
let material = null;
let points = null;

// Background stars variables
let starsGeometry = null;
let starsMaterial = null;
let starsPoints = null;

// Generate background stars
const generateStars = () => {
  if (starsPoints) {
    starsGeometry.dispose();
    starsMaterial.dispose();
    scene.remove(starsPoints);
  }

  starsGeometry = new THREE.BufferGeometry();
  const starsPositions = new Float32Array(parameters.starsCount * 3);

  for (let i = 0; i < parameters.starsCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.starsRadius;

    starsPositions[i3] = (Math.random() - 0.5) * radius;
    starsPositions[i3 + 1] = (Math.random() - 0.5) * radius;
    starsPositions[i3 + 2] = (Math.random() - 0.5) * radius;
  }

  starsGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starsPositions, 3)
  );

  starsMaterial = new THREE.PointsMaterial({
    size: parameters.starsSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0xffffff,
  });

  starsPoints = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starsPoints);
};

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  if (points) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();
generateStars();

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .name('count')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.05)
  .step(0.001)
  .name('size')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'radius')
  .min(0.01)
  .max(20)
  .step(0.01)
  .name('radius')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .name('branches')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'spin')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('spin')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'randomness')
  .min(0)
  .max(2)
  .step(0.001)
  .name('spread')
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'randomnessPower')
  .min(1)
  .max(10)
  .step(0.001)
  .name('spreadFocus')
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameters, 'insideColor')
  .name('insideColor')
  .onFinishChange(generateGalaxy);
gui
  .addColor(parameters, 'outsideColor')
  .name('outsideColor')
  .onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.enableZoom = true;
controls.zoomSpeed = 0.7;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update galaxy rotation
  points.rotation.y = elapsedTime * 0.05;

  // Update stars rotation
  starsPoints.rotation.y = elapsedTime * 0.02;
  starsPoints.rotation.x = elapsedTime * 0.01;

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
