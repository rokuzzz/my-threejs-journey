import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import GUI from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load(
  './floor/coast_land_rocks_01_1k/coast_land_rocks_01_diff_1k.jpg'
);
const floorARMTexture = textureLoader.load(
  './floor/coast_land_rocks_01_1k/coast_land_rocks_01_arm_1k.jpg'
);
const floorNormalTexture = textureLoader.load(
  './floor/coast_land_rocks_01_1k/coast_land_rocks_01_nor_gl_1k.jpg'
);
const floorDisplacementTexture = textureLoader.load(
  './floor/coast_land_rocks_01_1k/coast_land_rocks_01_disp_1k.jpg'
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(5, 5);
floorARMTexture.repeat.set(5, 5);
floorNormalTexture.repeat.set(5, 5);
floorDisplacementTexture.repeat.set(5, 5);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Wall
const wallColorTexture = textureLoader.load(
  './wall/wooden_rough_planks_1k/wooden_rough_planks_diff_1k.jpg'
);
const wallARMTexture = textureLoader.load(
  './wall/wooden_rough_planks_1k/wooden_rough_planks_arm_1k.jpg'
);
const wallNormalTexture = textureLoader.load(
  './wall/wooden_rough_planks_1k/wooden_rough_planks_nor_gl_1k.jpg'
);
const wallDisplacementTexture = textureLoader.load(
  './wall/wooden_rough_planks_1k/wooden_rough_planks_disp_1k.jpg'
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

wallColorTexture.repeat.set(2, 1.25);
wallARMTexture.repeat.set(2, 1.25);
wallNormalTexture.repeat.set(2, 1.25);

wallColorTexture.wrapS = THREE.RepeatWrapping;
wallColorTexture.wrapT = THREE.RepeatWrapping;
wallARMTexture.wrapS = THREE.RepeatWrapping;
wallARMTexture.wrapT = THREE.RepeatWrapping;
wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.4,
    displacementBias: -0.09,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

gui
  .add(floor.material, 'displacementScale')
  .min(0)
  .max(1)
  .step(0.001)
  .name('FloorDisplacementScale');

gui
  .add(floor.material, 'displacementBias')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('FloorDisplacementBias');

// House container
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4, 100, 100, 100),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial()
);
roof.position.y += 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({
    color: '#f0f0f0',
  })
);
door.position.y += 1;
door.position.z += 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.setScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.setScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial();

const graves = new THREE.Group();
scene.add(graves);

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * Math.PI * 2;
  const x = Math.sin(angle);
  const z = Math.cos(angle);

  // Mesh
  const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);
  const radius = 3 + Math.random() * 4;
  grave.position.x = x * radius;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z * radius;
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  // Add to graves group
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
