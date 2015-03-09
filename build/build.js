'use strict';
var _path = require('path');

var webpack = require('webpack');

var webpackConfig = require('../config/build');
var write = require('./write');


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
        write.assets(params);
        write.pages(params);
        write.index(params);
        write.posts(params);

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
