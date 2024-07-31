import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x87ceeb);

const controls = new OrbitControls(camera, renderer.domElement);

const vertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vNormal;
    void main() {
        float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
        gl_FragColor = vec4(intensity, intensity, intensity, 1.0);
    }
`;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const cubes = [];
const positions = [
  [-4, 0.5, -2],
  [-1, 0.5, -2],
  [5, 0.5, -2],
  [-2, 0.5, 0],
  [-4, 0.5, 0],
  [5, 0.5, 0],
  [-2, 0.5, 2],
  [-0.5, 0.5, 2],
  [2, 0.5, 2],
];

positions.forEach((position) => {
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(...position);
  scene.add(cube);
  cubes.push(cube);
});

camera.position.set(-1, 4, 5);
camera.lookAt(scene.position);

const dragControls = new DragControls(cubes, camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

dragControls.addEventListener("dragstart", function () {
  controls.enabled = false;
});

dragControls.addEventListener("dragend", function () {
  controls.enabled = true;
});
