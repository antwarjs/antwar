import * as path from 'path';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import merge from 'webpack-merge';

module.exports = function (config) {
  const getCommon = require('./common');

  const cwd = process.cwd();
  const buildPath = path.join(cwd, config.antwar.output);
  const antwarPath = path.join(cwd, './.antwar');

  config.buildDev = config.buildDev || 0; // eslint-disable-line no-param-reassign

  return getCommon(config).then(function (commonConfig) {
    const buildConfig = {
      node: {
        fs: 'empty'
      },
      name: 'server',
      target: 'node',
      entry: {
        site: path.join(__dirname, '../build/site.js')
      },
      output: {
        path: buildPath,
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'commonjs2'
      },
      plugins: [
        new HardSourceWebpackPlugin({
          cacheDirectory: path.join(antwarPath, 'build-cache'),
          recordsPath: path.join(antwarPath, 'build-cache', 'records.json'),
          environmentHash: {
            root: cwd,
            directories: ['node_modules'],
            files: ['package.json']
          }
        })
      ]
    };

    return merge(commonConfig, buildConfig, config.webpack);
  });
};
