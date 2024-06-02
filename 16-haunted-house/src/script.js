import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/addons/misc/Timer.js';
import { Sky } from 'three/addons/objects/Sky.js';

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
// units are 1m
// therefore the width of scene is maybe 10m

// Textures
const textureLoader = new THREE.TextureLoader();
// Floor Textures
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp');
const floorColorTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp'
);
const floorARMTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp'
);
const floorNormalTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp'
);
const floorDisplacementTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp'
);
floorColorTexture.repeat.set(8, 8);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorARMTexture.repeat.set(8, 8);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(8, 8);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(8, 8);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

// Walls

const wallColorTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp'
);
const wallARMTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp'
);
const wallNormalTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp'
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofColorTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp'
);
const roofARMTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp'
);
const roofNormalTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp'
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

roofARMTexture.repeat.set(3, 1);
roofARMTexture.wrapS = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(3, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;

const leavesColorTexture = textureLoader.load(
  './leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp'
);
const leavesARMTexture = textureLoader.load(
  './leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp'
);
const leavesNormalTexture = textureLoader.load(
  './leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp'
);
leavesColorTexture.colorSpace = THREE.SRGBColorSpace;

leavesColorTexture.repeat.set(2, 1);
leavesColorTexture.wrapS = THREE.RepeatWrapping;

leavesARMTexture.repeat.set(2, 1);
leavesARMTexture.wrapS = THREE.RepeatWrapping;

leavesNormalTexture.repeat.set(2, 1);
leavesNormalTexture.wrapS = THREE.RepeatWrapping;

const graveColorTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp'
);
const graveARMTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp'
);
const graveNormalTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp'
);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);

graveARMTexture.repeat.set(0.3, 0.4);

graveNormalTexture.repeat.set(0.3, 0.4);

const doorColorTexture = textureLoader.load('./door/color.webp');
const doorAlphaTexture = textureLoader.load('./door/alpha.webp');
const doorAOTexture = textureLoader.load('./door/ambientOcclusion.webp');
const doorHeightTexture = textureLoader.load('./door/height.webp');
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp');
const doorNormalTexture = textureLoader.load('./door/normal.webp');
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * House
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    normalMap: floorNormalTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// CONSTANTS
const ZFIGHTINGADJUST = 0.0001;
// House

// House group
const houseGroup = new THREE.Group();
scene.add(houseGroup);

// Walls

const wallDimensions = {
  width: 3.5,
  height: 3.5,
  depth: 3.5,
};
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallDimensions.width,
    wallDimensions.height,
    wallDimensions.depth
  ),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += wallDimensions.height / 2;
houseGroup.add(walls);

// Roof
const roofDimensions = {
  radius: 3,
  height: 1.5,
};
// rafter added independently
const rafterDimensions = {
  height: 0.05,
  width: roofDimensions.radius * 1.415,
  depth: roofDimensions.radius * 1.415,
};
const rafter = new THREE.Mesh(
  new THREE.BoxGeometry(
    rafterDimensions.height,
    rafterDimensions.width,
    rafterDimensions.depth
  ),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
rafter.position.y += wallDimensions.height;
rafter.rotation.z = Math.PI / 2;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofDimensions.radius, roofDimensions.height, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.rotation.y += Math.PI / 4;
roof.position.y +=
  wallDimensions.height +
  roofDimensions.height / 2 +
  rafterDimensions.height / 2;

// Door
// Texture is a square
const doorDimensions = {
  height: 2.2,
  width: 2.2,
};
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorDimensions.width, doorDimensions.height, 64, 64),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAOTexture,
    displacementMap: doorHeightTexture,
    normalMap: doorNormalTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    transparent: true,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.z = wallDimensions.depth / 2 + ZFIGHTINGADJUST;
door.position.y = doorDimensions.height / 2 - 0.1;

houseGroup.add(roof, rafter, door);

// Bushes
const baseBushDimensions = {
  radius: 1,
};
const bushGeometry = new THREE.SphereGeometry(
  baseBushDimensions.radius,
  16,
  16
);

const bushMaterial = new THREE.MeshStandardMaterial({
  map: leavesColorTexture,
  aoMap: leavesARMTexture,
  roughnessMap: leavesARMTexture,
  metalnessMap: leavesARMTexture,
  normalMap: leavesNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);

bush1.scale.setScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

bush2.scale.setScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

bush3.scale.setScalar(0.15);
bush3.position.set(-1, 0.05, 2.6);
bush3.rotation.x = -0.75;

bush4.scale.setScalar(0.4);
bush4.position.set(-0.8, 0.1, 2.2);
bush4.rotation.x = -0.75;

houseGroup.add(bush1, bush2, bush3, bush4);

// Graves
const gravesGroup = new THREE.Group();
scene.add(gravesGroup);

// Needs to be distributed randomly not in the walls
const graveDimensions = { width: 0.6, height: 0.8, depth: 0.2 };
const graveGeometry = new THREE.BoxGeometry(
  graveDimensions.width,
  graveDimensions.height,
  graveDimensions.depth
);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

for (let i = 0; i < 30; i++) {
  const angle = Math.random() * 2 * Math.PI;
  const radius = 4 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;
  grave.rotation.set(
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5) * 0.4
  );
  // position the grave randomly in a circle around the house like a donut distribution

  gravesGroup.add(grave);
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.7);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
houseGroup.add(doorLight);

// Spirit Lights
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);

scene.add(ghost1, ghost2, ghost3);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight + 1,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight + 1;

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

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// cast and receive

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
roof.receiveShadow = true;
rafter.castShadow = true;
rafter.receiveShadow = true;
floor.receiveShadow = true;

for (const grave of gravesGroup.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// sky
const sky = new Sky();
sky.scale.setScalar(100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 0.5;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.97;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

// Fog

scene.fog = new THREE.FogExp2('#02343f', 0.1);

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

  // door light flicker
  doorLight.intensity = Math.abs(
    Math.sin(elapsedTime * 2) * 3 * Math.sin(elapsedTime * 2 * 2.34)
  );

  // ghosts animation
  const ghost1Angle = elapsedTime * 0.5;
  const ghost2Angle = elapsedTime * 0.3 - 1;
  const ghost3Angle = elapsedTime * 0.2;

  ghost1.position.set(
    Math.sin(ghost1Angle) * 4 * Math.sin(ghost1Angle * 2.34),
    Math.sin(ghost1Angle) *
      Math.sin(ghost1Angle * 2.34) *
      Math.sin(ghost1Angle * 3.45),
    Math.cos(ghost1Angle) * 4 * Math.cos(ghost1Angle * 2.34)
  );
  ghost2.position.set(
    Math.sin(ghost2Angle) * 7 * Math.sin(ghost2Angle * 2.34),
    Math.sin(ghost2Angle) *
      Math.sin(ghost2Angle * 2.34) *
      Math.sin(ghost2Angle * 3.45),
    Math.cos(ghost2Angle) * 7 ** Math.cos(ghost2Angle * 2.34)
  );
  ghost3.position.set(
    Math.sin(ghost3Angle) * 9 * Math.sin(ghost3Angle * 2.34),
    Math.sin(ghost3Angle) *
      Math.sin(ghost3Angle * 2.34) *
      Math.sin(ghost3Angle * 3.45),

    Math.cos(ghost3Angle) * 9 * Math.cos(ghost3Angle * 2.34)
  );

  // Render

  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
