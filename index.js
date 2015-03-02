'use strict';
require('coffee-script/register');

var devServer = require('./devServer.coffee');
var publicServer = require('./publicServer.js');
var build = require('./build.coffee');


exports.develop = function(config) {
	console.log('Starting dev server…');
	build.buildDevIndex(config);
	devServer.dev('build');
};

exports.build = function(config) {
	console.log('Building site…');
	build.build(config);
};

exports.serve = function(config) {
	build.build(config);
	publicServer.run();
};
