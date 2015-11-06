'use strict';
var _path = require('path');
var _os = require('os');

var _ = require('lodash');
var async = require('async');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var webpack = require('webpack');

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
          config: config,
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
            var pluginExtras = _.pluck(config.plugins, 'extra').filter(_.identity);
            var extraFiles = _.map(pluginExtras, function(plugin) {
              return plugin(params.allPaths, config);
            });

            // get functions to execute
            async.parallel([
              write.assets.bind(null, params),
              write.extraAssets.bind(null, params),
              write.index.bind(null, params),
              write.items.bind(null, params),
              write.extras.bind(null, params, extraFiles),
            ], function(err, functions) {
              if(err) {
                return reject(err);
              }

              functions = _.flatten(functions).filter(_.identity);

              // execute functions parallel (still in single thread, though...)
              async.eachLimit(functions, _os.cpus().length, function(fn, cb) {
                fn(cb);
              }, function(err) {
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
