import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug GUI
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Load multiple textures
const textures = {
    matcap1: textureLoader.load('textures/matcaps/1.png'),
    matcap2: textureLoader.load('textures/matcaps/2.png'),
    matcap3: textureLoader.load('textures/matcaps/3.png'),
    matcap4: textureLoader.load('textures/matcaps/4.png'),
    matcap5: textureLoader.load('textures/matcaps/5.png'),
    matcap6: textureLoader.load('textures/matcaps/6.png'),
    matcap7: textureLoader.load('textures/matcaps/7.png'),
    matcap8: textureLoader.load('textures/matcaps/8.png'),
};

// Default materials for text and donuts
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: textures.matcap1 });
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: textures.matcap2 });

// Array to store donut meshes
const donuts = [];

/**
 * Fonts
 */
const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    // Text
    const textGeometry = new TextGeometry('Michelle Alyzza Ty', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
    });
    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);

    // Donuts
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.x = (Math.random() - 0.5) * 10;
        donut.position.y = (Math.random() - 0.5) * 10;
        donut.position.z = (Math.random() - 0.5) * 10;
        donut.rotation.x = Math.random() * Math.PI;
        donut.rotation.y = Math.random() * Math.PI;
        const scale = Math.random();
        donut.scale.set(scale, scale, scale);

        scene.add(donut);
        donuts.push(donut);
    }

    // GUI Controls for Textures and Colors
    const options = {
        textTexture: 'matcap1', // Default texture for text
        donutTexture: 'matcap2', // Default texture for donuts
        textColor: '#ffffff', // Default color for text
        donutColor: '#ffffff', // Default color for donuts
        wireframeText: false, // Wireframe toggle for text
        wireframeDonut: false, // Wireframe toggle for donuts
    };

    // Texture Selectors
    gui.add(options, 'textTexture', Object.keys(textures)).onChange((value) => {
        textMaterial.matcap = textures[value];
        textMaterial.needsUpdate = true;
    });

    gui.add(options, 'donutTexture', Object.keys(textures)).onChange((value) => {
        donutMaterial.matcap = textures[value];
        donutMaterial.needsUpdate = true;
    });

    // Color Pickers
    gui.addColor(options, 'textColor').onChange((value) => {
        textMaterial.color.set(value);
        textMaterial.needsUpdate = true;
    });

    gui.addColor(options, 'donutColor').onChange((value) => {
        donutMaterial.color.set(value);
        donutMaterial.needsUpdate = true;
    });

    // Wireframe Toggle for Donuts
    gui.add(options, 'wireframeDonut').onChange((value) => {
        donuts.forEach((donut) => {
            donut.material.wireframe = value;
        });
    });

    // Wireframe Toggle for Text
    gui.add(options, 'wireframeText').onChange((value) => {
        text.material.wireframe = value; // Apply wireframe toggle to text material
    });
});

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, // Allow background gradients
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
