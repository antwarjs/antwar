'use strict';
require('coffee-script/register');

var devServer = require('./devServer.coffee');
var build = require('./build.coffee');


exports.develop = function(config) {
	build.buildDevIndex(config);
	devServer.dev('build');
};

exports.build = function(config) {
	build.build(config);
};
