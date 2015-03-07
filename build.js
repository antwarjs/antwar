'use strict';
var fs = require('fs');
var _path = require('path');

var Promise = require('es6-promise').Promise;
var mkdirp = require('mkdirp');
var ncp = require('ncp');
var webpack = require('webpack');
var webpackConfig = require('./webpack.coffee').build;


exports.buildDevIndex = function(config) {
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

exports.build = function(config) {
  process.env.NODE_ENV = 'production';

  return new Promise(function(resolve, reject) {
    var output = config.output;

    if(!output) {
      return reject(new Error('Missing output directory'));
    }

    webpackConfig(config).then(function(c) {
      webpack(c, function(err) {
        if(err) {
          return reject(err);
        }

        var cwd = process.cwd();

        var assets = _path.join(cwd, output, 'assets');
        var renderPage = require(_path.join(cwd, './.antwar/build/bundleStaticPage.js'));
        var paths = require(_path.join(cwd, './.antwar/build/paths.js'));

        mkdirp.sync(_path.join(cwd, output, 'blog'));
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

        var params = {
          renderPage: renderPage,
          allPaths: allPaths,
          output: _path.join(cwd, output),
        };
        writePages(params);
        writeIndex(params);
        writePosts(params);

        // TODO: this should be pushed to a plugin
        //var rss = require(_path.join(cwd, './.antwar/build/bundleStaticRss.js'));
        //fs.writeFileSync(_path.join(process.cwd(), output, 'atom.xml'), rss(renderPage));

        resolve();
      });
    });
  });
};

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

      fs.writeFileSync(
        _path.join(publicPath, 'index.html'),

        o.renderPage('/' + path, null)
      );
    }
  });
}

function writeIndex(o) {
  fs.writeFileSync(
    _path.join(o.output,  'blog', 'index.html'),

    o.renderPage('/blog', null)
  );
}

function writePosts(o) {
  Object.keys(o.allPaths.posts).forEach(function(post) {
    var p = _path.join(o.output, 'blog', post);

    mkdirp.sync(p);

    fs.writeFileSync(
      _path.join(p, 'index.html'),

      o.renderPage('/blog/' + post)
    );
  });
}
