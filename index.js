'use strict';
require('coffee-script/register');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var devServer = require('./devServer');
var build = require('./build');


exports.develop = function(config) {
  return new Promise(function(resolve, reject) {
    build.buildDevIndex(config).then(function() {
      devServer(config).then(function() {
        resolve();
      }).catch(function(err) {
        reject(err);
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};

exports.build = function(config) {
  return build.build(config);
};
