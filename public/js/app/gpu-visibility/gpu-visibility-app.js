define([
		"three/three",
		"three/Detector",
		"three/FirstPersonControls",
		"three/OrbitControls",
		"./scene",
		"../keyboard"
	],
	function (THREE, Detector, FirstPersonControls,
			  OrbitControls, appScene, controls) {
		return function () {

			if (!Detector.webgl) {
				Detector.addGetWebGLMessage();
				document.getElementById('container').innerHTML = "";
			}

			var pixels;
			var textureCameraPositions = [
				[0, 50, 0, 200, 0, 0],
				[0, 50, 0, 0, 0, 200],
				[0, 50, 0, -200, 0, 0],
				[0, 50, 0, 0, 0, -200],
				[0, 100, 0, 0, 0, 0]
			];


			var camera,
				textureCamera;

			var scene = appScene.scene,
				altScene = appScene.altScene,
				renderer = appScene.renderer,
				stats = appScene.stats,
				char = appScene.char,
				materials = appScene.materials,
				worldWidth = appScene.worldWidth,
				worldDepth = appScene.worldDepth,
				getY = appScene.getY;

			var clock = new THREE.Clock();

			var renderTarget;


			init();
			animate();

			function updateCamera() {
				var d = 1000;
				camera.position.set(char.position.x - d,
					char.position.y + d, char.position.z - d);

				//camera.rotation.order = 'YXZ';
				//camera.rotation.y = - Math.PI / 4;
				//camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
				//camera.rotation.z = 0;

				camera.lookAt(char.position);
			}

			function init() {

				var container = document.getElementById('container');

				//camera = new THREE.PerspectiveCamera(60, window.innerWidth /
				//	window.innerHeight, 1, 20000);
				var aspect = window.innerWidth / window.innerHeight;
				var d = 1000;
				camera = new THREE.OrthographicCamera(-d * aspect * 0.5, d *
					aspect * 0.5, d, -d, 1, 20000);
				//camera.position.y = getY(worldWidth /2 , worldDepth / 2) *
				// 100 + 100;

				//orbit = new THREE.OrbitControls(camera);

				container.innerHTML = "";
				container.appendChild(renderer.domElement);
				container.appendChild(stats.domElement);


				window.addEventListener('resize', onWindowResize, false);
				controls.register();
				//$(document).click(function () {
				//	logged = false;
				//});


				textureCamera = new THREE.PerspectiveCamera(90, 1,
					0.1/*Math.sqrt(500*500*2)*/, 10000);

				//textureCamera =new THREE.OrthographicCamera(-500, 500, -500,
				// 500, 0.1, 20000); scene.add(textureCamera);
				// scene.add(camera);


				renderTarget =
					new THREE.WebGLRenderTarget(200, 200, {format: THREE.RGBAFormat});
				renderTarget.minFilter = THREE.LinearFilter;
				renderTarget.generateMipmaps = false;

				pixels =
					new Uint8Array(renderTarget.width * renderTarget.height *
						4);
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize(window.innerWidth, window.innerHeight);

				//controls.handleResize();
			}

			function animate() {
				requestAnimationFrame(animate);

				var delta = clock.getDelta();
				var speed = 500;
				if (controls.moveBackward) char.position.z -= delta * speed;
				if (controls.moveForward) char.position.z += delta * speed;
				if (controls.moveLeft) char.position.x += delta * speed;
				if (controls.moveRight) char.position.x -= delta * speed;

				char.position.y =
					getY(Math.round(char.position.x / 100 + worldWidth /2),
						Math.round(char.position.z / 100 + worldDepth / 2)) *
					100 + 100;

				render();
				stats.update();
			}


			var logged = false;
			var ids;

			function render() {
				updateCamera();

				var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

				//camera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
				//camera.updateProjectionMatrix();

				for (i = 0; i < materials.length; i++) {
					materials[i].opacity = 0.2;
					materials[i].needsUpdate = true;
					//materials[i].depthWrite = false;
				}

				var color = new THREE.Color();

				if (!logged) {
					ids = new Set();
				}

				for (var tp = 0; tp < textureCameraPositions.length; tp++) {
					var tcp = textureCameraPositions[tp];
					textureCamera.position.set(char.position.x + tcp[0],
						char.position.y + tcp[1],
						char.position.z + tcp[2]);
					var p = char.position.clone();
					p.x += tcp[3];
					p.y += tcp[4];
					p.z += tcp[5];

					textureCamera.lookAt(p);
					textureCamera.aspect = 1;
					textureCamera.updateProjectionMatrix();

					renderer.setViewport(0, 0, renderTarget.width,
						renderTarget.height);
					renderer.render(altScene, textureCamera, renderTarget,
						true);
					renderer.readRenderTargetPixels(renderTarget, 0, 0,
						renderTarget.width, renderTarget.height, pixels);
					for (var i = 0; i < pixels.length; i += 4) {
						color.setRGB(pixels[i] / 255, pixels[i + 1] / 255,
							pixels[i + 2] / 255);

						var id = Math.round(color.getHex()
							/* * tmpGeometry.faces.length / 0xffffff*/);

						if (!logged) {
							ids.add(id);
						}

						if (id < materials.length) {
							materials[id].opacity = 1;
							//materials[i].depthWrite = true;
							materials[id].needsUpdate = true;
						}
					}
					//if (!logged ) {
					//	console.log(pixels.length, pixels);
					//}

					if (!logged) {
						console.log(ids);
					}

				}
				logged = true;

				//for ( var i = 0; i < tmpGeometry.faces.length; i ++ ) {
				//	var face = tmpGeometry.faces[ i ];
				//	face.materialIndex = Math.round(Math.random() * 2);
				//}

				renderer.setViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
				renderer.clear();

				// left side
				renderer.setViewport(1, 1, 0.5 * SCREEN_WIDTH - 2,
					SCREEN_HEIGHT - 2);
				renderer.render(scene, camera);


				for (i = 0; i < materials.length; i++) {
					materials[i].opacity = 1;
					materials[i].needsUpdate = true;
				}
				//// right side
				renderer.setViewport(0.5 * SCREEN_WIDTH + 1,
					renderTarget.height + 1, renderTarget.width,
					renderTarget.height);
				renderer.render(scene, textureCamera);


				renderer.setViewport(0.5 * SCREEN_WIDTH + 1, 1,
					renderTarget.width, renderTarget.height);
				renderer.render(altScene, textureCamera);
			}
		}
	});