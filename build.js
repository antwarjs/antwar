'use strict';
var fs = require('fs');
var _path = require('path');

var mkdirp = require('mkdirp');
var ncp = require('ncp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.coffee').build;


exports.buildDevIndex = function(config) {
  process.env.NODE_ENV = 'dev';

  webpack(webpackConfig(config), function(err) {
    if(err) {
      return console.error(err);
    }

    var cwd = process.cwd();
    var page = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));

    fs.writeFileSync(
      _path.join(cwd, './.antwar/build/index.html'),
      page,
      '/antwar_devindex',
      null
    );

    ncp('./assets', _path.join(cwd, './.antwar/build/assets'));
  });
};

exports.build = function(config) {
  process.env.NODE_ENV = 'production';

  webpack(webpackConfig(config), function(err) {
    if(err) {
      return console.error(err);
    }

    var cwd = process.cwd();

    var assets = _path.join(cwd, './public/assets');
    var renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));
    var paths = require(_path.join(cwd, './.antwar/build/paths.js'));

    mkdirp.sync(_path.join(cwd, './public/blog'));
    mkdirp.sync(assets);

    ncp(_path.join(cwd, './assets'), assets);

    // TODO: write CSS if it exists
    /*
    fs.writeFileSync(
      _path.join(assets, '/main.css'),
      fs.readFileSync('./.antwar/build/main.css')
    );
    */

    var allPaths = paths();

    writePages(cwd, renderPage, allPaths);
    writeIndex(cwd, renderPage);
    writePosts(cwd, renderPage, allPaths);

    // TODO: this should be pushed to a plugin
    //var rss = require(_path.join(cwd, './.antwar/build/bundleStaticRss.js'));
    //fs.writeFileSync(_path.join(process.cwd(), './public/atom.xml'), rss(renderPage));
  });
};

function writePages(root, renderPage, allPaths) {
  Object.keys(allPaths).forEach(function(path) {
    if(path !== 'posts') {
      var publicPath;

      if(path === '/') {
        path = '';

        publicPath = _path.join(root, './public');
      }
      else {
        publicPath = _path.join(root, './public/' + path);

        mkdirp.sync(publicPath);
      }

      fs.writeFileSync(
        _path.join(publicPath, 'index.html'),
        renderPage('/' + path, null)
      );
    }
  });
}

function writeIndex(root, renderPage) {
  fs.writeFileSync(
    _path.join(root, './public/blog/index.html'),
    renderPage('/blog', null)
  );
}

function writePosts(root, renderPage, allPaths) {
  Object.keys(allPaths.posts).forEach(function(post) {
    fs.writeFileSync(
      _path.join(root, './public/blog/' + post + '.html'),
      renderPage('/blog/' + post)
    );
  });
}
