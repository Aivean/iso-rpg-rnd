define(["three/three", "../axes"], function (THREE, buildAxes) {

	var scene = new THREE.Scene();

	var texture = THREE.ImageUtils.loadTexture(
		assets["three/atlas.png"]);
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;


	var material = new THREE.MeshLambertMaterial({
		//side: THREE.FrontSide,
		side: THREE.DoubleSide,
		map: texture,
	});

	var transMaterial = new THREE.MeshLambertMaterial({
		side: THREE.DoubleSide,
		transparent: true,
		map: texture,
		opacity: 0.5,
		depthTest: true,
		depthWrite: false
	});

	function createSphere(pos, color) {
		var material = new THREE.MeshBasicMaterial({
			color: color,
			side: THREE.FrontSide
		});

		var sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
		sphereGeometry.translate(pos.x, pos.y, pos.z);
		var char = new THREE.Mesh(sphereGeometry, material);

		scene.add(char);
		return char;
	}

	faceData.faces.forEach(function (f) {
		var geom = new THREE.PlaneBufferGeometry(1, 1);

		geom.lookAt(new THREE.Vector3(f.rot.x, f.rot.y, f.rot.z))
		if (f.rot.z != 0) {
			geom.attributes.uv.array[5] = 0.5;
			geom.attributes.uv.array[7] = 0.5;
		} else {
			geom.attributes.uv.array[1] = 0.5;
			geom.attributes.uv.array[3] = 0.5;

			geom.rotateX(Math.PI / 2 * Math.abs(f.rot.x));
			geom.rotateY(Math.PI / 2 * f.rot.y);
		}

		geom.translate(f.p.x, f.p.y, f.p.z);
		geom.translate(-Math.abs(f.rot.x) * 0.5, -Math.abs(f.rot.y) * 0.5, -Math.abs(f.rot.z) * 0.5);

		var geom_ = new THREE.Geometry().fromBufferGeometry(geom);

		var mesh = new THREE.Mesh(geom_, f.v ? material: transMaterial);
		scene.add(mesh);
	});

	createSphere(faceData.char, 0xff0000);
	createSphere(faceData.camera, 0x00ff00);

	scene.add(buildAxes(1));

	scene.add(new THREE.AmbientLight(0xcccccc));

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(-0.8, 1, 0.5).normalize();
	scene.add(directionalLight);

	return scene;
});