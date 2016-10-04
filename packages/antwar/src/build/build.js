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
      .then(runWebpack())
      .then(generateParameters(config.antwar))
      .then(removeDirectory(log))
      .then(writeExtras())
      .then(executeTasks(log))
      .catch(reject);
  });
};

function runWebpack() {
  return config => new Promise(function (resolve, reject) {
    webpack(config, function (err, stats) {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toString('errors-only'));
      }

      return resolve(stats);
    });
  });
}

function generateParameters(config) {
  return stats => new Promise(function (resolve) {
    const assets = stats.compilation.assets;
    const cssFiles = Object.keys(assets).map(asset => {
      if (_path.extname(asset) === '.css') {
        return assets[asset].existsAt;
      }

      return null;
    }).filter(a => a);
    const jsFiles = [];

    const cwd = process.cwd();
    const parameters = {
      cwd,
      renderPage: require(
        _path.join(cwd, './.antwar/build/bundleStaticPage.js')
      ),
      allPaths: require(
        _path.join(cwd, './.antwar/build/paths.js')
      )(),
      output: _path.join(cwd, config.output),
      config,
      cssFiles,
      jsFiles,
      templates: {
        page: {
          ...config.template,
          // XXX: sync operation
          file: _fs.readFileSync(
            (config.template && config.template.file) ||
            _path.join(__dirname, '../../templates/page.ejs'),
            {
              encoding: 'utf8'
            }
          ),
          cssFiles: cssFiles.map(cssFile => '/' + _path.basename(cssFile)),
          jsFiles
        },
        // TODO: expose to the user?
        interactive: {
          file: _fs.readFileSync(
            _path.join(__dirname, '../../templates/interactive.ejs'),
            {
              encoding: 'utf8'
            }
          )
        }
      }
    };

    resolve(parameters);
  });
}

function removeDirectory(log) {
  return parameters => new Promise(function (resolve, reject) {
    log('Removing old output directory');

    rimraf(parameters.output, function (err) {
      if (err) {
        return reject(err);
      }

      return resolve(parameters);
    });
  });
}

function writeExtras() {
  return parameters => new Promise(function (resolve, reject) {
    const config = parameters.config;
    const assets = config && config.assets ? config.assets : [];

    // Extras
    const pluginExtras = _.map(config.plugins, 'extra').filter(_.identity);
    const extraFiles = _.map(pluginExtras, function (plugin) {
      return plugin(parameters.allPaths, config);
    });

    if (parameters.cssFiles) {
      parameters.cssFiles.forEach(cssFile => {
        assets.push({
          from: cssFile,
          to: './' + _path.basename(cssFile)
        });
      });
    }

    // get functions to execute
    return async.parallel([
      write.assets(parameters),
      write.copyExtraAssets(parameters.output, assets),
      write.extras(parameters, extraFiles),
      write.pages(parameters),
      write.redirects(parameters)
    ], function (err, tasks) {
      if (err) {
        return reject(err);
      }

      return resolve(_.flatten(tasks).filter(_.identity));
    });
  });
}

function executeTasks(log) {
  return tasks => new Promise(function (resolve, reject) {
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
