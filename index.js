'use strict';
var path = require('path');

var rimraf = require('rimraf');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var build = require('./build');

exports.develop = function(config) {
  var buildDir = path.join(process.cwd(), './.antwar');

  return new Promise(function(resolve, reject) {
    rimraf(buildDir, function(err) {
      if(err) {
        return reject(err);
      }

      build.devIndex(config).
        then(build.devServer.bind(null, config)).
        then(resolve).
        catch(reject);
    });
  });
};

exports.build = build;
