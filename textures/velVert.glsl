// switch on high precision floats
//velVert
#ifdef GL_ES
precision highp float;
#endif

varying vec2 vUv;
uniform float time;

void main()
{
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}