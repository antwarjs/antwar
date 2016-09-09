const path = require('path');
const merge = require('webpack-merge');
const getCommon = require('./common');

module.exports = function (config) {
  return getCommon(config).then(function (commonConfig) {
    const devConfig = {
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

    return merge(commonConfig, devConfig, config.webpack);
  });
};
