'use strict';
require('coffee-script/register');

var Promise = require('es6-promise').Promise;

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
