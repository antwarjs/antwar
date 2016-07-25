'use strict';
var path = require('path');
var merge = require('webpack-merge');

module.exports = function(config) {
  var getCommon = require('./common');
  var cwd = process.cwd();

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
      }
    };

    return merge(commonConfig, buildConfig);
  });
};
