'use strict';
var _fs = require('fs');
var _path = require('path');

var async = require('async');
var webpack = require('webpack');

var utils = require('./utils');
var webpackConfig = require('../config/build');

var cwd = process.cwd();

module.exports = function(o, cb) {
  if(o.task === 'copy_assets') {
    utils.copyIfExists.apply(null, o.params.concat([cb]));
  }
  else if(o.task === 'write_main') {
    writeMain(o.params, cb);
  }
  else if(o.task === 'copy_extra_assets') {
    utils.copyExtraAssets.apply(null, o.params.concat([cb]));
  }
  else if(o.task === 'write') {
    write(o.params, cb);
  }
  else if(o.task === 'write_pages') {
    writePages(o.params, cb);
  }
  else {
    cb();
  }
};

function writeMain(params, cb) {
  var assetsDir = params.assetsDir;
  var mainPath = params.mainPath;

  _fs.exists(mainPath, function(exists) {
    if(!exists) {
      return cb();
    }

    _fs.readFile(mainPath, function(err, data) {
      if(err) {
        return cb(err);
      }

      _fs.writeFile(_path.join(assetsDir, 'main.css'), data, cb);
    });
  });
}

function writePages(params, cb) {
  var cwd = process.cwd();

  try {
    var config = require(_path.join(cwd, 'antwar.config.js'));
  }
  catch(err) {
    return cb(err);
  }

  webpackConfig(config).then(function(c) {
    webpack(c, function(err) {
      if(err) {
        return cb(err);
      }

      var renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

      async.each(params.pages, function(page, cb) {
        // XXX: why page can be null?
        if(page) {
          renderPage(page.page, function(err, html) {
            if(err) {
              return cb(err);
            }

            write({
              path: page.path,
              data: html
            }, cb);
          });
        }
        else {
          cb();
        }
      }, cb);
    });
  }).catch(cb);
}

function write(params, cb) {
  _fs.writeFile(params.path, params.data, cb);
}
