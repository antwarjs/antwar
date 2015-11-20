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
          '.js',
          '.jsx',
          '.json'
        ],
        modulesDirectories: [
          path.join(cwd, 'node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          'node_modules'
        ]
      },
      module: {
        // TODO: set up good include/exclude rules for these
        loaders: [
          {
            test: /\.woff$/,
            loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
          },
          {
            test: /\.ttf$|\.eot$/,
            loader: 'file-loader?prefix=font/'
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          },
          {
            test: /\.svg$/,
            loader: 'raw-loader'
          },
          {
            test: /\.html$/,
            loader: 'raw'
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader'
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
