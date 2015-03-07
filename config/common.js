'use strict';
var path = require('path');

var Promise = require('es6-promise').Promise;


module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    if(!config.theme.name) {
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
          'config': path.join(cwd, 'antwar.config.js'),
          'elements': path.join(parent, 'elements'), // Should be removed in favour of antwar-core
          'antwar-core': path.join(parent, 'elements'),
          'theme': config.theme.name,
        },
        extensions: [
          '',
          '.webpack.js',
          '.web.js',
          '.js',
          '.coffee',
          '.json',
        ],
        modulesDirectories: [
          path.join(cwd, 'node_modules'),
          'node_modules',
        ]
      },
      resolveLoader: {
        modulesDirectories: [
          path.join(parent, 'node_modules'),
          'node_modules',
        ]
      },
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
