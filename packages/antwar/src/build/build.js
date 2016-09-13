const _path = require('path');

const _ = require('lodash');
const async = require('async');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const webpack = require('webpack');
const workerFarm = require('worker-farm');

const workers = workerFarm(
  require.resolve('./build_worker')
);

const webpackConfig = require('../config/build');
const write = require('./write');

module.exports = function (config) {
  return new Promise(function (resolve, reject) {
    const output = config.antwar.output;
    const log = config.antwar.console.log;

    if (!output) {
      return reject(new Error('Missing output directory'));
    }

    return webpackConfig(config).then(function (c) {
      webpack(c, function (err) {
        if (err) {
          return reject(err);
        }

        const cwd = process.cwd();
        const params = {
          cwd,
          renderPage: require(
            _path.join(cwd, './.antwar/build/bundleStaticPage.js')
          ),
          allPaths: require(
            _path.join(cwd, './.antwar/build/paths.js')
          )(),
          output: _path.join(cwd, output),
          config: config.antwar
        };

        log('Removing old output directory');

        return rimraf(params.output, function (err2) {
          if (err2) {
            return reject(err2);
          }

          log('Creating new output directory');

          return writeOutput(config, params, log);
        });
      });
    }).catch(function (err) {
      reject(err);
    });
  });
};

function writeOutput(config, params, log) {
  return new Promise(function (resolve, reject) {
    mkdirp(params.output, function (err) {
      if (err) {
        return reject(err);
      }

      return writeExtras(config, params, log);
    });
  });
}

function writeExtras(config, params, log) {
  return new Promise(function (resolve, reject) {
    // Extras
    const pluginExtras = _.map(config.antwar.plugins, 'extra').filter(_.identity);
    const extraFiles = _.map(pluginExtras, function (plugin) {
      return plugin(params.allPaths, config.antwar);
    });

    // get functions to execute
    return async.parallel([
      write.assets.bind(null, params),
      write.extraAssets.bind(null, params),
      write.indices.bind(null, params),
      write.extras.bind(null, params, extraFiles),
      write.pages.bind(null, params),
      write.redirects.bind(null, params)
    ], function (err, tasks) {
      if (err) {
        return reject(err);
      }

      return executeTasks(
        _.flatten(tasks).filter(_.identity),
        log
      );
    });
  });
}

function executeTasks(tasks, log) {
  return new Promise(function (resolve, reject) {
    async.each(tasks, function (o, cb) {
      log('Starting task', o.task);

      workers(o, function (err5) {
        log('Finished task', o.task);

        cb(err5);
      });
    }, function (err) {
      log('Tasks finished');

      workerFarm.end(workers);

      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}
