'use strict';
var _fs = require('fs');
var _path = require('path');

var async = require('async');
var cpr = require('cpr');
var mkdirp = require('mkdirp');

var utils = require('./utils');


exports.assets = function(o, cb) {
  var assetsDir = _path.join(o.output, 'assets');
  var mainPath = './.antwar/build/bundlePage.css';

  mkdirp(assetsDir, function(err) {
    if(err) {
      return cb(err);
    }

    async.parallel([
      cpr.bind(null, _path.join(o.cwd, 'assets'), assetsDir),
      function(cb) {
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
    ], cb);
  });
};

exports.extraAssets = function(o, cb) {
  return utils.copyExtraAssets(o.output, o.config && o.config.assets, cb);
};

exports.pages = function(o, cb) {
  var data = Object.keys(o.allPaths).map(function(path) {
    if(path !== 'items') {
      var publicPath = o.output;

      if(path === '/') {
        path = '';
      }
      else {
        publicPath = _path.join(o.output, path);
      }

      // XXX: replace with async version
      mkdirp.sync(publicPath);

      return {
        publicPath: publicPath,
        path: path
      };
    }
  }).filter(id);

  async.each(data, function(d, cb) {
    _fs.writeFile(
      _path.join(d.publicPath, 'index.html'),
      o.renderPage('/' + d.path, null),
      cb
    );
  }, cb);
};

exports.index = function(o, cb) {
  var paths = _.keys(o.config.paths);

  async.each(_.keys(o.config.paths), function(pathRoot, cb) {
    mkdirp(_path.join(o.output, pathRoot), function(err) {
      if(err) {
        return cb(err);
      }

      _fs.writeFile(
        _path.join(o.output, pathRoot, 'index.html'),
        o.renderPage('/' + pathRoot, null),
        cb
      );
    });
  }, cb);
};

exports.extras = function(o, files, cb) {
  if(!files || !files.length) {
    return cb();
  }

  _.each(files, function(file) {
    _.each(file, function(fileContent, fileName) {
      _fs.writeFile(
        _path.join(o.output, fileName),
        fileContent,
        cb
      );
    });
  });
};

exports.items = function(o, cb) {
  var data = Object.keys(o.allPaths.items).map(function(item) {
    var p = _path.join(o.output, item);

    // XXX: replace with async version
    mkdirp.sync(p);

    return {
      path: p,
      item: item,
    };
  });

  async.each(data, function(d, cb) {
    mkdirp(d.path, function(err) {
      if(err) {
        return cb(err);
      }

      _fs.writeFile(
        _path.join(d.path, 'index.html'),
        o.renderPage('/' + d.item),
        cb
      );
    });
  }, cb);
};

function id(a) {return a;}
