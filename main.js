// Importing necessary modules
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";

// Global Variables
let scene, camera, renderer, controls;
let torusKnot,
  directionalLight,
  particles,
  duck,
  duckBox,
  obstacle,
  obstacleBox,
  obstacleKnot;
let marioStarTheme = new Audio("./models/starman.mp3");
let gameOverTheme = new Audio("./models/gameover.mp3");
let water;
let isKnotInvincible = false;
let canMove = true;

// Clock mainly used for movement
const clock = new THREE.Clock();

const movementParams = { movementType: "Brownian" };
let particleParams = { movement: false, visibility: false };
const cubeParams = { color: 0xffffff };
const torusKnotParams = { color: 0xffffff };
const lightParams = {
  color: 0xffffff,
  intensity: 1,
  positionX: 0,
  positionY: 10,
  positionZ: 5,
};
let cameraParams = {
  lockCamera: false,
  cameraOffsetX: -10.760254646892971,
  cameraOffsetY: 6.821032353166482,
  cameraOffsetZ: 0.051823937539549635,
};

let setupScene = () => {
  createScene();
  setupCamera();
  setupRenderer();
  setupControls();
  addElementsToScene();
  addDatGUIControls();
};

const createScene = () => {
  scene = new THREE.Scene();
};

const setupCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(-20, 10, 0);
};

const setupRenderer = () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
};

const setupControls = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  // controls.addEventListener("change", () =>
  //   console.log("Camera Position:", camera.position.clone())
  // );
};

const addElementsToScene = () => {
  addLights();
  addModels();
  addCustomGeometry();
  addParticles();
};

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  updateCameraPosition();
  renderer.render(scene, camera);
  if (particleParams.movement) updateParticleMovement();
  particles.visible = particleParams.visibility;
  updateDuckFloating();
  checkCollisions();
  animateWater();
};

const updateCameraPosition = () => {
  if (duck && cameraParams.lockCamera) {
    const duckDirection = new THREE.Vector3();
    duck.getWorldDirection(duckDirection);

    const cameraOffset = new THREE.Vector3(
      cameraParams.cameraOffsetX,
      cameraParams.cameraOffsetY,
      cameraParams.cameraOffsetZ
    ); // Adjust the camera offset as needed
    const duckPosition = duck.position.clone();
    const cameraPosition = duckPosition
      .clone()
      .addScaledVector(duckDirection, cameraOffset.z)
      .add(new THREE.Vector3(cameraOffset.x, cameraOffset.y - 1, 0));

    camera.position.copy(cameraPosition);
    camera.lookAt(duckPosition);
  }
};

const checkCollisions = () => {
  // Update the bounding boxes and check for collision
  try {
    duckBox.setFromObject(duck);
    obstacleBox.setFromObject(obstacle);
    if (duckBox.intersectsBox(obstacleBox)) {
      changeCubeColor();
      console.log("Collision detected!");
      canMove = false;
      // Turn the duck upside down
      duck.rotation.z = Math.PI;
      gameOverTheme.play();
    } 
  } catch (error) {}

  try {
    obstacleKnot.setFromObject(torusKnot);
    if (duckBox.intersectsBox(obstacleKnot)) {
      console.log("Collision detected!");
      if (!isKnotInvincible) {
        isKnotInvincible = true;
        changeKnotColor();
        // Set a timeout to revert the invincibility state after a certain duration
        setTimeout(() => {
          isKnotInvincible = false;
          resetKnotColor();
        }, 100); // Change the duration as needed (in milliseconds)
      }
      marioStarTheme.play();
    } else {
      marioStarTheme.pause();
      marioStarTheme.currentTime = 0; // if you want the sound to start from the beginning next time
    }
  } catch (error) {}
};

const marioThemeCollision = () => {
  var duckBB = new THREE.Box3().setFromObject(duck);
  var torusKnotBB = new THREE.Box3().setFromObject(torusKnot);

  return duckBB.intersectsBox(torusKnotBB);
};

const marioGameOverColision = () => {
  var duckBB = new THREE.Box3().setFromObject(duck);
  var obstacleBB = new THREE.Box3().setFromObject(obstacle);

  return duckBB.intersectsBox(obstacleBB);
};

const changeKnotColor = () => {
  const randomColor = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  torusKnot.material.color.copy(randomColor);
};

const changeCubeColor = () => {
  const cubeColor = new THREE.Color(0x00cc00);
  obstacle.material.color.copy(cubeColor);
};

const resetKnotColor = () => {
  const color = new THREE.Color(torusKnotParams.color); // Use the original color
  torusKnot.material.color.copy(color);
};

const animateWater = () => {
  const elapsedTime = clock.getElapsedTime();

  water.material.uniforms["time"].value = elapsedTime * 0.3;
  water.material.uniforms["distortionScale"].value =
    3 + Math.sin(elapsedTime) * 2;
  water.material.uniforms["size"].value = 1 + Math.sin(elapsedTime) * 0.3;
};

let rotationY = 0;
const updateDuckFloating = () => {
  if (duck) {
    const elapsedTime = clock.getElapsedTime();
    const floatSpeed = 3;
    const floatHeight = 0.1;
    duck.position.y = 0.2 + Math.sin(elapsedTime * floatSpeed) * floatHeight;
    duck.rotation.y = (rotationY * Math.PI) / 180;
  }
};

// Function to reset the duck to its original position and orientation
const resetDuck = () => {
  duck.position.set(0, 1, 0);
  duck.rotation.set(0, 0, 0);
  rotationY = 0;
  canMove = true;

  const cubeColor = new THREE.Color(cubeParams.color);
  obstacle.material.color.copy(cubeColor);
};

// Arrow keys event listener
document.addEventListener(
  "keydown",
  (event) => {
    if (!canMove) return;
    let speed = 0.1;
    switch (event.code) {
      case "ArrowRight":
        // Move the duck in the direction it's facing
        duck.position.x += speed * Math.sin(rotationY * (Math.PI / 180));
        duck.position.z += speed * Math.cos(rotationY * (Math.PI / 180));
        break;
      case "ArrowLeft":
        // Move the duck in the opposite direction it's facing
        duck.position.x -= speed * Math.sin(rotationY * (Math.PI / 180));
        duck.position.z -= speed * Math.cos(rotationY * (Math.PI / 180));
        break;
      case "ArrowDown":
        // Move the duck to the left relative to its current orientation
        duck.position.x += speed * Math.sin((rotationY - 90) * (Math.PI / 180));
        duck.position.z += speed * Math.cos((rotationY - 90) * (Math.PI / 180));
        break;
      case "ArrowUp":
        // Move the duck to the right relative to its current orientation
        duck.position.x += speed * Math.sin((rotationY + 90) * (Math.PI / 180));
        duck.position.z += speed * Math.cos((rotationY + 90) * (Math.PI / 180));
        break;
      case "KeyQ":
        // Rotate the duck to the left
        rotationY += 5; // Change rotationY, not duck.rotation.y
        break;
      case "KeyE":
        // Rotate the duck to the right
        rotationY -= 5; // Change rotationY, not duck.rotation.y
        break;
    }
  },
  false
);

// Function to update particle movement
const updateParticleMovement = () => {
  if (particleParams.movement) {
    // Get the array of particle positions
    const particlePositions = particles.geometry.attributes.position.array;

    // Update each particle's position based on the selected movement type
    for (let i = 0; i < particlePositions.length; i += 3) {
      const x = particlePositions[i];
      const y = particlePositions[i + 1];
      const z = particlePositions[i + 2];

      switch (movementParams.movementType) {
        case "Brownian":
          particlePositions[i] += (Math.random() - 0.5) * 0.5;
          particlePositions[i + 1] += (Math.random() - 0.5) * 0.5;
          particlePositions[i + 2] += (Math.random() - 0.5) * 0.5;
          break;
        case "Snow":
          particlePositions[i + 1] -= 0.05;
          if (y < -5) particlePositions[i + 1] = 5;
          break;
        case "Rain":
          particlePositions[i + 1] -= 0.1;
          if (y < -5) particlePositions[i + 1] = 5;
          break;
      }
    }

    // Indicate that the particle positions need to be updated
    particles.geometry.attributes.position.needsUpdate = true;
  }
};

// Function to add lights to the scene
const addLights = () => {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 10, 5);
  scene.add(directionalLight);
};

// Function to add models to the scene
const addModels = () => {
  // Load external model using GLTFLoader
  const loader = new GLTFLoader();

  loader.load(
    "./models/Duck.gltf",
    (gltf) => {
      duck = gltf.scene;
      duck.scale.set(1, 1, 1);
      duck.position.set(0, 1, 0);
      duck.rotation.set(0, 0, 0);
      scene.add(duck);

      // Create the bounding box for the duck
      duckBox = new THREE.Box3().setFromObject(duck);
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );

  // Add obstacle
  const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
  const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xadd8e6 });
  obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  obstacle.position.set(15, 1, 0);
  scene.add(obstacle);

  // Create the bounding box for the obstacle
  obstacleBox = new THREE.Box3().setFromObject(obstacle);

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "models/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    waterColor: 0x001e3f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });

  water.rotation.x = -Math.PI / 2;

  scene.add(water);
};

// Function to add a torus knot to the scene
const addCustomGeometry = () => {
  const geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8);
  const material = new THREE.MeshStandardMaterial({ color: 0x3d6eb3 });
  torusKnot = new THREE.Mesh(geometry, material);
  torusKnot.position.set(10, 2, 10);
  scene.add(torusKnot);

  obstacleKnot = new THREE.Box3().setFromObject(torusKnot);
};

// Function to add particles to the scene
const addParticles = () => {
  // Create particles with random positions and colors
  const particleCount = 1000;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    particlePositions[i] = (Math.random() - 0.5) * 10;
    particleColors[i] = Math.random();
  }

  // Add the particles to the geometry
  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(particleColors, 3)
  );

  // Create and add the particles object to the scene
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
  });
  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Set particle visibility
  particles.visible = particleParams.visibility;
};

// Function to update the position of the light
const updateLightPosition = () => {
  directionalLight.position.set(
    lightParams.positionX,
    lightParams.positionY,
    lightParams.positionZ
  );
};

// Function to add controls to the dat.GUI
// Add controls for the directional light
const addLightControls = (gui) => {
  const lightFolder = gui.addFolder("DirectionalLight");
  lightFolder.addColor(lightParams, "color").onChange((color) => {
    directionalLight.color.set(color);
  });
  lightFolder.add(lightParams, "intensity", 0, 2).onChange((intensity) => {
    directionalLight.intensity = intensity;
  });
  lightFolder
    .add(lightParams, "positionX", -20, 20)
    .onChange(updateLightPosition);
  lightFolder
    .add(lightParams, "positionY", -20, 20)
    .onChange(updateLightPosition);
  lightFolder
    .add(lightParams, "positionZ", -20, 20)
    .onChange(updateLightPosition);
  lightFolder.open();
};

// Add controls for the particle movement
const addMovementControls = (gui) => {
  const movementFolder = gui.addFolder("Particle Movement");
  movementFolder.add(movementParams, "movementType", [
    "Brownian",
    "Snow",
    "Rain",
  ]);
  movementFolder.open();
};

// Add controls for the particles
const addParticleControls = (gui) => {
  const particleFolder = gui.addFolder("Particles");
  particleFolder.add(particleParams, "movement").name("Particle Movement");
  particleFolder.add(particleParams, "visibility").name("Particle Visibility");
  particleFolder.open();
};

// Add controls for the duck
const addDuckControls = (gui) => {
  const duckFolder = gui.addFolder("Duck");
  duckFolder
    .add({ resetDuck }, "resetDuck")
    .name("Reset Position and Rotation");
  duckFolder.open();
};

// Add controls for the camera
const addCameraControls = (gui) => {
  const cameraFolder = gui.addFolder("Camera");
  cameraFolder.add(cameraParams, "lockCamera").name("Lock Camera to Duck");
  cameraFolder.open();
};

const addTorusKnotControls = (gui) => {
  const torusKnotFolder = gui.addFolder("TorusKnot");
  torusKnotFolder.addColor(torusKnotParams, "color").onChange((color) => {
    torusKnot.material.color.set(color);
  });
  torusKnotFolder.open();
};

// Function to add controls to the dat.GUI
const addDatGUIControls = () => {
  const gui = new dat.GUI();

  addTorusKnotControls(gui);
  addLightControls(gui);
  addMovementControls(gui);
  addParticleControls(gui);
  addDuckControls(gui);
  addCameraControls(gui);
};

// Call the setupScene function to setup the 3D scene
setupScene();

// Call the animate function to start the animation loop
animate();

// Export the setupScene and animate functions
export { setupScene, animate };
