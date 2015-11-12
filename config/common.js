'use strict';
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var webpack = require('webpack');

var parseThemeWebpackConfig = require('./parse_theme');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var theme = config.theme;

    if(!theme || !theme.name) {
      return reject(new Error('Missing theme'));
    }

    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');

    var themeConfig = parseThemeWebpackConfig(config);
    var commonThemeConfig = themeConfig.common && themeConfig.common();
    commonThemeConfig = commonThemeConfig || {};

    var siteConfig = config.webpack && config.webpack.common;
    siteConfig = siteConfig || {};

    var themePath = getThemePath(theme.name);
    var themeDependenciesPath = path.join(themePath, 'node_modules');
    var corePath = path.join(parent, 'elements');

    resolve({
      themeConfig: themeConfig,
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
        concat(commonThemeConfig.resolve && commonThemeConfig.resolve.extensions || []).
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

  var localNodeModulesTheme = path.join(cwd, 'node_modules', name);

  if(fs.existsSync(localNodeModulesTheme)) {
    return localNodeModulesTheme;
  }

  var globalNodeModulesTheme = path.join(process.env.NODE_PATH, name);

  if(fs.existsSync(globalNodeModulesTheme)) {
    return globalNodeModulesTheme;
  }

  console.error('Failed to find theme!');
}
