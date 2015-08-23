'use strict';
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var webpack = require('webpack');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var theme = config.theme;

    if(!theme || !theme.name) {
      return reject(new Error('Missing theme'));
    }

    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');

    var themeConfig = config.themeConfig && config.themeConfig.common;
    themeConfig = themeConfig && themeConfig() || {};

    var siteConfig = config.webpack && config.webpack.common;
    siteConfig = siteConfig || {};

    var themePath = getThemePath(theme.name);
    var themeDependenciesPath = path.join(themePath, 'node_modules');
    var corePath = path.join(parent, 'elements');

    resolve({
      corePath: corePath,
      parent: parent,
      themeDependenciesPath: themeDependenciesPath,
      resolve: {
        root: path.join(parent, 'node_modules'),
        alias: {
          'underscore': 'lodash',
          'assets': path.join(cwd, 'assets'),
          'customStyles': path.join(cwd, 'styles'), // Should be moved to theme specific config
          'config': path.join(cwd, 'antwar.config.js'),
          'antwar-core': corePath,
          'theme': themePath,
        },
        extensions: _.uniq([
          '',
          '.webpack.js',
          '.web.js',
          '.js',
          '.jsx',
          '.json',
        ].
        concat(themeConfig.resolve && themeConfig.resolve.extensions || []).
        concat(siteConfig.resolve && siteConfig.resolve.extensions || [])),
        modulesDirectories: [
          themePath,
          themeDependenciesPath,
          'node_modules',
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          themeDependenciesPath,
          'node_modules',
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(config.buildDev)),
          'process.env': {
            'NODE_ENV': JSON.stringify(config.buildDev ? 'dev' : 'production')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
      ],
    });
  });
};

function getThemePath(name) {
  var cwd = process.cwd();

  // XXX: existsSync
  if(fs.existsSync(name)) {
    return path.join(cwd, name);
  }

  return path.join(cwd, 'node_modules', name);
}
