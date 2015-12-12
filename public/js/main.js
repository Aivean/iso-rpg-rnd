requirejs.config({
	//By default load any module IDs from js/lib
	baseUrl: 'js'
});

requirejs([
	"app/sandbox"
], function(sandbox){

	sandbox();
});