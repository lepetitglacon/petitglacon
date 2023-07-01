import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import './assets/gltf/logo.glb'
import './assets/img/earth.png'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 3.5;
camera.position.y = .5;

const renderer = new THREE.WebGLRenderer();
renderer.antialias = true
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

window.addEventListener( 'resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight.castShadow = true
scene.add( directionalLight );

let logo = undefined
const loader = new GLTFLoader();
loader.load(
    // resource URL
    'src/assets/gltf/logo.glb',
    function ( gltf ) {

        const texture = new THREE.TextureLoader().load('src/assets/img/earth.png' );
        const material = new THREE.MeshMatcapMaterial(  );
        material.map = texture
        material.roughness = .5

        logo = gltf.scene.children[0]
        logo.castShadow = true
        logo.material = material
        logo.rotation.x = 1.5
        scene.add( logo );
    },
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    function ( error ) {
        console.log( error,  'An error happened' );
    }
);

let isClicked = false
let initX = 0
let velocity = new THREE.Vector3()
let maxVelocity = .5

window.addEventListener('mousemove', (e) => {
    if (isClicked) {
        const delta = initX - e.clientX

        if (delta > 0) {
            // logo.rotation.z += .01
            velocity.z += .005
        } else {
            // logo.rotation.z-= .01
            velocity.z -= .005
        }

        if (velocity.z >= maxVelocity) {
            velocity.z = maxVelocity
        }
        if (velocity.z <= -maxVelocity) {
            velocity.z = -maxVelocity
        }

        initX = e.clientX
    }
})

window.addEventListener('mousedown', (e) => {
    isClicked = true
    initX = e.clientX
})

window.addEventListener('mouseup', (e) => {
    isClicked = false
})


function animate() {
    requestAnimationFrame( animate );

    if (logo !== undefined) {
        logo.rotation.z += velocity.z;
    }

    if (velocity.z < .01 && velocity.z > -.01) {
        velocity.z = 0
    } else if (velocity.z > 0) {
        velocity.z -= .005
    } else if (velocity.z < 0) {
        velocity.z += .005
    }

    renderer.render( scene, camera );
}

animate();