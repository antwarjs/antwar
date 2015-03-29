'use strict';
var fs = require('fs');
var _path = require('path');

var async = require('async');
var cpr = require('cpr');
var webpack = require('webpack');
var webpackConfig = require('../config/build');


module.exports = function(config) {
  process.env.BUILD_DEV = 1;

  return new Promise(function(resolve, reject) {
    webpackConfig(config).then(function(c) {
      webpack(c, function(err) {
        if(err) {
          return reject(err);
        }

        var buildDir = _path.join(process.cwd(), './.antwar/build');
        var renderPage = require(_path.join(buildDir, 'bundleStaticPage.js'));

        async.parallel([
          fs.writeFile.bind(null,
            _path.join(buildDir, 'index.html'),
            renderPage('/antwar_devindex', null)
          ),
          cpr.bind(null,
            './assets',
            _path.join(buildDir, 'assets'))
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
