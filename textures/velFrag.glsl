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


	float dist = max(distance(targetPos, pos), 1.0);

	vec3 delta = normalize(targetPos - pos);

	vel = vel + (delta * 0.015);

	vel = vel + vec3(0.0, 0.004, 0.0);

	gl_FragColor = vec4(vel, 1.0);
}


//old
	//float force = 5.0;
	//vec3 centerPoint = vec3(0.0, 0.0, 0.0);

//	float dist = max(distance(centerPoint, pos) * gravDist, 1.0);

//	vec3 delta = normalize(centerPoint - pos);

//	vel = vel*0.90 + (delta * force)/(dist);