'use strict';
var path = require('path');

var getCommon = require('./common');


module.exports = function(config) {
  var ReactHotLoaderMatches = /View.coffee|Pages\//;
  var cwd = process.cwd();

  var themeConfig = config.themeConfig && config.themeConfig.development;
  themeConfig = themeConfig || {};

  var siteConfig = config.webpack && config.webpack.development;
  siteConfig = siteConfig || {};

  return getCommon(config).then(function(common) {
    return {
      cache: true,
      node: {
        __filename: true
      },
      output: {
        path: path.join(cwd, './.antwar/build/'),
        publicPath: '/',
        filename: '[name]-bundle.js',
        chunkFilename: '[chunkhash].js',
      },
      plugins: common.plugins,
      module: {
        loaders: [
          {
            test: /\.woff$/,
            loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff',
          },
          {
            test: /\.ttf$|\.eot$/,
            loader: 'file-loader?prefix=font/',
          },
          {
            test: /\.coffee$/,
            exclude: ReactHotLoaderMatches,
            loader: 'react-hot!jshint-loader!coffee-loader',
          },
          {
            test: /\.json$/,
            loader: 'json-loader',
          },
          {
            test: /\.svg$/,
            loader: 'raw-loader',
          },
          {
            test: /\.jsx?$/,
            loaders: [
              'react-hot',
              'jsx?harmony'
            ]
          },
          {
            test: /\.css$/,
            loaders: [
              'style-loader',
              'css-loader',
            ],
          },
          {
            test: /\.scss$/,
            loaders: [
              'style-loader',
              'css-loader',
              'autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}',
              'sass-loader',
            ],
          },
          {
            test: ReactHotLoaderMatches,
            loader: 'react-hot!coffee-loader',
          },
          {
            test: /\.md$/,
            loader: 'json!yaml-frontmatter-loader',
          }
        ].concat(themeConfig.module && themeConfig.module.loaders? themeConfig.module.loaders: []).
        concat(siteConfig.module && siteConfig.module.loaders? siteConfig.module.loaders: []),
      },
      resolve: common.resolve,
      resolveLoader: common.resolveLoader,
      jshint: common.jshint,
    };
  });
};
