
# Three.JS Project - [Three.js Project (RO)](https://github.com/vasilcanumarius22/Proiect_Grafica_Computerizata/blob/main/README%20%5BRO%5D.md)
- Student: Marius Daniel **VASILCANU**
- Group: 1115 (Informatica Economica)


## Introduction
This project utilizes the Three.js library to create a 3D scene with interactive elements. It includes a main HTML file and JavaScript code to set up and animate the scene. External resources in the form of models and libraries are required to make the project work.

## Getting started
- Clone the project repository or download the source code.
- Open the main HTML file (index.html) in a web browser.
- The 3D scene will be displayed, and you can interact with it using the provided controls.

### What do I use to open the project
- As IDE (or code editor) I use [Visual Studio Code](https://code.visualstudio.com/)
- To launch the project I use a local server (localhost). This is achievable by using the extension called [`Live Server`](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

## Prerequisites
To run the project, you need the following external resources:

- Three.js library: The project relies on the Three.js library for 3D rendering and animation. It is loaded from the following CDN link:
  - https://unpkg.com/three@v0.149.0/build/three.module.js

- Three.js Addons: Additional modules from the Three.js examples are imported to enhance the functionality of the project. They are loaded from the following CDN link:
  - https://unpkg.com/three@v0.149.0/examples/jsm/


- ES Module Shims: This library is used to support ES modules in older browsers. It is loaded from the following CDN link:
  - https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js

- dat.gui library: This library provides a graphical user interface for controlling parameters in the scene. It is loaded from the following CDN link:
  - https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.min.js

## External resources
The project utilizes the following external resources (models):

- [Duck Model](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Duck/glTF) (`Duck.gltf`): A 3D model of a duck loaded using the GLTFLoader.
- [Water Model](https://threejs.org/examples/?q=water#webgl_shaders_ocean)  (`waternormals.jpg`): A texture used for water simulation in the scene.
- [Mario Starman MP3](https://downloads.khinsider.com/game-soundtracks/album/super-mario-bros.-1-3-anthology/1%252005%2520Starman.mp3) and [Mario Gameover MP3](https://downloads.khinsider.com/game-soundtracks/album/super-mario-bros.-1-3-anthology/1%252009%2520Game%2520Over.mp3) audio files (`starman.mp3` and `gameover.mp3`): Audio files used for sound effects in the scene.

Make sure to download or access these resources to have them available for the project to function correctly.

## Project Structure

The project is organized as follows:

```
DuckAdventure/
| - index.html
| - main.js
| - models/
    | - Duck.gltf
    | - Duck0.bin
    | - DuckCM.png
    | - waternormals.jpg
    | - gameover.mp3
    | - starman.mp3
```

- `index.html`: The main `HTML` file that sets up the basic structure of the web page. It imports the required external resources and includes a `<script>` tag to load the `JavaScript` code.
- `main.js`: The `JavaScript` code that sets up the 3D scene, defines the scene elements, and handles user interaction. It uses the `Three.js` library and other addons to create and animate the scene.
- `models/`: The `models` folder helds the external resources models and audio files responsable to create the project's objects and overall environment, like `duck` model, `water` plane and mario's `starman` and `gameover` sounds/themes.

## Building the Scene

The scene is built using the Three.js library and additional modules. The main steps involved in setting up the scene are as follows:

1. Import the necessary modules from Three.js and addons:
```javascript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";
```

2. Set up the global variables and create the scene, camera, renderer, and controls:
```javascript
let scene, camera, renderer, controls;
// ...

const createScene = () => {
  scene = new THREE.Scene();
};

const setupCamera = () => {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
};

const setupScene = () => {
  createScene();
  setupCamera();
  setupRenderer();
  setupControls();
  addElementsToScene();
  addDatGUIControls();
};
```

3. Add lights, models, custom geometries, and particles to the scene:
```javascript
const addElementsToScene = () => {
  addLights();
  addModels();
  addCustomGeometry();
  addParticles();
};
```

4. Animate the scene and handle user input:
```javascript
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
```

## Controlling the Scene
The scene provides various controls to interact with and modify its elements. These controls are accessible through the graphical user interface (`GUI`) provided by the `dat.gui` library. The available controls include:

- Directional Light controls: Control the color, intensity, and position of the directional light in the scene.
- Particle Movement controls: Choose the type of movement for the particles, such as `Brownian`, `Snow`, or `Rain`.
- Particle controls: Toggle the movement and visibility of the particles in the scene.
- `duck` controls: Reset the position and rotation of the duck model.
- Camera controls: Lock the camera to the duck model, allowing it to follow the duck's movements.
- `TorusKnot` controls: Change the color of the `TorusKnot` geometry in the scene.

These controls can be accessed and modified during runtime using the graphical interface provided by `dat.GUI`.

## Conclusion
This README provides an overview of the `Three.js` project and its external resources. It explains how to set up the project, lists the required resources, describes the project structure, explains how the scene is built, and outlines the available controls. With this documentation, you should be able to understand and utilize the project effectively.
