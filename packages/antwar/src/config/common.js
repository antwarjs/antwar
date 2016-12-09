import * as path from 'path';
import webpack from 'webpack';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

module.exports = function (config) {
  return new Promise(function (resolve) {
    const cwd = process.cwd();
    const parent = path.join(__dirname, '..');
    const paths = {
      // XXX: not correct if the user changes the default
      antwarConfig: path.join(cwd, 'antwar.config.js'),
      cache: path.join(cwd, './.antwar/cache'),
      config: path.join(__dirname, 'config_entry.js'),
      parent
    };

    resolve({
      parent,
      resolve: {
        root: cwd,
        alias: {
          antwarConfig: paths.antwarConfig,
          config: paths.config
        },
        extensions: [
          '',
          '.js',
          '.jsx',
          '.json'
        ],
        modulesDirectories: [
          path.join(cwd, 'node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(paths.parent, 'node_modules'),
          'node_modules'
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(config.buildDev)),
          __ENV__: JSON.stringify(config.environment),
          'process.env': {
            NODE_ENV: JSON.stringify('dev')
          }
        }),
        new HardSourceWebpackPlugin({
          cacheDirectory: paths.cache,
          recordsPath: path.join(paths.cache, 'records.json'),
          environmentHash: {
            root: cwd,
            directories: ['node_modules'],
            files: ['package.json']
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
      ]
    });
  });
};
