uniform float u_time;
varying vec3 pos;
void main(){
gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x,sin(position.z+u_time)+position.y,position.z, 1.0 );
pos = gl_Position.xyz;
}