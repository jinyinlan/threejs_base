//sun noise vertex
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x,position.y,position.z, 1.0 );
    vUv = uv;
    vPosition = position;
}