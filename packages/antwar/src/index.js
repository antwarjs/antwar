import * as path from 'path';
import _ from 'lodash';
import rimraf from 'rimraf';

import 'promise.prototype.finally';

import prettyConsole from './libs/pretty_console';
import build from './build';
import dev from './dev';

require('es6-promise').polyfill();

exports.develop = execute(develop);
exports.start = execute(develop); // convenience alias
exports.build = execute(build);

function execute(target) {
  return ({ antwar, webpack, environment }) => target({
    environment,
    antwar: _.merge(
      defaultConfiguration(),
      _.isFunction(antwar) ? antwar(environment) : antwar
    ),
    webpack: webpack(environment)
  });
}

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
