/**
 * Created by Aivean on 12/12/15.
 */

requirejs(["./common"], function () {
	requirejs([
		"app/backend-visibility/backend-visibility-app"
	], function (backend_visibility) {
		backend_visibility();
	});
});