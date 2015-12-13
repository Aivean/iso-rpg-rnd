define([
	"three/three",
	"three/Detector",
	"three/OrbitControls",
	"./scene",
], function (THREE, Detector, OrbitControls, scene) {
	return function () {

		if (!Detector.webgl) {
			Detector.addGetWebGLMessage();
			document.getElementById('container').innerHTML = "";
		}


		var renderer = new THREE.WebGLRenderer();
		renderer.setClearColor(0xbfd1e5);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.autoClear = false;

		var container = document.getElementById('container');

		var camera = new THREE.PerspectiveCamera(60, window.innerWidth /
			window.innerHeight, 0.01, 20000);
		camera.up.set( 0, 0, 1 );
		camera.position.set(faceData.camera.x, faceData.camera.y, faceData.camera.z);
		camera.lookAt(faceData.char.x, faceData.char.y, faceData.char.z);
		camera.updateProjectionMatrix();


		//var aspect = window.innerWidth / window.innerHeight;
		//var d = 1000;
		//var camera = new THREE.OrthographicCamera(-d * aspect * 0.5, d *
		//	aspect * 0.5, d, -d, 1, 20000);
		//camera.position.y = getY(worldWidth /2 , worldDepth / 2) *
		// 100 + 100;

		new THREE.OrbitControls(camera);

		container.innerHTML = "";
		container.appendChild(renderer.domElement);


		function animate() {
			requestAnimationFrame(animate);

			render();
		}

		function render() {
			renderer.clear();
			renderer.render(scene, camera);
		}

		animate();

	};
});