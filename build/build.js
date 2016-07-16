var _path = require('path');

var _ = require('lodash');
var async = require('async');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var webpack = require('webpack');

var workerFarm = require('worker-farm');
var workers = workerFarm(require.resolve('./build_worker'));

var webpackConfig = require('../config/build');
var write = require('./write');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var output = config.output;
    var log = config.console.log;

    if(!output) {
      return reject(new Error('Missing output directory'));
    }

    webpackConfig(config).then(function(c) {
      webpack(c, function(err) {
        if(err) {
          return reject(err);
        }

        var cwd = process.cwd();
        var params = {
          cwd: cwd,
          renderPage: require(_path.join(cwd, './.antwar/build/bundleStaticPage.js')),
          allPaths: require(_path.join(cwd, './.antwar/build/paths.js'))(),
          output: _path.join(cwd, output),
          config: config
        };

        log('Removing old output directory');

        rimraf(params.output, function(err) {
          if(err) {
            return reject(err);
          }

          log('Creating new output directory');

          mkdirp(params.output, function(err) {
            if(err) {
              return reject(err);
            }

            // Extras
            var pluginExtras = _.map(config.plugins, 'extra').filter(_.identity);
            var extraFiles = _.map(pluginExtras, function(plugin) {
              return plugin(params.allPaths, config);
            });

            // get functions to execute
            async.parallel([
              write.assets.bind(null, params),
              write.extraAssets.bind(null, params),
              write.indices.bind(null, params),
              write.extras.bind(null, params, extraFiles),
              write.pages.bind(null, params),
              write.redirects.bind(null, params)
            ], function(err, tasks) {
              if(err) {
                return reject(err);
              }

              tasks = _.flatten(tasks).filter(_.identity);

              async.each(tasks, function(o, cb) {
                log('Starting task', o.task);

                workers(o, function(err) {
                  log('Finished task', o.task);

                  cb(err);
                });
              }, function(err) {
                console.log('Tasks finished');

                workerFarm.end(workers);

                if(err) {
                  return reject(err);
                }

                resolve();
              });
            });
          })
        })
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};
