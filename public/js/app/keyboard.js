/**
 * Created by Aivean on 12/12/15.
 */


define(function () {

	var controls;

	function onKeyDown(event) {
		event.stopPropagation();
		switch (event.keyCode) {

			case 38: /*up*/
			case 87: /*W*/
				controls.moveForward = true;
				break;

			case 40: /*down*/
			case 83: /*S*/
				controls.moveBackward = true;
				break;

			case 37: /*left*/
			case 65: /*A*/
				controls.moveLeft = true;
				break;

			case 39: /*right*/
			case 68: /*D*/
				controls.moveRight = true;
				break;

			//case 67: /*C*/     controls.crouch = true; break;
			//case 32: /*space*/ controls.jump = true; break;
			//case 17: /*ctrl*/  controls.attack = true; break;
		}
	}

	function onKeyUp(event) {
		event.stopPropagation();

		switch (event.keyCode) {

			case 38: /*up*/
			case 87: /*W*/
				controls.moveForward = false;
				break;

			case 40: /*down*/
			case 83: /*S*/
				controls.moveBackward = false;
				break;

			case 37: /*left*/
			case 65: /*A*/
				controls.moveLeft = false;
				break;

			case 39: /*right*/
			case 68: /*D*/
				controls.moveRight = false;
				break;

			//case 67: /*C*/     controls.crouch = false; break;
			//case 32: /*space*/ controls.jump = false; break;
			//case 17: /*ctrl*/  controls.attack = false; break;
		}
	}


	controls = {
		moveForward: false,
		moveBackward: false,
		moveLeft: false,
		moveRight: false,

		register: function () {
			document.addEventListener('keydown', onKeyDown, false);
			document.addEventListener('keyup', onKeyUp, false);
		}
	};


	return controls;
});