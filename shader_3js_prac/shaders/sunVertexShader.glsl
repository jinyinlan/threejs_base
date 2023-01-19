//sun shape vertex shader
const float HALF_PI = 1.570796327;
uniform float u_time;
uniform float u_velocity;
uniform float u_stagger;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 vLayer3;
varying vec3 vNormal;
varying vec3 vEyeVector;

mat2 rotation2d(float angle) {
	float s = sin(angle);
	float c = cos(angle);

	return mat2(
		c, -s,
		s, c
	);
}

mat4 rotation3d(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;

  return mat4(
		oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
		0.0,                                0.0,                                0.0,                                1.0
	);
}

vec2 rotate(vec2 v, float angle) {
	return rotation2d(angle) * v;
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

vec3 getEyeVector(mat4 modelMat,vec3 pos,vec3 camPos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    vec3 eyeVector=normalize(worldPosition.xyz-camPos);
    return eyeVector;
}


void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position.x,position.y,position.z, 1.0 );
    vec3 pos = position;
    float displacement1 = u_velocity*u_time;
    float displacement2 = u_velocity*(u_time*1.5+u_stagger*1.);
    float displacement3 = u_velocity*(u_time*2.+u_stagger*2.);
    vec3 xy = vec3(1.,1.,0.);
    vec3 xz = vec3(1.,0.,1.);
    vec3 yz = vec3(0.,1.,1.);
    vec3 layer1 = rotate(pos,xy,displacement1);
    vec3 layer2 = rotate(pos,xz,displacement2);
    vec3 layer3 = rotate(pos,yz,displacement3);

    vUv = uv;
    vPosition = position;
    vLayer1 = layer1;
    vLayer2 = layer2;
    vLayer3 = layer3;
    vNormal = normal;
    vEyeVector = getEyeVector(modelMatrix,position,cameraPosition);
}