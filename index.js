'use strict';
var path = require('path');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var build = require('./build');


exports.develop = function(config) {
  config.themeConfig = parseThemeWebpackConfig(config.site);

  return build.devIndex(config).then(build.devServer.bind(null, config));
};

exports.build = function(config) {
  config.themeConfig = parseThemeWebpackConfig(config.site);

  return build(config);
};

function parseThemeWebpackConfig(config) {
  if(config && config.theme && config.theme.name) {
    try {
      // make sure site is in module search paths,
      // otherwise possible theme cannot be found
      module.paths.unshift(process.cwd());

      return require(path.basename(config.theme.name));
    }
    catch(e) {
      // XXX: figure out when to show error, when not
      //console.error(e);
    }
  }

  return {};
}
