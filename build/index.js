'use strict';
var _fs = require('fs');
var _path = require('path');

var ncp = require('ncp');
var mkdirp = require('mkdirp');
var webpack = require('webpack');

var webpackConfig = require('../config/build');


module.exports = function(config) {
  process.env.NODE_ENV = 'production';

  return new Promise(function(resolve, reject) {
    var site = config.site;

    if(!site) {
      return reject(new Error('Missing site configuration'));
    }

    var output = site.output;

    if(!output) {
      return reject(new Error('Missing output directory'));
    }

    webpackConfig(config).then(function(c) {
      webpack(c, function(err) {
        if(err) {
          return reject(err);
        }

        var cwd = process.cwd();
        var params = {
          cwd: cwd,
          renderPage: require(_path.join(cwd, './.antwar/build/bundleStaticPage.js')),
          allPaths: require(_path.join(cwd, './.antwar/build/paths.js'))(),
          output: _path.join(cwd, output),
        };
        writeAssets(params);
        writePages(params);
        writeIndex(params);
        writePosts(params);

        // TODO: this should be pushed to a plugin
        //var rss = require(_path.join(cwd, './.antwar/build/bundleStaticRss.js'));
        //fs.writeFileSync(_path.join(process.cwd(), output, 'atom.xml'), rss(renderPage));

        resolve();
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};
module.exports.devIndex = require('./dev_index');

function writeAssets(o) {
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
}

function writePages(o) {
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
}

function writeIndex(o) {
  mkdirp.sync(_path.join(o.output, 'blog'));

  _fs.writeFileSync(
    _path.join(o.output,  'blog', 'index.html'),
    o.renderPage('/blog', null)
  );
}

function writePosts(o) {
  Object.keys(o.allPaths.posts).forEach(function(post) {
    var p = _path.join(o.output, 'blog', post);

    mkdirp.sync(p);

    _fs.writeFileSync(
      _path.join(p, 'index.html'),
      o.renderPage('/blog/' + post)
    );
  });
}
