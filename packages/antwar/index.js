const path = require('path');
const rimraf = require('rimraf');

require('es6-promise').polyfill();
require('promise.prototype.finally');

const build = require('./build');

exports.develop = function (antwarConfig) {
  const cwd = process.cwd();
  const configurations = parseConfigurations(antwarConfig);
  const buildDir = path.join(cwd, './.antwar');

  return new Promise(function (resolve, reject) {
    rimraf(buildDir, function (err) {
      if (err) {
        return reject(err);
      }

      return build.devIndex(configurations)
        .then(build.devServer.bind(null, configurations))
        .then(resolve)
        .catch(reject);
    });
  });
};

exports.build = function (antwarConfig) {
  const configurations = parseConfigurations(antwarConfig);

  return build(configurations);
};

function parseConfigurations(antwarConfig) {
  const cwd = process.cwd();
  const parent = __dirname;
  const paths = [
    path.join(parent, 'components'),
    path.join(parent, 'dev')
  ];
  const webpackConfig = require(path.join(cwd, antwarConfig.webpackConfig))(
    process.env.npm_lifecycle_event,
    {
      paths
    }
  );

  return {
    antwar: antwarConfig,
    webpack: webpackConfig
  };
}
