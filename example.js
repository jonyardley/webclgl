/**
 * WARNING:
 * EXTREMELY UGLY CODE.
 *
 * This is how I learned javascript, opengl and three js.
 *
 *
 * If you do not like the sight of bad code, divert your gaze now.
 */


var container = document.getElementById('container');

var renderer;
var scene;
var camera;
var stats;
var sphere;
var rtTexture;
var velScene;
var processCamera;
var velUniforms;
var clock = new THREE.Clock();
var controls;
var line;

var cameraControls;


var posScene;
var dispScene;
var randScene;

var velTexture;
var posTexture;


var posUniforms;
var dispUniforms;

var mouse = {x:0,y:0};

var projector;

var canvas;

var texSize = 1024;
var dispSize = {x:window.innerWidth, y:window.innerHeight};

var paused = false;

/**
 * It doesnt get any better.
 */
function init() {
	renderer = new THREE.WebGLRenderer({alpha: false });
	renderer.setClearColor(0x000000, false);


	projector = new THREE.Projector();


	// scene = new THREE.Scene();

	$("#help").click(function() {
		console.log("clicked help");
		$(this).fadeOut();
	});

	renderer.setSize(dispSize.x, dispSize.y);

	renderer.setBlending(THREE.AdditiveBlending);

	canvas = renderer.domElement;

	container.appendChild(canvas);


	/**
	 * It actually gets worse.
	 */

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );


	var Settings = function() {
		this.paused = false;
		this.gravDistance = 3.0;
		this.show_help = showHelp;
	};

	var settings = new Settings();

	var gui = new dat.GUI();
	//gui.add(this, 'pause');
	gui.add(settings, 'paused').onChange(function(value) {
		paused = value;
	});
	gui.add(settings, 'gravDistance', 0.0, 6.0).onChange(function(value) {
		velUniforms.gravDist.value = Math.pow(10.0, value);
	});

	gui.add(settings, 'show_help');


	velTexture = [];
	posTexture = [];


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


	processCamera = new THREE.OrthographicCamera(-texSize/2,
			texSize/2,
			texSize/2,
			-texSize/2,
		-1,
		0
	);


	velScene = new THREE.Scene();
	posScene = new THREE.Scene();

	var velVert = $('#velVert').text();
	var velFrag = $('#velFrag').text();
	velUniforms = {
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







	var posVert = $('#posVert').text();
	var posFrag = $('#posFrag').text();

	posUniforms = {
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





	randScene = new THREE.Scene();
	var randVert = $('#randVert').text();
	var randFrag = $('#randFrag').text();

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



	// Display

	dispScene = new THREE.Scene();



	camera = new THREE.PerspectiveCamera( 45, dispSize.x/dispSize.y, 0.1, 100 );
	camera.position.z = 1;
	camera.position.y = 0;
	camera.position.x = 0;

	/*
	 camera = new THREE.OrthographicCamera(0,
	 1,
	 1,
	 0,
	 -1,
	 10
	 );

	 */
	//controls = new THREE.OrbitControls( camera );

	dispScene.add(camera);

	cameraControls = new THREE.OrbitControls(camera);

	cameraControls.userPanSpeed = 0;


	var dispVert = $('#dispVert').text();
	var dispFrag = $('#dispFrag').text();

	dispUniforms = {
		posTex: {type: "t", value: posTexture[0]},
		time: 	{ type: "f", value: 1.0 },
		texSize: 	{ type: "f", value: texSize }

	};





	var dispAttributes = {
		id: {type: 'f', value: []}
	};

	var dispMaterial = new THREE.ShaderMaterial( {
		uniforms: dispUniforms,
		//attributes: dispAttributes,
		vertexShader:dispVert,
		fragmentShader:dispFrag,
		depthWrite: false,
		transparent: true,
		blending: THREE.AdditiveBlending
	});



	//var dispPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), dispMaterial);

	var particles = new THREE.Geometry();


	for (var i = 0; i < 1000000; i++) {
		particles.vertices.push(new THREE.Vector3((i % texSize)/texSize, Math.floor(i/texSize)/texSize , 0)); //   i/texSize
	}
//    particles.vertices.push(new THREE.Vector3(1, 1, 0));
//    particles.vertices.push(new THREE.Vector3(0, 0, 0));
//    particles.vertices.push(new THREE.Vector3(1, 0, 0));

	/*
	 particles.normals.push(new THREE.Vector3(0,0,0));
	 particles.normals.push(new THREE.Vector3(1,0,0));
	 particles.normals.push(new THREE.Vector3(2,0,0));
	 particles.normals.push(new THREE.Vector3(3,0,0));
	 */

	//var particleMesh = new THREE.ParticleSystem(particles, dispMaterial);

	var particleMesh = new THREE.ParticleSystem(particles, dispMaterial);

	/*
	 for( var v = 0; v < particleMesh.geometry.vertices.length; v++ ) {
	 dispMaterial.attributes.id.value[v] = v;
	 }

	 */




	dispScene.add(particleMesh);





	document.addEventListener('mousedown', mouseDown);
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener('keydown', keyDown);
	window.addEventListener( 'resize', onWindowResize, false );

	/*
	 document.addEventListener('mouseup', mouseUp);*/

}

var buffer = 0;
var rand = true;

function render() {
	//velUniforms.time.value = clock.getElapsedTime();

	//controls.update();
//    console.log(scene, camera, rtTexture);

	//renderer.render(scene, camera, rtTexture);

	cameraControls.update();



	var pickVal = pick();

//    console.log(pickVal);

	velUniforms.targetPos.value = pickVal;

	if (!paused) {
		var a, b;

//        renderer.setSize(texSize, texSize, false);
		renderer.setViewport(0,0,texSize, texSize);

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

//        renderer.setSize(dispSize, dispSize, false);
		renderer.setViewport(0,0,dispSize.x, dispSize.y);

	}


	renderer.render(dispScene, camera);

	//renderer.render(randScene, processCamera);

//    renderer.render(scene, camera);
	stats.update();
	window.requestAnimationFrame(render);
}


function keyDown(e) {
	console.log(e);
	if(e.keyCode === 32 || e.keyCode === 80) {
		pause();
	}
}

function pause() {
	paused = !paused;
	console.log("Paused");

}

function relMouseCoords(event){
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var canvasX = 0;
	var canvasY = 0;
	var currentElement = this;

	do{
		totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
		totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
	}
	while(currentElement = currentElement.offsetParent)

	canvasX = event.pageX - totalOffsetX;
	canvasY = event.pageY - totalOffsetY;

	return {x:canvasX, y:canvasY}
}

HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

function mouseDown(e) {

	console.log(e);
	var coords = canvas.relMouseCoords(e);
	console.log(coords);

	/*
	 event.preventDefault();
	 mouse.x = ( event.clientX / window.innerWidth );
	 mouse.y = 1-( event.clientY / window.innerHeight );


	 velUniforms.targetPos.value.set(mouse.x, mouse.y, 0);

	 console.log(mouse);
	 */
	/*
	 var item = pick();
	 console.log(item);
	 $('#item').css({'visibility':'visible'});

	 $('#item').html(item);
	 $('#item').offset({left: event.pageX-30, top: event.pageY-30});*/


}

function mouseUp(event) {
	event.preventDefault();
	$('#item').css({'visibility':'hidden'});
	//$('#item').offset({left: event.pageX, top: event.pageY});

}

function onDocumentMouseMove(e) {

	e.preventDefault();

//    console.log(e);

	//var coords = canvas.relMouseCoords(e);

	mouse.x = ( e.clientX / canvas.width )  * 2 - 1;
	mouse.y = - ( e.clientY / canvas.height)  * 2 + 1;

//    mouse.x = ( event.clientX / window.innerWidth );
//    mouse.y = 1-( event.clientY / window.innerHeight );

//    velUniforms.targetPos.value.set(mouse.x, mouse.y, 0);
	//line.geometry.verticesNeedUpdate = true;

}

function onWindowResize( event ) {

//    renderer.setSize( window.innerWidth, window.innerHeight );

//    if (paused) {
//        renderer.setSize(dispSize, dispSize, false);
//    }

	dispSize.x = window.innerWidth;
	dispSize.y = window.innerHeight;

	camera.aspect = dispSize.x / dispSize.y;
	camera.updateProjectionMatrix();

	renderer.setSize(dispSize.x, dispSize.y);




//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();

}

function showHelp() {
	console.log("clicked show Help");
	$("#help").fadeIn();
}

function loadItem(name) {
	console.log("models/"+name+".js");
	loader.load("models/"+name+".js" ,  function (geometry, materials) {
//        var material = new THREE.MeshPhongMaterial();
		//var faceMaterial = new THREE.MeshFaceMaterial( materials );

		var mesh;
		var texture = THREE.ImageUtils.loadTexture("textures/cache/"+name+".png",undefined,function(){
			console.log("textureLoaded");
			var tex = THREE.ImageUtils.loadTexture("textures/"+name+".png",undefined,function(){
				mesh.material.map = tex;
			});


		});
		mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map:texture}));
		mesh.scale.set(10, 10, 10);
		scene.add(mesh);
		console.log("IN HERE!")
	});
}

function updateLine() {
	console.log('lineUpdated');

	line.geometry.vertices = lineVerticies;
	line.geometry.verticesNeedUpdate = true;
	console.log(line);
}

//var lineVerticies;

function pick() {
	// find intersections


	var vector = new THREE.Vector3( mouse.x, mouse.y, 0);

//    console.log(vector);
	projector.unprojectVector( vector, camera );

//    console.log(camera);
//    console.log(vector);
//    console.log(mouse);

	var cameraPost = camera.position.clone()

	var dist = cameraPost.distanceTo(new THREE.Vector3(0,0,0));

	return cameraPost.add((vector.sub( camera.position ).normalize()).multiplyScalar(dist));//vector;//(vector.multiplyScalar(5.0)).add(camera.position);


	//var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	//lineVerticies = [raycaster.ray.origin, raycaster.ray.direction];

//    lineVerticies = [new THREE.Vector3(0,0,0), new THREE.Vector3(10,0,0)];




	/*
	 var intersects = raycaster.intersectObjects( scene.children, false );

	 var name = null;

	 if ( intersects.length > 0 ) {
	 //        console.log(intersects);
	 //        console.log(intersects[0].face.materialIndex);
	 //        console.log(intersects[0].object.material.materials);
	 name = intersects[0].object.material.materials[intersects[0].face.materialIndex].name
	 //        console.log(camera);
	 if ( INTERSECTED != intersects[ 0 ].object ) {


	 //            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
	 //
	 INTERSECTED = intersects[ 0 ].object;
	 //            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
	 //            INTERSECTED.material.emissive.setHex( 0xff0000 );

	 }

	 } else {

	 //        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

	 INTERSECTED = null;

	 }
	 return name;
	 */
}



init();
render();