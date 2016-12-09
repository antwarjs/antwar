import * as path from 'path';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import getCommon from './common';

module.exports = function (config) {
  const cwd = process.cwd();
  const antwarPath = path.join(cwd, './.antwar');

  return getCommon(config).then(function (commonConfig) {
    const devConfig = {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty'
      },
      output: {
        path: path.join(cwd, './.antwar/build/'),
        filename: '[name].js',
        publicPath: '/',
        chunkFilename: '[chunkhash].js'
      },
      locals: {},
      plugins: [
        new HtmlWebpackPlugin({
          template: (config.antwar.template && config.antwar.template.file) ||
            path.join(__dirname, '../../templates/page.ejs')
        }),
        new HardSourceWebpackPlugin({
          cacheDirectory: path.join(antwarPath, 'dev-cache'),
          recordsPath: path.join(antwarPath, 'dev-cache', 'records.json'),
          environmentHash: {
            root: cwd,
            directories: ['node_modules'],
            files: ['package.json']
          }
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
  });
};
