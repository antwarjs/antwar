var fs = require('fs');
var _path = require('path');

var async = require('async');
var webpack = require('webpack');

var webpackConfig = require('../config/build');
var utils = require('./utils');

module.exports = function(config) {
  config.buildDev = 1;

  return new Promise(function(resolve, reject) {
    webpackConfig(config).then(function(c) {
      webpack(c, function(err, stats) {
        if(err) {
          return reject(err);
        }

        if(stats.hasErrors()) {
          // TODO: dig build errors from stats.compilation.modules
          return reject(stats.toString('errors-only'));
        }

        var buildDir = _path.join(process.cwd(), './.antwar/build');
        var renderPage = require(_path.join(buildDir, 'bundleStaticPage.js'));

        async.parallel([
          function(cb) {
            renderPage('antwar_devindex', function(err, html) {
              if(err) {
                return cb(err);
              }

              fs.writeFile(
                _path.join(buildDir, 'index.html'),
                html,
                cb
              );
            });
          },
          utils.copyIfExists.bind(null, './assets', _path.join(buildDir, 'assets')),
          utils.copyExtraAssets.bind(null, buildDir, config.assets)
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
