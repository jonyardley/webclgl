#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;
uniform float time;
uniform sampler2D velTex;
uniform sampler2D posTex;
uniform vec3 targetPos;
uniform float gravDist;

void main()
{
	vec3 vel = texture2D(velTex, vUv).rgb;
	vec3 pos = texture2D(posTex, vUv).rgb;
	vec3 force = vec3(-0.01, 0, 0);


	//float dist = max(distance(targetPos, pos)*gravDist, 1.0);

	//vec3 delta = normalize(targetPos - pos);

	//vel = vel*0.90 + (delta * force)/(dist);
	vel = vel+force;

	//conform it;
	//vel = clamp(vel, -1.0, 1.0)/2.0+0.5;

	gl_FragColor = vec4(vel, 1.0);
}