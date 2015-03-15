'use strict';
var _path = require('path');

var async = require('async');
var webpack = require('webpack');

var webpackConfig = require('../config/build');
var write = require('./write');

module.exports = function(config) {
  process.env.BUILD_DEV = 0;

  return new Promise(function(resolve, reject) {
    var site = config.site;

    if(!site) {
      return reject(new Error('Missing site configuration'));
    }

    var output = site.output;

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

        // Extras
        var pluginExtras = _.pluck(site.plugins, 'extra').filter(_.identity);
        var extraFiles = _.map(pluginExtras, function(plugin) {
          return plugin(params.allPaths, config);
        });
        async.parallel([
          write.assets.bind(null, params),
          write.pages.bind(null, params),
          write.index.bind(null, params),
          write.posts.bind(null, params),
          write.extras.bind(null, params, extraFiles)
        ], function(err) {
          if(err) {
            return reject(err);
          }
          resolve();
        });
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};
