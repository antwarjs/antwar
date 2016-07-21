'use strict';
var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var SystemBellPlugin = require('system-bell-webpack-plugin');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');
    var paths = {
      assets: path.join(cwd, 'assets'),
      // XXX: not correct if the user changes the default
      config: path.join(cwd, 'antwar.config.js'),
      core: path.join(parent, 'components'),
      cwd: cwd,
      dev: path.join(parent, 'dev'),
      parent: path.join(__dirname, '..')
    };
    var includes = [
      paths.core,
      paths.dev
    ];

    var common = {
      parent: parent,
      resolve: {
        root: cwd,
        alias: {
          'underscore': 'lodash',
          'assets': paths.assets,
          'config': paths.config,
          'antwar-core': paths.core
        },
        extensions: [
          '',
          '.js',
          '.jsx',
          '.json'
        ],
        modulesDirectories: [
          path.join(paths.cwd, 'node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(paths.parent, 'node_modules'),
          'node_modules'
        ]
      },
      includes: includes,
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(config.buildDev)),
          'process.env': {
            'NODE_ENV': JSON.stringify('dev')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new SystemBellPlugin()
      ]
    };

    resolve(common);
  });
};
