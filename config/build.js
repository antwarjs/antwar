'use strict';
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var getCommon = require('./common');


module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var cwd = process.cwd();

    getCommon(config).then(function(common) {
      resolve({
        name: 'server',
        target: 'node',
        context: path.join(__dirname, '..', './'),
        entry: {
          bundlePage: './dev/page.coffee',
          bundleStaticRss: './dev/staticRss.coffee',
          bundleStaticPage: './dev/staticPage.coffee',
          paths: './dev/exportPaths.js',
        },
        output: {
          path: path.join(cwd, './.antwar/build'),
          filename: '[name].js',
          publicPath: path.join(cwd, './.antwar/build'),
          libraryTarget: 'commonjs2',
        },
        plugins: [
          new ExtractTextPlugin('main.css', {
            allChunks: true,
          })
        ],
        resolve: common.resolve,
        resolveLoader: common.resolveLoader,
        module: {
          loaders: [
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract(
                'style-loader',
                'css-loader!autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}!sass-loader'),
            },
            {
              test: /\.jsx?$/,
              loader: 'jsx-loader?harmony',
            },
            {
              test: /\.coffee$/,
              loader: 'coffee-loader',
            },
            {
              test: /\.html$/,
              loader: 'raw',
            },
            {
              test: /\.md$/,
              loader: 'json!yaml-frontmatter-loader',
            }
          ],
          jshint: common.jshint,
        }
      });
    }).catch(function(err) {
      reject(err);
    });
  });
};
