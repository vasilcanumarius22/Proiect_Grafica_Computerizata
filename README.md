
# Proiect Three.js
- Student: Marius Daniel **VASILCANU**
- Grupă: 1115 (Informatica Economica)


## Introducere
Acest proiect utilizează biblioteca Three.js pentru a crea o scenă 3D cu elemente interactive. Include un fișier HTML principal și cod JavaScript pentru a configura și anima scena. Pentru funcționarea proiectului, sunt necesare resurse externe sub formă de modele și biblioteci.

## Cum să începi
- Clonează repository-ul de proiect sau descarcă codul sursă.
- Deschide fișierul HTML principal (index.html) într-un browser web.
- Scena 3D va fi afișată, iar tu poți interacționa cu ea folosind controalele furnizate.

## Prerechizite
Pentru a rula proiectul, ai nevoie de următoarele resurse externe:

- Biblioteca Three.js: Proiectul se bazează pe biblioteca Three.js pentru randarea și animarea 3D. Aceasta este încărcată de la următorul link CDN:
  - https://unpkg.com/three@v0.149.0/build/three.module.js

- Module adiționale Three.js: Module suplimentare din exemplele Three.js sunt importate pentru a îmbunătăți funcționalitatea proiectului. Acestea sunt încărcate de la următorul link CDN:
  - https://unpkg.com/three@v0.149.0/examples/jsm/

- Biblioteca ES Module Shims: Această bibliotecă este utilizată pentru a oferi suport pentru modulele ES în browserele mai vechi. Este încărcată de la următorul link CDN:
  - https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js

- Biblioteca dat.gui: Această bibliotecă furnizează o interfață grafică pentru controlul parametrilor în scena 3D. Este încărcată de la următorul link CDN:
  - https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.min.js

## Resurse externe
Proiectul utilizează următoarele resurse externe (modele):

- [Modelul Duck](https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Duck/glTF) (`Duck.gltf`): Un model 3D al unei rândunele încărcat folosind GLTFLoader.
- [Modelul Water](https://threejs.org/examples/?q=water#webgl_shaders_ocean)  (`waternormals.jpg`): O textură utilizată pentru simularea apei în scenă.
- [Mario Starman MP3](https://downloads.khinsider.com/game-soundtracks/album/super-mario-bros.-1-3-anthology/1%252005%2520Starman.mp3) si [Mario Gameover MP3](https://downloads.khinsider.com/game-soundtracks/album/super-mario-bros.-1-3-anthology/1%252009%2520Game%2520Over.mp3) (`starman.mp3` si `gameover.mp3`): Fișiere audio utilizate pentru efectele sonore din scenă.

Asigură-te că descarci sau ai acces la aceste resurse pentru ca proiectul să funcționeze corect.

## Structura proiectului


Proiectul este organizat după cum urmează:

```
./
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

- `index.html`: Fișierul `HTML` principal care configurează structura de bază a paginii web. Importă resursele externe necesare și include un tag `<script>` pentru încărcarea codului `JavaScript`.
- `main.js`: Codul `JavaScript` care configurează scena 3D, definește elementele scenei și gestionează interacțiunea utilizatorului. Folosește biblioteca `Three.js` și alte module pentru a crea și anima scena.
- `models/`: Folderul `models` conține resursele externe, modelele și fișierele audio responsabile de crearea obiectelor și mediului general al proiectului, precum modelul `duck`, planul `water` și sunetele/temele `starman` și `gameover` ale din jocul Mario.

## Construirea scenei
Scena este construită folosind biblioteca Three.js și module adiționale. Principalele etape implicate în configurarea scenei sunt următoarele:

1. Importă modulele necesare din Three.js și addon-uri:
```javascript
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Water } from "three/addons/objects/Water.js";
```

2. Configurează variabilele globale și creează scena, camera, renderer-ul și controalele:
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

3. Adaugă lumini, modele, geometrii personalizate și particule în scenă:
```javascript
const addElementsToScene = () => {
  addLights();
  addModels();
  addCustomGeometry();
  addParticles();
};
```

4. Animează scena și gestionează intrările utilizatorului:
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

## Controlarea scenei
Scena oferă diverse controale pentru a interacționa cu elementele sale și a le modifica. Aceste controale sunt accesibile prin interfața grafică (`GUI`) furnizată de biblioteca `dat.gui`. Controalele disponibile includ:

- Controale pentru lumina direcțională: Permite controlul culorii, intensității și poziției lumii direcționale în scenă.
- Controale pentru mișcarea particulelor: Permite selectarea tipului de mișcare pentru particule, cum ar fi `Brownian`, `Snow` sau `Rain`.
- Controale pentru particule: Permite activarea/dezactivarea mișcării și vizibilității particulelor în scenă.
- Controale pentru `duck`: Permite resetarea poziției și rotației modelului `duck`.
- Controale pentru cameră: Permite blocarea camerei pe modelul de `duck`, permițându-i să urmeze mișcările raței.
- Controale pentru TorusKnot: Permite modificarea culorii geometriei `TorusKnot` în scenă.

Aceste controale pot fi accesate și modificate în timpul execuției utilizând interfața grafică furnizată de `dat.GUI`.

## Concluzie
Acest README oferă o prezentare generală a proiectului `Three.js` și a resurselor externe utilizate. Explică cum să configurezi proiectul, listează resursele necesare, descrie structura proiectului, explică modul în care scena este construită și prezintă controalele disponibile. Cu această documentație, ar trebui să poți înțelege și utiliza proiectul eficient.
