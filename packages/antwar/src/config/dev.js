const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const getCommon = require('./common');

module.exports = function (config) {
  const cwd = process.cwd();

  return getCommon(config).then(function (commonConfig) {
    const devConfig = {
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
      locals: {},
      plugins: [
        new HtmlWebpackPlugin({
          template: (config.antwar.template && config.antwar.template.file) ||
            path.join(__dirname, '../../templates/page.ejs')
        })
      ],
      // Copy template configuration to webpack side so HtmlWebpackPlugin picks it up
      template: config.antwar.template
    };

    return merge(commonConfig, devConfig, config.webpack);
  });
};
