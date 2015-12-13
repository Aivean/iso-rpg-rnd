/**
 * Created by Aivean on 12/12/15.
 */

requirejs(["./common"], function () {
	requirejs([
		"app/gpu-visibility/gpu-visibility-app"
	], function (gpu_visibility) {
		gpu_visibility();
	});
});