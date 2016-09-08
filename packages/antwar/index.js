const path = require('path');
const _ = require('lodash');
const rimraf = require('rimraf');
const simpleTimestamp = require('simple-timestamp');
const chalk = require('chalk');

require('es6-promise').polyfill();
require('promise.prototype.finally');

const build = require('./build');

module.exports = function (options) {
  const environment = options.environment;
  const environments = {
    develop,
    start: develop, // Convenience alias for npm
    build
  };

  if (!(environment in environments)) {
    return new Promise(function (resolve, reject) {
      reject(new Error(
        'No matching environment in ' + Object.keys(environments).join(', ') +
        ' for ' + environment
      ));
    });
  }

  return environments[environment]({
    antwar: _.merge(defaultConfiguration(), options.configuration),
    webpack: options.webpack(environment, {
      paths: [
        path.join(__dirname, 'components'),
        path.join(__dirname, 'dev')
      ]
    })
  });
};

function defaultConfiguration () {
  const prettyConsole = {
    log(...args) {
      console.log(simpleTimestamp(), chalk.green.apply(null, args));
    },
    info(...args) {
      console.info(simpleTimestamp(), chalk.blue.apply(null, args));
    },
    error(...args) {
      console.error(simpleTimestamp(), chalk.bold.red.apply(null, args));
    },
    warn(...args) {
      console.warn(simpleTimestamp(), chalk.yellow.apply(null, args));
    }
  };

  return {
    port: 3000,
    output: 'build',
    boilerplate: 'antwar-boilerplate',
    deploy: {
      branch: 'gh-pages'
    },
    console: prettyConsole
  };
}

function develop (configurations) {
  const cwd = process.cwd();
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
}
