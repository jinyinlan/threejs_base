import './style.css'
import * as THREE from 'three'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
import sunNoiseVertexShader from './shaders/sunNoiseVertexShader.glsl'
import sunNoiseFragmentShader from './shaders/sunNoiseFragmentShader.glsl'
import sunVertexShader from './shaders/sunVertexShader.glsl'
import sunFragmentShader from './shaders/sunFragmentShader.glsl'
import sunSurfaceVertexShader from './shaders/sunSurfaceVertexShader.glsl'
import sunSurfaceFragmentShader from './shaders/sunSurfaceFragmentShader.glsl'
import { Mesh } from 'three'

//setting basic environment and link render output ,the canvas, to the html file
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.01,1000);
const renderer = new THREE.WebGLRenderer();
camera.position.set(3,3,3)
renderer.setSize(innerWidth,innerHeight);
document.body.appendChild(renderer.domElement);//connect renderer output(canvas) with html element

//setting light 
const light = new THREE.AmbientLight(0x404040,1);//soft white light
scene.add(light)

//setting axes
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper)

//uniform data detailed
const Clock = new THREE.Clock();
var flowTexture = new THREE.TextureLoader().load('./images/flow.png');
flowTexture.wrapS = THREE.RepeatWrapping;
flowTexture.wrapT = THREE.RepeatWrapping;
var noiseTexture = new THREE.TextureLoader().load('./images/noise.png');
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;
var rgbaNoiseTexture = new THREE.TextureLoader().load('./images/rgba.jpg');

//define uniform data
const uniformData = {
  u_time:{
    value:0.0,
  },
  u_flowTexture:{
    value: flowTexture,
  },
  u_noiseTexture:{
    //value: noiseTexture,
    value: null,
  },
  u_resolution:{
    value:new THREE.Vector2(innerWidth,innerHeight)
  },
  u_velocity:{
    value:0.05
  },
  u_brightness:{
    value:0.3
  },
  u_stagger:{
    value:16
  },
  u_rgbaNoiseTexture:{
    value:rgbaNoiseTexture,
  }
}
//setting group object to combine objects into one group
const group = new THREE.Group();

//setting base sphere
const sphereGeometry = new THREE.SphereGeometry(8,25,25);
const sphereMaterial = new THREE.MeshPhongMaterial(0xffffff,1);
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
//group.add(sphere);

//setting air sphere   //!!!!!!!!!!!try to some exposure effect
const airGeometry = new THREE.SphereGeometry(10,25,25);
const airMaterial = new THREE.ShaderMaterial({
  
  vertexShader,
  fragmentShader,
  uniforms:uniformData,
  transparent:true,
})
const air = new THREE.Mesh(airGeometry,airMaterial);
// group.add(air)

//setting cube render scene for mapping noise texture cube render target+cube camera are needed
const cubeRT = new THREE.WebGLCubeRenderTarget(256);
const cubeCamera = new THREE.CubeCamera(0.1,10,cubeRT);

//group.add(cubeCamera);

//setting sun noise texture 
const sunNoiseGeometry = new THREE.SphereGeometry(1,100,100);
const sunNoiseMaterial = new THREE.ShaderMaterial({
  vertexShader: sunNoiseVertexShader,
  fragmentShader: sunNoiseFragmentShader,
  side: THREE.DoubleSide,
  uniforms:uniformData,
})
const sunNoise = new THREE.Mesh(sunNoiseGeometry,sunNoiseMaterial);
group.add(sunNoise);

//setting sun
const sunGeometry = new THREE.SphereGeometry(1,100,100);
const sunMaterial = new THREE.ShaderMaterial({
  uniforms:uniformData,
  vertexShader:sunVertexShader,
  fragmentShader:sunFragmentShader,
});
const sun = new THREE.Mesh(sunGeometry,sunMaterial);
group.add(sun);



scene.add(group);

function animate(){
  requestAnimationFrame(animate);
  camera.lookAt(scene.position);
  cubeCamera.update(renderer,scene);//have to be implemented when using the cubeCamera
  uniformData.u_time.value = Clock.getElapsedTime();
  uniformData.u_noiseTexture.value = cubeRT.texture;
  renderer.render(scene,camera);
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

// const geometry = new THREE.BoxGeometry(5,5,5,5,5,5);
// const material = new THREE.ShaderMaterial({
//   wireframe:true,
//   vertexShader,
//   fragmentShader,
//   uniforms:uniformData,
// });
// const Mesh = new THREE.Mesh(geometry,material);
// scene.add(Mesh);

// //setting plane
// const sunSurfaceGeometry = new THREE.PlaneGeometry(20,20,15,15);
// const sunSurfaceMaterial = new THREE.ShaderMaterial({
//   vertexShader:sunSurfaceVertexShader,
//   fragmentShader:sunSurfaceFragmentShader,
//   uniforms:uniformData,
//   transparent:true,
// })
// const sunSurface = new Mesh(sunSurfaceGeometry,sunSurfaceMaterial);
// //group.add(sunSurface);