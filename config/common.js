'use strict';
var path = require('path');


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
          'theme': theme.name,
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
