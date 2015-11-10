'use strict';
var _fs = require('fs');
var _path = require('path');

var _ = require('lodash');
var async = require('async');
var mkdirp = require('mkdirp');

var utils = require('./utils');

exports.assets = function(o, cb) {
  var assetsDir = _path.join(o.output, 'assets');
  var mainPath = './.antwar/build/bundlePage.css';
  var log = o.config.console.log;
  var info = o.config.console.info;

  log('Creating asset directory');

  mkdirp(assetsDir, function(err) {
    if(err) {
      return cb(err);
    }

    info('Wrote asset directory');

    cb(null, [
      {
        task: 'copy_assets',
        params: [_path.join(o.cwd, 'assets'), assetsDir],
      },
      {
        task: 'write_main',
        params: {
          assetsDir: assetsDir,
          mainPath: mainPath,
        }
      },
    ]);
  });
};

exports.extraAssets = function(o, cb) {
  cb(null, [
    {
      task: 'copy_extra_assets',
      params: [o.output, o.config && o.config.assets],
    }
  ]);
};

exports.indices = function(o, cb) {
  var config = o.config;
  var log = config.console.log;
  var info = config.console.info;

  async.map(_.keys(config.paths), function(pathRoot, cb) {
    var p = _path.join(o.output, pathRoot);

    log('Writing index directory', p);

    mkdirp(p, function(err) {
      if(err) {
        return cb(err);
      }

      info('Wrote index directory');

      // index is a special case
      if(pathRoot === '/') {
        pathRoot = '';
      }

      // XXX: rendering isn't parallel
      cb(null, {
        task: 'write',
        params: {
          path: _path.join(o.output, pathRoot, 'index.html'),
          data: o.renderPage('/' + pathRoot, null),
        }
      });
    });
  }, cb);
};

exports.extras = function(o, files, cb) {
  var log = o.config.console.log;
  var info = o.config.console.info;

  if(!files || !files.length) {
    return cb();
  }

  cb(null, _.flatten(files.map(function(fileCollection) {
    return _.map(fileCollection, function(fileContent, fileName) {
      return {
        task: 'write',
        params: {
          path: _path.join(o.output, fileName),
          data: fileContent
        }
      };
    });
  })));
};

exports.pages = function(o, cb) {
  var log = o.config.console.log;
  var info = o.config.console.info;

  var data = Object.keys(o.allPaths.items).map(function(item) {
    var p = _path.join(o.output, item);

    return {
      path: p,
      item: item,
    };
  });

  async.map(data, function(d, cb) {
    var p = d.path;

    // skip writing index/index.html
    if(p.split('/').slice(-1)[0] === 'index') {
      return cb();
    }

    // XXX: mkdirp could be pushed to task
    mkdirp(p, function(err) {
      if(err) {
        return cb(err);
      }

      // XXXXX: not parallel - this is very slow on big sites!
      // it would be far better to push webpack bits inside the process itself
      cb(null, {
        task: 'write',
        params: {
          path: _path.join(p, 'index.html'),
          data: o.renderPage('/' + d.item)
        }
      });
    });
  }, cb);
};

function id(a) {return a;}
