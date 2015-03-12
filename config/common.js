'use strict';
var fs = require('fs');
var path = require('path');

var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
  'process.env': {
    'NODE_ENV': JSON.stringify(process.env.BUILD_DEV ? 'dev' : 'production')
  }
});


module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    var site = config.site;

    if(!site) {
      return reject(new Error('Missing site configuration'));
    }

    var theme = site.theme;

    if(!theme || !theme.name) {
      return reject(new Error('Missing theme'));
    }

    var cwd = process.cwd();
    var parent = path.join(__dirname, '..');

    resolve({
      resolve: {
        root: path.join(parent, 'node_modules'),
        alias: {
          'underscore': 'lodash',
          'pages': path.join(cwd, 'pages'),
          'posts': path.join(cwd, 'posts'),
          'drafts': path.join(cwd, 'drafts'),
          'customStyles': path.join(cwd, 'styles'), // Should be moved to theme specific config
          'config': path.join(cwd, 'antwar.config.js'),
          'antwar-core': path.join(parent, 'elements'),
          'theme': getThemeName(theme.name),
        },
        extensions: [
          '',
          '.webpack.js',
          '.web.js',
          '.js',
          '.jsx',
          '.coffee',
          '.json',
        ],
        modulesDirectories: [
          path.join(cwd, 'node_modules'),
          getThemePath(theme.name),
          'node_modules',
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          getThemePath(theme.name),
          'node_modules',
        ]
      },
      plugins: [definePlugin],
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
    return path.join(process.cwd(), name);
  }

  return path.join(cwd, 'node_modules', name, 'node_modules');
}
