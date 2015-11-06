'use strict';
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(config) {
  var getCommon = require('./common');
  var cwd = process.cwd();

  var themeConfig = config.themeConfig && config.themeConfig.build;
  themeConfig = themeConfig && themeConfig({
    ExtractTextPlugin: ExtractTextPlugin
  }) || {};

  var siteConfig = config.webpack && config.webpack.build;
  siteConfig = siteConfig || {};

  config.buildDev = config.buildDev || 0;

  return getCommon(config).then(function(common) {
    return {
      node: {
        fs: 'empty',
      },
      name: 'server',
      target: 'node',
      context: path.join(__dirname, '..', './'),
      entry: {
        bundleStaticPage: './dev/staticPage.js',
        paths: './dev/exportPaths.js',
      },
      output: {
        path: path.join(cwd, './.antwar/build'),
        filename: '[name].js',
        publicPath: path.join(cwd, './.antwar/build'),
        libraryTarget: 'commonjs2',
      },
      plugins: common.plugins.concat([
        new ExtractTextPlugin('[name].css', {
          allChunks: true
        })
      ]),
      resolve: common.resolve,
      resolveLoader: common.resolveLoader,
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            loader: 'babel',
            include: new RegExp(common.corePath + '|' + cwd),
            exclude: new RegExp(common.resolve.root + '|' + common.themeDependenciesPath +
              '|' + path.join(cwd, 'node_modules')),
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              'style-loader', 'css-loader'),
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
          },
          {
            test: /\.html$/,
            loader: 'raw',
          },
          {
            test: /\.svg$/,
            loader: 'raw',
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader',
          }
        ].concat(themeConfig.module && themeConfig.module.loaders? themeConfig.module.loaders: []).
        concat(siteConfig.module && siteConfig.module.loaders? siteConfig.module.loaders: []),
      }
    };
  });
};
