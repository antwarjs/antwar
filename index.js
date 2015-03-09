'use strict';
require('es6-promise').polyfill();
require('promise.prototype.finally');

var devServer = require('./devServer');
var build = require('./build');


exports.develop = function(config) {
  return build.buildDevIndex(config).then(devServer.bind(null, config));
};

exports.build = function(config) {
  return build.build(config);
};
