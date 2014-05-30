#ifdef GL_ES
	precision highp float;
#endif

uniform float time;

void main()
{
	gl_FragColor = vec4(vec3(1, 1, 1), 0.5);
}