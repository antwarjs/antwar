'use strict';
var path = require('path');

var rimraf = require('rimraf');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var build = require('./build');

exports.develop = function(antwarConfig) {
  var cwd = process.cwd();
  var configurations = parseConfigurations(antwarConfig);
  var buildDir = path.join(cwd, './.antwar');

  return new Promise(function(resolve, reject) {
    rimraf(buildDir, function(err) {
      if(err) {
        return reject(err);
      }

      return build.devIndex(configurations).
        then(build.devServer.bind(null, configurations)).
        then(resolve).
        catch(reject);
    });
  });
};

exports.build = function(antwarConfig) {
  var configurations = parseConfigurations(antwarConfig);

  return build(configurations);
}

function parseConfigurations(antwarConfig) {
  var cwd = process.cwd();
  var parent = __dirname;
  var paths = [
    path.join(parent, 'components'),
    path.join(parent, 'dev')
  ];
  var webpackConfig = require(path.join(cwd, antwarConfig.webpackConfig))(
    process.env.npm_lifecycle_event,
    {
      paths: paths
    }
  );

  return {
    antwar: antwarConfig,
    webpack: webpackConfig
  };
}
