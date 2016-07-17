'use strict';
var path = require('path');
var merge = require('webpack-merge');
var getCommon = require('./common');

module.exports = function(config) {
  var siteConfig = config.webpack && config.webpack.development;
  siteConfig = siteConfig && siteConfig() || {};

  return getCommon(config).then(function(commonConfig) {
    var devConfig = {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty'
      },
      output: {
        path: path.join(process.cwd(), './.antwar/build/'),
        publicPath: '/',
        filename: '[name]-bundle.js',
        chunkFilename: '[chunkhash].js'
      }
    };

    return merge(commonConfig, devConfig, siteConfig);
  });
};
