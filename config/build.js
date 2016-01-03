'use strict';
var path = require('path');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
  var getCommon = require('./common');
  var cwd = process.cwd();

  var siteConfig = config.webpack && config.webpack.build;
  siteConfig = siteConfig && siteConfig({
    ExtractTextPlugin: ExtractTextPlugin
  }) || {};

  config.buildDev = config.buildDev || 0;

  return getCommon(config).then(function(commonConfig) {
    var buildConfig = {
      node: {
        fs: 'empty'
      },
      name: 'server',
      target: 'node',
      entry: {
        bundlePage: path.join(__dirname, '../dev/page.js'),
        bundleStaticPage: path.join(__dirname, '../dev/static_page.js'),
        paths: path.join(__dirname, '../dev/export_paths.js')
      },
      output: {
        path: path.join(cwd, './.antwar/build'),
        filename: '[name].js',
        publicPath: path.join(cwd, './.antwar/build'),
        libraryTarget: 'commonjs2'
      },
      plugins: [
        new ExtractTextPlugin('[name].css', {
          allChunks: true
        })
      ],
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel?cacheDirectory',
            query: {
              presets: ['es2015', 'react']
            },
            include: path.join(__dirname, '..'),
            exclude: path.join(__dirname, '..', 'node_modules')
          },
          {
            test: /\.jsx$/,
            loader: 'babel?cacheDirectory',
            query: {
              presets: ['es2015', 'react']
            },
            include: commonConfig.includes,
            exclude: path.join(commonConfig.parent, 'node_modules')
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')
          }
        ]
      }
    };

    return merge(commonConfig, buildConfig, siteConfig);
  });
};
