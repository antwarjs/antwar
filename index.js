require('coffee-script/register');
devServer = require('./devServer.coffee');
publicServer = require('./publicServer.js');
build = require('./build.coffee');


exports.develop = function() {
	console.log('Starting dev server…');
	build.buildDevIndex();
	devServer.dev('build');
}
exports.build = function() {
	console.log('Building site…');
	build.build();
}
exports.serve = function() {
	build.build();
	publicServer.run();
}

