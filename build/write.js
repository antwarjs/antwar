'use strict';
var _fs = require('fs');
var _path = require('path');

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

    log('Copying assets');

    // TODO: move control to higher level so there's better control over workers
    async.parallelLimit([
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
    ], 1, function(err) {
      info('Copied assets');

      cb(err);
    });
  });
};

exports.extraAssets = function(o, cb) {
  var log = o.config.console.log;
  var info = o.config.console.info;

  log('Copying extra assets');

  return utils.copyExtraAssets(o.output, o.config && o.config.assets, function(err) {
    info('Copied extra assets');

    cb(err);
  });
};

exports.index = function(o, cb) {
  var config = o.config;
  var log = config.console.log;
  var info = config.console.info;

  log('Writing indices');

  async.each(_.keys(config.paths), function(pathRoot, cb) {
    var p = _path.join(o.output, pathRoot);

    log('Writing index directory', p);

    mkdirp(p, function(err) {
      if(err) {
        return cb(err);
      }

      // index is a special case
      if(pathRoot === '/') {
        pathRoot = '';
      }

      var p = _path.join(o.output, pathRoot, 'index.html');

      log('Writing index', p);

      _fs.writeFile(p, o.renderPage('/' + pathRoot, null), function(err) {
        info('Wrote index', p);

        cb(err);
      });
    });
  }, function(err) {
    info('Wrote indices');

    cb(err);
  });
};

exports.extras = function(o, files, cb) {
  var log = o.config.console.log;
  var info = o.config.console.info;

  if(!files || !files.length) {
    return cb();
  }

  log('Writing extras');

  // TODO: move control to higher level so there's better control over workers
  async.eachLimit(files, 1, function(file, cb) {
    async.each(file, function(f, cb) {
      // XXXXX: define a better interface. now it's just an object
      var fileName = f[Object.keys(f)];
      var fileContent = f[fileName];

      var p = _path.join(o.output, fileName);

      log('Writing extra', p);

      _fs.writeFile(p, fileContent, function(err) {
        info('Wrote extra', p);

        cb(err);
      });
    }, cb);
  }, function(err) {
    info('Wrote extras');

    cb(err);
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

  log('Writing items', data.length);

  // TODO: move control to higher level so there's better control over workers
  async.eachLimit(data, 1, function(d, cb) {
    var p = d.path;

    // skip writing index/index.html
    if(p.split('/').slice(-1)[0] === 'index') {
      return cb();
    }

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
  }, function(err) {
    info('Wrote items');

    cb(err);
  });
};

function id(a) {return a;}
