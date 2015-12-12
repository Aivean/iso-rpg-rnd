/**
 * Created by Aivean on 12/12/15.
 */

define(["three/three", "three/stats.min", "three/ImprovedNoise"],
	function (THREE, Stats, ImprovedNoise) {

		var scene = new THREE.Scene();
		var altScene = new THREE.Scene();

		var worldWidth = 10,
			worldDepth = 10,
			worldHalfWidth = worldWidth / 2,
			worldHalfDepth = worldDepth / 2,
			data = generateHeight(worldWidth, worldDepth);

		var materials = [];

		var texture = THREE.ImageUtils.loadTexture(
			assets["three/atlas.png"]);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;


		function generateHeight(width, height) {
			var data = [], perlin = new ImprovedNoise(),
				size = width * height, quality = 2, z = Math.random() * 100;

			for (var j = 0; j < 4; j++) {

				if (j === 0) for (var i = 0; i < size; i++) data[i] = 0;

				for (var i = 0; i < size; i++) {

					var x = i % width, y = ( i / width ) | 0;
					data[i] +=
						perlin.noise(x / quality, y / quality, z) * quality;
				}

				quality *= 4;

			}

			return data;
		}

		function getY(x, z) {
			return ( data[x + z * worldWidth] * 0.2 ) | 0;
		}

		function generateTerrain() {
			// sides
			var matrix = new THREE.Matrix4();

			var pxGeometry = new THREE.PlaneBufferGeometry(100, 100);
			pxGeometry.attributes.uv.array[1] = 0.5;
			pxGeometry.attributes.uv.array[3] = 0.5;
			pxGeometry.rotateY(Math.PI / 2);
			pxGeometry.translate(50, 0, 0);

			var nxGeometry = new THREE.PlaneBufferGeometry(100, 100);
			nxGeometry.attributes.uv.array[1] = 0.5;
			nxGeometry.attributes.uv.array[3] = 0.5;
			nxGeometry.rotateY(-Math.PI / 2);
			nxGeometry.translate(-50, 0, 0);

			var pyGeometry = new THREE.PlaneBufferGeometry(100, 100);
			pyGeometry.attributes.uv.array[5] = 0.5;
			pyGeometry.attributes.uv.array[7] = 0.5;
			pyGeometry.rotateX(-Math.PI / 2);
			pyGeometry.translate(0, 50, 0);

			var pzGeometry = new THREE.PlaneBufferGeometry(100, 100);
			pzGeometry.attributes.uv.array[1] = 0.5;
			pzGeometry.attributes.uv.array[3] = 0.5;
			pzGeometry.translate(0, 0, 50);

			var nzGeometry = new THREE.PlaneBufferGeometry(100, 100);
			nzGeometry.attributes.uv.array[1] = 0.5;
			nzGeometry.attributes.uv.array[3] = 0.5;
			nzGeometry.rotateY(Math.PI);
			nzGeometry.translate(0, 0, -50);

			//

			// BufferGeometry cannot be merged yet.
			tmpGeometry = new THREE.Geometry();
			var pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(
				pxGeometry);
			var nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(
				nxGeometry);
			var pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(
				pyGeometry);
			var pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(
				pzGeometry);
			var nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(
				nzGeometry);

			for (var z = 0; z < worldDepth; z++) {

				for (var x = 0; x < worldWidth; x++) {

					var h = getY(x, z);

					matrix.makeTranslation(
						x * 100 - worldHalfWidth * 100,
						h * 100,
						z * 100 - worldHalfDepth * 100
					);

					var px = getY(x + 1, z);
					var nx = getY(x - 1, z);
					var pz = getY(x, z + 1);
					var nz = getY(x, z - 1);

					tmpGeometry.merge(pyTmpGeometry, matrix);

					if (( px !== h && px !== h + 1 ) || x === 0) {
						tmpGeometry.merge(pxTmpGeometry, matrix);
					}

					if (( nx !== h && nx !== h + 1 ) ||
						x === worldWidth - 1) {
						tmpGeometry.merge(nxTmpGeometry, matrix);
					}

					if (( pz !== h && pz !== h + 1 ) ||
						z === worldDepth - 1) {
						tmpGeometry.merge(pzTmpGeometry, matrix);
					}

					if (( nz !== h && nz !== h + 1 ) || z === 0) {
						tmpGeometry.merge(nzTmpGeometry, matrix);
					}
				}
			}


			for (var i = 0; i < tmpGeometry.faces.length; i++) {
				var face = tmpGeometry.faces[i];
				face.color.setHex(i);
				face.materialIndex = i;
				materials.push(
					new THREE.MeshLambertMaterial({
						side: THREE.DoubleSide,
						transparent: true,
						map: texture,
						opacity: 1
					})
				);
			}

			return tmpGeometry;
		}


		var buffGeometry = new THREE.BufferGeometry().fromGeometry(
			generateTerrain());
		buffGeometry.computeBoundingSphere();

		var mesh = new THREE.Mesh(tmpGeometry, new THREE.MeshFaceMaterial(materials));
		scene.add(mesh);

		var altMesh = new THREE.Mesh(buffGeometry, new THREE.MeshBasicMaterial({
			vertexColors: THREE.FaceColors,
			side: THREE.DoubleSide,
			blending: 0
		}));

		altScene.add(altMesh);
		//altScene.add(new THREE.AmbientLight(0xffffff));

		var ambientLight = new THREE.AmbientLight(0xcccccc);
		scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
		directionalLight.position.set(-0.8, 1, 0.5).normalize();
		scene.add(directionalLight);


		function createRenderer() {
			var renderer = new THREE.WebGLRenderer();
			renderer.setClearColor(0xbfd1e5);
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.autoClear = false;
			return renderer;
		}


		function createStats() {
			var stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			return stats;
		}

		function createChar() {
			var material = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				wireframe: false,
				side: THREE.DoubleSide,
			});

			var char = new THREE.Mesh(new THREE.SphereGeometry(40, 8, 8), material);
			char.position.x = 0;
			char.position.z = 0;
			char.position.y =
				getY(worldHalfWidth - 1, worldHalfDepth - 1) * 100;

			scene.add(char);
			return char;
		}

		return {
			scene: scene,
			altScene: altScene,
			texture: texture,
			char: createChar(),
			mesh: mesh,
			altMesh: altMesh,
			materials: materials,
			worldWidth: worldWidth,
			worldDepth: worldDepth,
			getY: getY,
			renderer: createRenderer(),
			stats: createStats()
		};

	});