#ifdef GL_ES
	precision highp float;
#endif

uniform float time;

void main()
{
	gl_FragColor = vec4(vec3(0.1, 0.8, 0.0), 0.04);
}