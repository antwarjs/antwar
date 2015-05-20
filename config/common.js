'use strict';
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var webpack = require('webpack');


module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var theme = config.theme;

    if(!theme || !theme.name) {
      return reject(new Error('Missing theme'));
    }

    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');

    var themeConfig = config.themeConfig && config.themeConfig.common;
    themeConfig = themeConfig || {};

    var siteConfig = config.webpack && config.webpack.common;
    siteConfig = siteConfig || {};

    resolve({
      resolve: {
        fallback: path.join(cwd, 'antwar.config.js'),
        root: path.join(parent, 'node_modules'),
        alias: {
          'underscore': 'lodash',
          'pages': path.join(cwd, 'pages'),
          'assets': path.join(cwd, 'assets'),
          'customStyles': path.join(cwd, 'styles'), // Should be moved to theme specific config
          'config': path.join(cwd, 'antwar.config.js'),
          'antwar-core': path.join(parent, 'elements'),
          'theme': getThemeName(theme.name),
        },
        extensions: _.uniq([
          '',
          '.webpack.js',
          '.web.js',
          '.js',
          '.jsx',
          '.coffee',
          '.json',
        ].
        concat(themeConfig.extensions || []).
        concat(siteConfig.extensions || [])),
        modulesDirectories: [
          path.join(cwd, 'node_modules'),
          getThemePath(theme.name),
          'node_modules',
        ]
      },
      resolveLoader: {
        fallback: path.join(cwd, 'antwar.config.js'),
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          getThemePath(theme.name),
          'node_modules',
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV)),
          'process.env': {
            'NODE_ENV': JSON.stringify(process.env.BUILD_DEV ? 'dev' : 'production')
          }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
      ],
      jshint: {
        bitwise: false,
        boss: true,
        curly: false,
        eqnull: true,
        expr: true,
        newcap: false,
        quotmark: false,
        shadow: true,
        strict: false,
        sub: true,
        undef: true,
        unused: 'vars',
      },
    });
  });
};

function getThemeName(name) {
  // XXX: existsSync
  if(fs.existsSync(name)) {
    return path.join(process.cwd(), name);
  }

  return name;
}

function getThemePath(name) {
  var cwd = process.cwd();

  // XXX: existsSync
  if(fs.existsSync(name)) {
    return path.join(cwd, name);
  }

  return path.join(cwd, 'node_modules', name, 'node_modules');
}
