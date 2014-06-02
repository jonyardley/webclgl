// switch on high precision floats
//displayVert
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform sampler2D posTex;
uniform float texSize;

void main()
{
	vec3 mvPosition = texture2D(posTex, position.xy).rgb;
	gl_PointSize = 1.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(mvPosition,0.1);
}