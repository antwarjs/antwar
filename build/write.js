'use strict';
var _fs = require('fs');
var _path = require('path');

var ncp = require('ncp');
var mkdirp = require('mkdirp');


exports.assets = function(o) {
  var assets = _path.join(o.output, 'assets');
  var mainPath = './.antwar/build/main.css';

  mkdirp.sync(assets);

  ncp(_path.join(o.cwd, './assets'), assets);

  if(_fs.existsSync(mainPath)) {
    _fs.writeFileSync(
      _path.join(assets, 'main.css'),
      _fs.readFileSync(mainPath)
    );
  }
};

exports.pages = function(o) {
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

      _fs.writeFileSync(
        _path.join(publicPath, 'index.html'),
        o.renderPage('/' + path, null)
      );
    }
  });
};

exports.index = function(o) {
  mkdirp.sync(_path.join(o.output, 'blog'));

  _fs.writeFileSync(
    _path.join(o.output,  'blog', 'index.html'),
    o.renderPage('/blog', null)
  );
};

exports.posts = function(o) {
  Object.keys(o.allPaths.posts).forEach(function(post) {
    var p = _path.join(o.output, 'blog', post);

    mkdirp.sync(p);

    _fs.writeFileSync(
      _path.join(p, 'index.html'),
      o.renderPage('/blog/' + post)
    );
  });
};
