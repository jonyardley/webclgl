var THREE = require('three/build/three'),
	CL = require('WebCLGL');

//setup
var dispSize = {x:window.innerWidth, y:window.innerHeight};


var scene = new THREE.Scene(),
	camera = new THREE.PerspectiveCamera( 45, dispSize.x/dispSize.y, 0.1, 100 );
	renderer = new THREE.WebGLRenderer({alpha: false });

camera.position.z = 1;
camera.position.y = 0;
camera.position.x = 0;

scene.add(camera);

renderer.setSize(dispSize.x, dispSize.y);
renderer.setClearColor(0x000000, false);
renderer.setBlending(THREE.AdditiveBlending);

//attach renderer to dom
document.body.appendChild( renderer.domElement );



//textures
var texSize = 32;
var velTexture = [];
var posTexture = [];

velTexture[0] = new THREE.WebGLRenderTarget(
	texSize,
	texSize, {
		format: THREE.RGBFormat,
		generateMipmaps: false,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType
	}
);

posTexture[0] = new THREE.WebGLRenderTarget(
	texSize,
	texSize, {
		format: THREE.RGBFormat,
		generateMipmaps: false,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType
	}
);


velTexture[1] = new THREE.WebGLRenderTarget(
	texSize,
	texSize, {
		format: THREE.RGBFormat,
		generateMipmaps: false,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType
	}
);

posTexture[1] = new THREE.WebGLRenderTarget(
	texSize,
	texSize, {
		format: THREE.RGBFormat,
		generateMipmaps: false,
		magFilter: THREE.NearestFilter,
		type: THREE.FloatType
	}
);

console.log(posTexture);

var processCamera = new THREE.OrthographicCamera(-texSize/2,
		texSize/2,
		texSize/2,
		-texSize/2,
		-1,
		0
);

var velScene = new THREE.Scene(),
	posScene = new THREE.Scene();

var velVert = require('./textures/velVert.glsl');
var velFrag = require('./textures/velFrag.glsl');

var velUniforms = {
	velTex: {type: "t", value: velTexture[0]},
	posTex: {type: "t", value: posTexture[0]},
	targetPos: {type: "v3", value: new THREE.Vector3(0.7, 0.5, 0.5)},
	time: 	{ type: "f", value: 1.0 },
	gravDist: 	{ type: "f", value: 1000.0 }
};

var velMaterial = new THREE.ShaderMaterial( {
	uniforms: velUniforms,
	vertexShader:velVert,
	fragmentShader:velFrag,
	depthWrite: false
});

var velPlane = new THREE.Mesh(new THREE.PlaneGeometry(texSize,
	texSize), velMaterial);

velScene.add(velPlane);




var posVert = require('./textures/posVert.glsl');
var posFrag = require('./textures/posFrag.glsl');

var posUniforms = {
	posTex: {type: "t", value: posTexture[0]},
	velTex: {type: "t", value: velTexture[0]},
	time: 	{ type: "f", value: 1.0 }
};

var posMaterial = new THREE.ShaderMaterial( {
	uniforms: posUniforms,
	vertexShader:posVert,
	fragmentShader:posFrag,
	depthWrite: false
});

var posPlane = new THREE.Mesh(new THREE.PlaneGeometry(texSize,
	texSize), posMaterial);

posScene.add(posPlane);


var randScene = new THREE.Scene();

var randVert = require('./textures/randVert.glsl');
var randFrag = require('./textures/randFrag.glsl');

var randUniforms = {
	time: 	{ type: "f", value: 1.0 }
};



var randMaterial = new THREE.ShaderMaterial( {
	uniforms: randUniforms,
	vertexShader:randVert,
	fragmentShader:randFrag,
	depthWrite: false
});


var randPlane = new THREE.Mesh(new THREE.PlaneGeometry(texSize,
	texSize), randMaterial);

randScene.add(randPlane);




var dispVert = require('./textures/displayVert.glsl');
var dispFrag = require('./textures/displayFrag.glsl');

var dispUniforms = {
	posTex: {type: "t", value: posTexture[0]},
	time: 	{ type: "f", value: 1.0 },
	texSize: 	{ type: "f", value: texSize }
};

var dispMaterial = new THREE.ShaderMaterial( {
	uniforms: dispUniforms,
	vertexShader:dispVert,
	fragmentShader:dispFrag,
	depthWrite: false,
	transparent: true,
	blending: THREE.AdditiveBlending
});



var particles = new THREE.Geometry();

for (var i = 0; i < 1000; i++) {
	particles.vertices.push(new THREE.Vector3((i % texSize)/texSize, Math.floor(i/texSize)/texSize , 0)); //   i/texSize
}

var particleMesh = new THREE.ParticleSystem(particles, dispMaterial);

scene.add(particleMesh);

var buffer = 0;
var rand = true;

//animate!
function render() {


	var a, b;
	if (buffer == 1) {
		buffer = 0;
		a = 1;
		b = 0;
	} else {
		buffer = 1;
		a = 0;
		b = 1;
	}

	if (rand == true) {
		renderer.render(randScene, processCamera, velTexture[a]);
		renderer.render(randScene, processCamera, posTexture[a]);
		rand = false;
	}

	velUniforms.velTex.value = velTexture[a];
	velUniforms.posTex.value = posTexture[a];

	renderer.render(velScene, processCamera, velTexture[b]);

	posUniforms.velTex.value = velTexture[b];
	posUniforms.posTex.value = posTexture[a];

	renderer.render(posScene, processCamera, posTexture[b]);

	dispUniforms.posTex.value = posTexture[b];

	renderer.setViewport(0,0,dispSize.x, dispSize.y);

	renderer.render(scene, camera);

	requestAnimationFrame(render);

}
render();