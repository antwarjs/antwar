'use strict';
var path = require('path');

require('es6-promise').polyfill();
require('promise.prototype.finally');

var build = require('./build');


exports.develop = function(config) {
  config.themeConfig = parseThemeWebpackConfig(config);

  return build.devIndex(config).then(build.devServer.bind(null, config));
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

      return {};

      // XXXXX: if default theme has custom configuration, yields
      // Error: Cannot find module "theme/Body"
      // This has something to do with coffee-loader. If that is disabled
      // at theme config, then it stumbles at sass config (might be invalid, didn't check)
      //return require(path.basename(config.theme.name));
    }
    catch(e) {
      // XXX: figure out when to show error, when not
      //console.error(e);
    }
  }

  return {};
}
