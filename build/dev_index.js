'use strict';
var fs = require('fs');
var _path = require('path');

var ncp = require('ncp');
var webpack = require('webpack');
var webpackConfig = require('../config/build');


module.exports = function(config) {
  process.env.NODE_ENV = 'dev';

  return new Promise(function(resolve, reject) {
    webpackConfig(config).then(function(c) {
      webpack(c, function(err) {
        if(err) {
          return reject(err);
        }

        var cwd = process.cwd();
        var renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

        fs.writeFileSync(
          _path.join(cwd, './.antwar/build/index.html'),
          renderPage('/antwar_devindex', null)
        );

        ncp('./assets', _path.join(cwd, './.antwar/build/assets'));

        resolve();
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};
