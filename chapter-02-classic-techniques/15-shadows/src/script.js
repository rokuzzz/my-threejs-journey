import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');
bakedShadow.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 10;
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 1.0, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.position.set(0, 2, 2);
scene.add(spotLight, spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    alphaMap: simpleShadow,
    transparent: true,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;
scene.add(sphereShadow);

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Debug GUI
 */
const gui = new GUI({ title: 'Shadow Controls' });

// Shadow settings
const shadowsState = {
  enabled: true,
};

gui
  .add(shadowsState, 'enabled')
  .name('Real-time Shadows')
  .onChange((value) => {
    renderer.shadowMap.enabled = value;

    // Update all materials
    material.needsUpdate = true;
    sphereShadow.material.needsUpdate = true;

    // Update shadow casting/receiving for objects
    sphere.castShadow = value;
    plane.receiveShadow = value;
  });

// Directional Light Controls
const directionalFolder = gui.addFolder('Directional Light').close();
const directionalBasicFolder = directionalFolder
  .addFolder('Basic Settings')
  .close();
directionalBasicFolder
  .add(directionalLight, 'intensity')
  .min(0)
  .max(3)
  .step(0.001)
  .name('Intensity');
directionalBasicFolder
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position X');
directionalBasicFolder
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Y');
directionalBasicFolder
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Z');

const directionalShadowFolder = directionalFolder
  .addFolder('Shadow Settings')
  .close();
directionalShadowFolder
  .add(directionalLight, 'castShadow')
  .name('Cast Shadows');
directionalShadowFolder
  .add(directionalLight.shadow.mapSize, 'width', 256, 2048, 256)
  .name('Map Width')
  .onChange(() => {
    directionalLight.shadow.map.dispose();
    directionalLight.shadow.map = null;
  });
directionalShadowFolder
  .add(directionalLight.shadow.mapSize, 'height', 256, 2048, 256)
  .name('Map Height')
  .onChange(() => {
    directionalLight.shadow.map.dispose();
    directionalLight.shadow.map = null;
  });
directionalShadowFolder
  .add(directionalLight.shadow.camera, 'near', 0.1, 10)
  .name('Camera Near')
  .onChange((value) => {
    directionalLight.shadow.camera.near = value;
    directionalLight.shadow.camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
  });
directionalShadowFolder
  .add(directionalLight.shadow.camera, 'far', 1, 20)
  .name('Camera Far')
  .onChange((value) => {
    directionalLight.shadow.camera.far = value;
    directionalLight.shadow.camera.updateProjectionMatrix();
    directionalLightCameraHelper.update();
  });
directionalShadowFolder
  .add(directionalLightCameraHelper, 'visible')
  .name('Show Helper');

// Spot Light Controls
const spotFolder = gui.addFolder('Spot Light').close();
const spotBasicFolder = spotFolder.addFolder('Basic Settings').close();
spotBasicFolder
  .add(spotLight, 'intensity')
  .min(0)
  .max(5)
  .step(0.001)
  .name('Intensity');
spotBasicFolder
  .add(spotLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position X');
spotBasicFolder
  .add(spotLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Y');
spotBasicFolder
  .add(spotLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Z');

const spotShadowFolder = spotFolder.addFolder('Shadow Settings').close();
spotShadowFolder.add(spotLight, 'castShadow').name('Cast Shadows');
spotShadowFolder
  .add(spotLight.shadow.mapSize, 'width', 256, 2048, 256)
  .name('Map Width')
  .onChange(() => {
    spotLight.shadow.map.dispose();
    spotLight.shadow.map = null;
  });
spotShadowFolder
  .add(spotLight.shadow.mapSize, 'height', 256, 2048, 256)
  .name('Map Height')
  .onChange(() => {
    spotLight.shadow.map.dispose();
    spotLight.shadow.map = null;
  });
spotShadowFolder
  .add(spotLight.shadow.camera, 'near', 0.1, 10)
  .name('Camera Near')
  .onChange((value) => {
    spotLight.shadow.camera.near = value;
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
  });
spotShadowFolder
  .add(spotLight.shadow.camera, 'far', 1, 20)
  .name('Camera Far')
  .onChange((value) => {
    spotLight.shadow.camera.far = value;
    spotLight.shadow.camera.updateProjectionMatrix();
    spotLightCameraHelper.update();
  });

spotShadowFolder.add(spotLightCameraHelper, 'visible').name('Show Helper');

// Point Light Controls
const pointFolder = gui.addFolder('Point Light').close();
const pointBasicFolder = pointFolder.addFolder('Basic Settings').close();
pointBasicFolder
  .add(pointLight, 'intensity')
  .min(0)
  .max(5)
  .step(0.001)
  .name('Intensity');
pointBasicFolder
  .add(pointLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position X');
pointBasicFolder
  .add(pointLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Y');
pointBasicFolder
  .add(pointLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('Position Z');

const pointShadowFolder = pointFolder.addFolder('Shadow Settings').close();
pointShadowFolder.add(pointLight, 'castShadow').name('Cast Shadows');
pointShadowFolder
  .add(pointLight.shadow.mapSize, 'width', 256, 2048, 256)
  .name('Map Width')
  .onChange(() => {
    pointLight.shadow.map.dispose();
    pointLight.shadow.map = null;
  });
pointShadowFolder
  .add(pointLight.shadow.mapSize, 'height', 256, 2048, 256)
  .name('Map Height')
  .onChange(() => {
    pointLight.shadow.map.dispose();
    pointLight.shadow.map = null;
  });
pointShadowFolder
  .add(pointLight.shadow.camera, 'near', 0.1, 10)
  .name('Camera Near')
  .onChange((value) => {
    pointLight.shadow.camera.near = value;
    pointLight.shadow.camera.updateProjectionMatrix();
    pointLightCameraHelper.update();
  });
pointShadowFolder
  .add(pointLight.shadow.camera, 'far', 1, 20)
  .name('Camera Far')
  .onChange((value) => {
    pointLight.shadow.camera.far = value;
    pointLight.shadow.camera.updateProjectionMatrix();
    pointLightCameraHelper.update();
  });

pointShadowFolder.add(pointLightCameraHelper, 'visible').name('Show Helper');

// Simple Shadow Controls
const bakedShadowFolder = gui.addFolder('Baked Shadow').close();

const bakedShadowState = {
  baseOpacity: 0.6,
};

bakedShadowFolder
  .add(bakedShadowState, 'baseOpacity', 0, 3)
  .name('Base Opacity');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  sphere.position.x = Math.cos(elapsedTime * 3) * 1.5;
  sphere.position.z = Math.sin(elapsedTime * 3) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 5));

  // Update the shadow
  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity =
    (1 - sphere.position.y) * bakedShadowState.baseOpacity;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
