import './style.css'
import * as THREE from 'three'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

//setting basic environment and link render output ,the canvas, to the html file
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.01,1000);
const renderer = new THREE.WebGLRenderer();
camera.position.set(10,10,10)
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);//connect renderer output(canvas) with html element

//setting light 
const light = new THREE.AmbientLight(0x404040,1);//soft white light
scene.add(light)

//setting axes
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper)

//define unifor data
const uniformData = {
  u_time:{
    type:'f',
    value:0.0,
  },
}
const Clock = new THREE.Clock();

//setting object
const geometry = new THREE.BoxGeometry(5,5,5,5,5,5);
const material = new THREE.ShaderMaterial({
  wireframe:true,
  vertexShader,
  fragmentShader,
  uniforms:uniformData,
});
const Mesh = new THREE.Mesh(geometry,material);
scene.add(Mesh);


function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  camera.lookAt(scene.position);
  uniformData.u_time.value = Clock.getElapsedTime();
  //Mesh.rotation.y-=0.01;
}
animate();


// //setting object:geometry material mesh
// const boxGeometry = new THREE.BoxGeometry(16,16,16,16,16,16);
// const boxMaterial = new THREE.MeshStandardMaterial({
//   color:0x00ff00,
//   wireframe:true,
// });
// const boxMesh = new THREE.Mesh(boxGeometry,boxMaterial);
// scene.add(boxMesh);

// //setting axes
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper)
// //animation to show off the scene

// const glftLoader = new GLTFLoader();
// glftLoader.load(
//   './robo_shiba/scene.gltf',
//   function(gltf){
//     scene.add(gltf.scene);
//     console.log(gltf.scene)
//   }
// );
