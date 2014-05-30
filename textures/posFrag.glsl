#ifdef GL_ES
 	precision highp float;
 #endif

 varying vec2 vUv;
 uniform float time;
 uniform sampler2D velTex;
 uniform sampler2D posTex;

 void main()
 {
 	vec3 vel = texture2D(velTex, vUv).rgb;
 	vec3 pos = texture2D(posTex, vUv).rgb;

 	pos += (vel)*0.01;

 	gl_FragColor = vec4(pos, 1.0);
 }