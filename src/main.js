import * as THREE from '../node_modules/three';
import { NoiseGenerator } from './noise_generator';

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

const inputSrc = new Input(canvas);
let dt = 0;

let cameraMoveSpeed = 50;
let cameraRotSpeed = Math.PI/2;
let camRotRange = 150 * Math.PI / 180;

let noiseGenerator;
let CHUNK_SIZE = 100;
let NOISE_DENSITY = 40;
let CHUNK_SCALE = 1;
let MAX_CHUNK_HEIGHT = 20;
let RENDER_DISTANCE = 5;
let chunkDict;
let persistence = .5;
let lacunarity = .5;

let persistenceInput = document.getElementById("Persistence");
persistenceInput.oninput = ()=> {
    let newVal = parseInt(persistenceInput.value) / 100;
    persistence = newVal;
    noiseGenerator = new NoiseGenerator(203, NOISE_DENSITY, persistence, lacunarity, 5);
    clearChunks();
};
let lacunarityInput = document.getElementById("Lacunarity");
lacunarityInput.oninput = ()=> {
    let newVal = parseInt(lacunarityInput.value) / 25;
    lacunarity = newVal;
    noiseGenerator = new NoiseGenerator(203, NOISE_DENSITY, persistence, lacunarity, 5);
    clearChunks();
};
let noiseScaleInput = document.getElementById("NoiseScale");
noiseScaleInput.oninput = ()=> {
    let newVal = parseInt(noiseScaleInput.value) / 5 + 20;
    NOISE_DENSITY = newVal;
    noiseGenerator = new NoiseGenerator(203, NOISE_DENSITY, persistence, lacunarity, 5);
    clearChunks();
};
let meshScaleInput = document.getElementById("MeshScale");
meshScaleInput.oninput = ()=> {
    let newVal = parseInt(meshScaleInput.value) / 10 + 1;
    CHUNK_SCALE = newVal;
    noiseGenerator = new NoiseGenerator(203, NOISE_DENSITY, persistence, lacunarity, 5);
    clearChunks();
};
let terrainHeightInput = document.getElementById("TerrainHeight");
terrainHeightInput.oninput = ()=> {
    let newVal = parseInt(terrainHeightInput.value);
    MAX_CHUNK_HEIGHT = newVal;
    clearChunks();
};

/* LIGHTS */
const directional_color = 0xFFFFFF;
const directional_intensity = 3;

const directional_light = new THREE.DirectionalLight(directional_color, directional_intensity);
directional_light.position.set(-1, 2, 4);
scene.add(directional_light);

const ambient_color = 0xFFFFFF;
const ambient_intensity = 0.25;
const ambient_light = new THREE.AmbientLight(ambient_color, ambient_intensity);
scene.add(ambient_light);
/* LIGHTS */

function getGeometry(vertices, indices) {
    const meshGeometry = new THREE.BufferGeometry();
    meshGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    meshGeometry.setIndex(indices);
    meshGeometry.computeVertexNormals();
    return meshGeometry;
}
function getObject(geometry, color, position) {
    const material = new THREE.MeshPhongMaterial( { color: color } );
    const object = new THREE.Mesh(geometry, material);
    object.position.copy(position);
    return object;
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

function clearChunks() {
    for(let [key, value] of chunkDict) {
        scene.remove(value.mesh);
        chunkDict.delete(key);
    }
}

function updateChunks(playerChunk) {
    for(let [key, value] of chunkDict) {
        let chunk = value;
        let distToPlayer = chunk.coord.distanceTo(playerChunk);
        if(distToPlayer > RENDER_DISTANCE) {
            scene.remove(chunk.mesh);
            chunkDict.delete(key);
        }
    }
    for(let j = -RENDER_DISTANCE; j < RENDER_DISTANCE; j++) {
        for(let i = -RENDER_DISTANCE; i < RENDER_DISTANCE; i++) {
            const dictKey = 'x:'+(playerChunk.x+i)+"|y:"+(playerChunk.y+j);
            const chunkCoord = new THREE.Vector2((playerChunk.x+i), (playerChunk.y+j));
            if(chunkCoord.distanceTo(playerChunk) <= RENDER_DISTANCE && !chunkDict.has(dictKey)) {
                let heightMap = noiseGenerator.getMap(new THREE.Vector2(chunkCoord.x * CHUNK_SIZE, chunkCoord.y * CHUNK_SIZE), new THREE.Vector2(CHUNK_SIZE+1, CHUNK_SIZE+1));
                let meshData = TerrainGenerator.getPlane(heightMap, CHUNK_SCALE, MAX_CHUNK_HEIGHT);
                let planeGeometry = getGeometry(meshData.vertices, meshData.indices);
                let plane = getObject(planeGeometry,  0x00FFaa, new THREE.Vector3(chunkCoord.x * CHUNK_SIZE * CHUNK_SCALE, chunkCoord.y * CHUNK_SIZE * CHUNK_SCALE, 0));
                scene.add(plane);
                chunkDict.set(dictKey, {mesh: plane, coord: chunkCoord});
            }
        }
    }
}
function start() {
    chunkDict = new Map();
    camera.position.z = 40;
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1),  -Math.PI/4);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/3);

    noiseGenerator = new NoiseGenerator(203, NOISE_DENSITY, persistence, lacunarity, 5);

    update();
}

function update() {
    window.requestAnimationFrame(update);

    let movementInput = new THREE.Vector3(inputSrc.getHorizontal(), inputSrc.getForward(), inputSrc.getVertical());
    camera.position.add(movementInput.multiplyScalar(cameraMoveSpeed * dt));

    let rotationInput = new THREE.Vector3(inputSrc.getRotationX(), inputSrc.getRotationY(), 0);
    camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -rotationInput.y * cameraRotSpeed * dt);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotationInput.x * cameraRotSpeed * dt);

    updateChunks(camera.position.clone().divideScalar(CHUNK_SIZE * CHUNK_SCALE).floor());

    renderFrame();
}

function renderFrame() {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
    renderer.render(scene, camera);
    frameCleanup();
}

function frameCleanup() {
    dt = getDT();
}

start();