    #ifdef GL_ES
    precision highp float;
    #endif
    varying vec2 vUv;



    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main()
    {

    vec3 col;
    col.r = rand(vec2(vUv.x, vUv.y));
    col.g = rand(vec2(vUv.x, vUv.y + 1.0));
    col.b = rand(vec2(vUv.x, vUv.y + 2.0));

    gl_FragColor = vec4(col, 1.0);
    }