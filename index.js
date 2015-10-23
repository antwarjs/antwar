'use strict';
var path = require('path');

var rimraf = require('rimraf');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var build = require('./build');

exports.develop = function(config) {
  config.themeConfig = parseThemeWebpackConfig(config);

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

exports.build = function(config) {
  config.themeConfig = parseThemeWebpackConfig(config);

  return build(config);
};

function parseThemeWebpackConfig(config) {
  if(config && config.theme && config.theme.name) {
    try {
      // make sure site is in module search paths,
      // otherwise possible theme cannot be found
      module.paths.unshift(path.join(process.cwd(), 'node_modules'));

      return require(path.basename(config.theme.name));
    }
    catch(e) {
      // XXX: figure out when to show error, when not
      //console.error(e);
    }
  }

  return {};
}
