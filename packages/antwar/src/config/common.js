const path = require('path');
const webpack = require('webpack');
const SystemBellPlugin = require('system-bell-webpack-plugin');

module.exports = function (config) {
  return new Promise(function (resolve) {
    const cwd = process.cwd();
    const parent = path.join(__dirname, '..');
    const paths = {
      assets: path.join(cwd, 'assets'),
      // XXX: not correct if the user changes the default
      config: path.join(cwd, 'antwar.config.js'),
      parent: path.join(__dirname, '..')
    };

    resolve({
      parent,
      resolve: {
        root: cwd,
        alias: {
          underscore: 'lodash',
          assets: paths.assets,
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
          'process.env': {
            NODE_ENV: JSON.stringify('dev')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new SystemBellPlugin()
      ]
    });
  });
};
