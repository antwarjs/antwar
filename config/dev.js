'use strict';
var path = require('path');
var merge = require('webpack-merge');
var getCommon = require('./common');

module.exports = function(config) {
  var cwd = process.cwd();

  var siteConfig = config.webpack && config.webpack.development;
  siteConfig = siteConfig && siteConfig() || {};

  return getCommon(config).then(function(common) {
    var includes = [
      common.corePath,
      cwd
    ];
    var excludes = [
      common.resolve.root
    ];

    var common = {
      cache: true,
      node: {
        __filename: true,
        fs: 'empty'
      },
      output: {
        path: path.join(cwd, './.antwar/build/'),
        publicPath: '/',
        filename: '[name]-bundle.js',
        chunkFilename: '[chunkhash].js'
      },
      plugins: common.plugins,
      module: {
        loaders: [
          {
            test: /\.woff$/,
            loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff',
            include: includes,
            exclude: excludes
          },
          {
            test: /\.ttf$|\.eot$/,
            loader: 'file-loader?prefix=font/',
            include: includes,
            exclude: excludes
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
            //include: includes,
            //exclude: excludes
          },
          {
            test: /\.svg$/,
            loader: 'raw-loader',
            include: includes,
            exclude: excludes
          },
          {
            test: /\.jsx$/,
            loaders: [
              'react-hot',
              'babel'
            ],
            include: includes,
            exclude: excludes
          },
          {
            test: /\.css$/,
            loaders: [
              'style-loader',
              'css-loader'
            ],
            include: includes
            //exclude: excludes
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader',
            //include: includes,
            exclude: excludes
          }
        ]
      },
      resolve: common.resolve,
      resolveLoader: common.resolveLoader
    };

    return merge(common, siteConfig);
  });
};
