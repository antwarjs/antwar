const _fs = require('fs');
const _path = require('path');

const _ = require('lodash');
const async = require('async');
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

    return webpackConfig(config)
      .then(runWebpack)
      .then(generateParameters.bind(null, config))
      .then(removeDirectory.bind(null, log))
      .then(writeExtras.bind(null, config))
      .then(executeTasks.bind(null, log))
      .catch(reject);
  });
};

function runWebpack(config) {
  return new Promise(function (resolve, reject) {
    webpack(config, function (err, stats) {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toString('errors-only'));
      }

      return resolve();
    });
  });
}

function generateParameters(config) {
  return new Promise(function (resolve) {
    // XXXXX: Capture files ending with .css from stats.compilation.assets
    // here and inject them to template context. In addition the CSS files
    // need to be copied to project root based on existsAt path.

    const output = config.antwar.output;
    const cwd = process.cwd();
    const parameters = {
      cwd,
      renderPage: require(
        _path.join(cwd, './.antwar/build/bundleStaticPage.js')
      ),
      allPaths: require(
        _path.join(cwd, './.antwar/build/paths.js')
      )(),
      output: _path.join(cwd, output),
      config: config.antwar,
      template: {
        ...config.antwar.template,
        // XXX: sync operation
        file: _fs.readFileSync(
          (config.antwar.template && config.antwar.template.file) ||
          _path.join(__dirname, '../../template.ejs'),
          {
            encoding: 'utf8'
          }
        )
      }
    };

    resolve(parameters);
  });
}

function removeDirectory(log, parameters) {
  return new Promise(function (resolve, reject) {
    log('Removing old output directory');

    rimraf(parameters.output, function (err) {
      if (err) {
        return reject(err);
      }

      return resolve(parameters);
    });
  });
}

function writeExtras(config, parameters) {
  return new Promise(function (resolve, reject) {
    // Extras
    const pluginExtras = _.map(config.antwar.plugins, 'extra').filter(_.identity);
    const extraFiles = _.map(pluginExtras, function (plugin) {
      return plugin(parameters.allPaths, config.antwar);
    });

    // get functions to execute
    return async.parallel([
      write.assets.bind(null, parameters),
      write.extraAssets.bind(null, parameters),
      write.extras.bind(null, parameters, extraFiles),
      write.pages.bind(null, parameters),
      write.redirects.bind(null, parameters)
    ], function (err, tasks) {
      if (err) {
        return reject(err);
      }

      return resolve(_.flatten(tasks).filter(_.identity));
    });
  });
}

function executeTasks(log, tasks) {
  return new Promise(function (resolve, reject) {
    async.each(tasks, function (o, cb) {
      log('Starting task', o.task);

      workers(o, function (err) {
        log('Finished task', o.task);

        cb(err);
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
