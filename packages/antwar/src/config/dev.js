import * as path from 'path';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import getCommon from './common';

module.exports = (config) => (
  getCommon(config).then(function (commonConfig) {
    const devConfig = {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty'
      },
      output: {
        path: path.join(process.cwd(), './.antwar/build/'),
        filename: '[name].js',
        publicPath: '/',
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
      template: {
        cssFiles: [],
        jsFiles: [],
        ...config.antwar.template
      }
    };

    return merge(commonConfig, devConfig, config.webpack);
  })
);
