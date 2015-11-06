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
      utils.copyIfExists.bind(null, _path.join(o.cwd, 'assets'), assetsDir),
      function(cb) {
        _fs.exists(mainPath, function(exists) {
          if(!exists) {
            return cb();
          }

          log('Writing main.css');

          _fs.readFile(mainPath, function(err, data) {
            if(err) {
              return cb(err);
            }

            _fs.writeFile(_path.join(assetsDir, 'main.css'), data, function(err) {
              info('Wrote main.css');

              cb(err);
            });
          });
        });
      }
    ]);
  });
};

exports.extraAssets = function(o, cb) {
  cb(null, [
    utils.copyExtraAssets.bind(null, o.output, o.config && o.config.assets)
  ]);
};

exports.index = function(o, cb) {
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

      cb(null, function(cb) {
        var p = _path.join(o.output, pathRoot, 'index.html');

        log('Writing index', p);

        _fs.writeFile(p, o.renderPage('/' + pathRoot, null), function(err) {
          info('Wrote index', p);

          cb(err);
        });
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

  async.map(files, function(file, cb) {
    async.map(file, function(f, cb) {
      // XXXXX: define a better interface. now it's just an object
      var fileName = f[Object.keys(f)];
      var fileContent = f[fileName];

      var p = _path.join(o.output, fileName);

      cb(null, function(cb) {
        log('Writing extra', p);

        _fs.writeFile(p, fileContent, function(err) {
          info('Wrote extra', p);

          cb(err);
        });
      });
    }, cb);
  }, function(err, d) {
    cb(err, _.flatten(d));
  });
};

exports.items = function(o, cb) {
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

    cb(null, function(cb) {
      log('Writing item', p);

      mkdirp(p, function(err) {
        if(err) {
          return cb(err);
        }

        _fs.writeFile(
          _path.join(p, 'index.html'),
          o.renderPage('/' + d.item),
          function(err) {
            info('Wrote item', p);

            cb(err);
          }
        );
      });
    });
  }, cb);
};

function id(a) {return a;}
