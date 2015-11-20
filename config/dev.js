'use strict';
var path = require('path');
var merge = require('webpack-merge');
var getCommon = require('./common');

module.exports = function(config) {
  var cwd = process.cwd();

  var siteConfig = config.webpack && config.webpack.development;
  siteConfig = siteConfig && siteConfig() || {};

  return getCommon(config).then(function(commonConfig) {
    var excludes = [
      commonConfig.resolve.root
    ];

    var devConfig = {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty'
      },
      output: {
        path: path.join(cwd, './.antwar/build/'),
        publicPath: '/',
        filename: '[name]-bundle.js',
        chunkFilename: '[chunkhash].js'
      },
      module: {
        loaders: [
          {
            test: /\.jsx$/,
            loaders: ['react-hot', 'babel'],
            include: commonConfig.includes,
            exclude: excludes
          },
          {
            test: /\.css$/,
            loaders: ['style', 'css'],
            include: commonConfig.includes,
            exclude: excludes
          }
        ]
      }
    };

    return merge(commonConfig, devConfig, siteConfig);
  });
};
