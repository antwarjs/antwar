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

    var siteConfig = config.webpack && config.webpack.common;
    siteConfig = siteConfig || {};

    var corePath = path.join(parent, 'components');

    var cwd = process.cwd();
    var paths = {
      assets: path.join(cwd, 'assets'),
      config: path.join(cwd, 'antwar.config.js'),
      core: path.join(parent, 'components'),
      cwd: cwd,
      parent: path.join(__dirname, '..')
    }

    var includes = [
      paths.core,
      paths.cwd
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
      module: {
        // TODO: set up good include/exclude rules for these
        // TODO: drop these altogether (problematic with require.context)?
        loaders: [
          {
            test: /\.woff$/,
            loaders: ['url?prefix=font/&limit=5000&mimetype=application/font-woff']
          },
          {
            test: /\.ttf$|\.eot$/,
            loaders: ['file?prefix=font/']
          },
          {
            test: /\.jpg$/,
            loaders: ['file']
          },
          {
            test: /\.png$/,
            loaders: ['file']
          },
          {
            test: /\.svg$/,
            loaders: ['raw']
          },
          {
            test: /\.html$/,
            loaders: ['raw']
          }
        ]
      },
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

    resolve(merge(common, siteConfig));
  });
};
