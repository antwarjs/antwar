import * as path from 'path';
import _ from 'lodash';
import rimraf from 'rimraf';

require('es6-promise').polyfill();
require('promise.prototype.finally');

import prettyConsole from './libs/pretty_console';
import build from './build';
import dev from './dev';

export default function (options) {
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
    webpack: options.webpack(environment)
  });
};

function defaultConfiguration() {
  return {
    port: 3000,
    output: 'build',
    console: prettyConsole
  };
}

function develop(configurations) {
  const cwd = process.cwd();
  const buildDir = path.join(cwd, './.antwar');

  return new Promise(function (resolve, reject) {
    rimraf(buildDir, function (err) {
      if (err) {
        return reject(err);
      }

      return build.devIndex(configurations)
        .then(dev.server.bind(null, configurations))
        .then(resolve)
        .catch(reject);
    });
  });
}
