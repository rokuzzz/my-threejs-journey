import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

/**
 * Base
 */
// Debug
const gui = new GUI({ title: 'Light Controls' });

const ambientFolder = gui.addFolder('Ambient Light').close();
const directionalFolder = gui.addFolder('Directional Light').close();
const hemisphereFolder = gui.addFolder('Hemisphere Light').close();
const pointFolder = gui.addFolder('Point Light').close();
const rectAreaFolder = gui.addFolder('Rect Area Light').close();
const spotLightFolder = gui.addFolder('Spot Light').close();

const debugParams = {
  ambientColor: 0xffffff,
  directionalColor: 0x00fffc,
  hemisphereSkyColor: 0xff0000,
  hemisphereGroundColor: 0x0000ff,
  pointColor: 0xff9000,
  rectAreaColor: 0x4e00ff,
  spotLightColor: 0x78ff00,
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(debugParams.ambientColor, 1);
// or
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 1;
scene.add(ambientLight);

ambientFolder
  .add(ambientLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Intensity');
ambientFolder
  .addColor(debugParams, 'ambientColor')
  .name('Color')
  .onChange(() => {
    ambientLight.color.set(debugParams.ambientColor);
  });

// Directional light
const directionalLight = new THREE.DirectionalLight(
  debugParams.directionalColor,
  0.9
);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

directionalFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Intensity');
directionalFolder
  .addColor(debugParams, 'directionalColor')
  .name('Color')
  .onChange(() => {
    directionalLight.color.set(debugParams.directionalColor);
  });

const directionalPositionFolder = directionalFolder.addFolder('Position');
directionalPositionFolder
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('X');
directionalPositionFolder
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Y');
directionalPositionFolder
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Z');

// Hemisphere light
const hemisphereLight = new THREE.HemisphereLight(
  debugParams.hemisphereSkyColor,
  debugParams.hemisphereGroundColor,
  0.9
);
scene.add(hemisphereLight);

hemisphereFolder
  .add(hemisphereLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Intensity');
hemisphereFolder
  .addColor(debugParams, 'hemisphereSkyColor')
  .name('Sky Color')
  .onChange(() => {
    hemisphereLight.color.set(debugParams.hemisphereSkyColor);
  });
hemisphereFolder
  .addColor(debugParams, 'hemisphereGroundColor')
  .name('Ground Color')
  .onChange(() => {
    hemisphereLight.groundColor.set(debugParams.hemisphereGroundColor);
  });

// Point light
const pointLight = new THREE.PointLight(debugParams.pointColor, 1.5);
pointLight.position.set(1, -0.5, 1);
pointLight.distance = 3; // Max distance to light
pointLight.decay = 2; // Physically correct decay
scene.add(pointLight);

pointFolder
  .add(pointLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Intensity');
pointFolder
  .addColor(debugParams, 'pointColor')
  .name('Color')
  .onChange(() => {
    pointLight.color.set(debugParams.pointColor);
  });

const pointPositionFolder = pointFolder.addFolder('Position');
pointPositionFolder
  .add(pointLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('X');
pointPositionFolder
  .add(pointLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Y');
pointPositionFolder
  .add(pointLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Z');

const pointPropertiesFolder = pointFolder.addFolder('Properties');
pointPropertiesFolder
  .add(pointLight, 'distance')
  .min(0.1)
  .max(3) // Increased range to see effect better
  .step(0.001)
  .name('Distance');
pointPropertiesFolder
  .add(pointLight, 'decay')
  .min(0)
  .max(5)
  .step(0.1)
  .name('Decay');

// Rect area light
const rectAreaLight = new THREE.RectAreaLight(
  debugParams.rectAreaColor,
  6,
  1,
  1
);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

rectAreaFolder
  .add(rectAreaLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('Intensity');
rectAreaFolder
  .addColor(debugParams, 'rectAreaColor')
  .name('Color')
  .onChange(() => {
    rectAreaLight.color.set(debugParams.rectAreaColor);
  });

const rectAreaPositionFolder = rectAreaFolder.addFolder('Position');
rectAreaPositionFolder
  .add(rectAreaLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('X');
rectAreaPositionFolder
  .add(rectAreaLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Y');
rectAreaPositionFolder
  .add(rectAreaLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Z');

const rectAreaPropertiesFolder = rectAreaFolder.addFolder('Properties');
rectAreaPropertiesFolder
  .add(rectAreaLight, 'width')
  .min(0)
  .max(5)
  .step(0.1)
  .name('Width');
rectAreaPropertiesFolder
  .add(rectAreaLight, 'height')
  .min(0)
  .max(5)
  .step(0.1)
  .name('Height');

// Spot light
const spotLight = new THREE.SpotLight(
  debugParams.spotLightColor,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

spotLightFolder
  .add(spotLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('Intensity');
spotLightFolder
  .addColor(debugParams, 'spotLightColor')
  .name('Color')
  .onChange(() => {
    spotLight.color.set(debugParams.spotLightColor);
  });

const spotLightPositionFolder = spotLightFolder.addFolder('Position');
spotLightPositionFolder
  .add(spotLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('X');
spotLightPositionFolder
  .add(spotLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Y');
spotLightPositionFolder
  .add(spotLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Z');

const spotLightTargetFolder = spotLightFolder.addFolder('Target');
spotLightTargetFolder
  .add(spotLight.target.position, 'x')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Target X');
spotLightTargetFolder
  .add(spotLight.target.position, 'y')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Target Y');
spotLightTargetFolder
  .add(spotLight.target.position, 'z')
  .min(-5)
  .max(5)
  .step(0.1)
  .name('Target Z');

const spotLightPropertiesFolder = spotLightFolder.addFolder('Properties');
spotLightPropertiesFolder
  .add(spotLight, 'distance')
  .min(3)
  .max(10)
  .step(0.001)
  .name('Distance');
spotLightPropertiesFolder
  .add(spotLight, 'angle')
  .min(0)
  .max(Math.PI / 2)
  .step(0.001)
  .name('Angle');
spotLightPropertiesFolder
  .add(spotLight, 'penumbra')
  .min(0)
  .max(1)
  .step(0.001)
  .name('Penumbra');
spotLightPropertiesFolder
  .add(spotLight, 'decay')
  .min(0)
  .max(5)
  .step(0.1)
  .name('Decay');

// Helpers
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);

scene.add(directionalLightHelper, pointLightHelper, spotLightHelper);

window.requestAnimationFrame(() => {
  spotLightHelper.update();
});

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
