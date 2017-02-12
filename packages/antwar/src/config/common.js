import * as path from 'path';
import * as webpack from 'webpack';

module.exports = function (config) {
  return new Promise(function (resolve) {
    const cwd = process.cwd();
    const paths = {
      // XXX: not correct if the user changes the default
      antwarConfig: path.join(cwd, 'antwar.config.js'),
      config: path.join(__dirname, 'config_entry.js'),
      parent: path.join(__dirname, '..')
    };

    resolve({
      resolve: {
        alias: {
          antwarConfig: paths.antwarConfig,
          config: paths.config
        },
        extensions: ['.js', '.jsx', '.json'],
        modules: [
          path.join(cwd, 'node_modules'),
          'node_modules'
        ]
      },
      resolveLoader: {
        modules: [
          cwd,
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
        })
      ]
    });
  });
};
