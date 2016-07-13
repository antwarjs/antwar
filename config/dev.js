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
      },
      module: {
        loaders: [
          {
            test: /\.jsx$/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
              compact: true,
              presets: [
                require.resolve('babel-preset-es2015'),
                require.resolve('babel-preset-react')
              ]
            },
            include: commonConfig.includes
          },
          {
            test: /\.css$/,
            loaders: ['style', 'css'],
            include: commonConfig.includes
          }
        ]
      }
    };

    return merge(commonConfig, devConfig, siteConfig);
  });
};
