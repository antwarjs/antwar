const fs = require('fs');
const _path = require('path');
const async = require('async');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackConfig = require('../config/build');
const utils = require('./utils');

module.exports = function (config) {
  config.buildDev = 1; // eslint-disable-line no-param-reassign

  return new Promise(function (resolve, reject) {
    webpackConfig(config).then(function (c) {
      webpack(merge(c, config.webpack), function (err, stats) {
        if (err) {
          return reject(err);
        }

        if (stats.hasErrors()) {
          return reject(stats.toString('errors-only'));
        }

        const buildDir = _path.join(process.cwd(), './.antwar/build');
        const renderPage = require(_path.join(buildDir, 'bundleStaticPage.js'));

        return async.parallel([
          function (cb) {
            renderPage('antwar_devindex', function (err2, html) {
              if (err2) {
                return cb(err2);
              }

              return fs.writeFile(
                _path.join(buildDir, 'index.html'),
                html,
                cb
              );
            });
          },
          utils.copyIfExists.bind(null, './assets', _path.join(buildDir, 'assets')),
          utils.copyExtraAssets.bind(null, buildDir, config.antwar.assets)
        ], function (err2) {
          if (err2) {
            return reject(err2);
          }

          return resolve();
        });
      });
    }).catch(function (err) {
      reject(err);
    });
  });
};
