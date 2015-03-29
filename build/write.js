'use strict';
var _fs = require('fs');
var _path = require('path');

var async = require('async');
var cpr = require('cpr');
var mkdirp = require('mkdirp');


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

exports.pages = function(o, cb) {
  var data = [];

  Object.keys(o.allPaths).forEach(function(path) {
    if(path !== 'posts') {
      var publicPath = o.output;

      if(path === '/') {
        path = '';
      }
      else {
        publicPath = _path.join(o.output, path);

        mkdirp.sync(publicPath);
      }

      data.push({
        publicPath: publicPath,
        path: path
      });
    }
  });

  async.each(data, function(d, cb) {
    _fs.writeFile(
      _path.join(d.publicPath, 'index.html'),
      o.renderPage('/' + d.path, null),
      cb
    );
  }, cb);
};

exports.index = function(o, cb) {
  var blogRoot = o.config.blogRoot || 'blog';

  mkdirp(_path.join(o.output, blogRoot), function(err) {
    if(err) {
      return cb(err);
    }

    _fs.writeFile(
      _path.join(o.output, blogRoot, 'index.html'),
      o.renderPage('/' + blogRoot, null),
      cb
    );
  });
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

exports.posts = function(o, cb) {
  var blogRoot = o.config.blogRoot || 'blog';

  var data = [];

  Object.keys(o.allPaths.posts).forEach(function(post) {
    var p = _path.join(o.output, blogRoot, post);

    mkdirp.sync(p);

    data.push({
      path: _path.join(o.output, blogRoot, post),
      post: post,
    });
  });

  async.each(data, function(d, cb) {
    mkdirp(d.path, function(err) {
      if(err) {
        return cb(err);
      }

      _fs.writeFile(
        _path.join(d.path, 'index.html'),
        o.renderPage('/' + blogRoot + '/' + d.post),
        cb
      );
    });
  }, cb);
};
