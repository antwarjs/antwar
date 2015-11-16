'use strict';
var fs = require('fs');
var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');

    var siteConfig = config.webpack && config.webpack.common;
    siteConfig = siteConfig || {};

    var corePath = path.join(parent, 'elements');

    var common = {
      corePath: corePath,
      parent: parent,
      resolve: {
        root: path.join(parent, 'node_modules'),
        alias: {
          'underscore': 'lodash',
          'assets': path.join(cwd, 'assets'),
          'config': path.join(cwd, 'antwar.config.js'),
          'antwar-core': corePath
        },
        extensions: [
          '',
          '.webpack.js',
          '.web.js',
          '.js',
          '.jsx',
          '.json'
        ],
        modulesDirectories: [
          'node_modules'
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          'node_modules'
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
    };

    resolve(merge(common, siteConfig));
  });
};
