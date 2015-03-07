'use strict';
var path = require('path');

var Promise = require('es6-promise').Promise;
var portfinder = require('portfinder');
var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config');

var devConfig = require('./config/webpack.coffee').dev;


// XXX: is this actually needed?
var servers = [];

function devServer(port, config) {
  var devConfigParams = {};

  devConfigParams.entry ={
    main: [
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server',
      path.join(__dirname, './dev/entry.coffee'),
    ],
  };

  devConfigParams.plugins = [
    new webpack.HotModuleReplacementPlugin(),
  ];

  devConfigParams.devtool = 'eval';
  devConfigParams.debug = true;

  return new Promise(function(resolve, reject) {
    devConfig(config).then(function(c) {
      runServer(port, webpackConfig(devConfigParams, c));

      resolve();
    }).catch(function(err) {
      reject(err);
    });
  });
}

function runServer(port, config) {
  new WebpackDevServer(webpack(config), {
    contentBase: path.join(process.cwd(), './.antwar/build'),
    hot: true,
    historyApiFallback: true,
    stats: {
      hash: false,
      version: false,
      assets: false,
      cached: false,
      colors: true,
    }
  }).listen(port, function(err) {
    if(err) {
      return console.error(err);
    }

    console.info('Listening at port ' + port);
  });
}

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    portfinder.getPort(function(err, port) {
      if(err) {
        return reject(err);
      }

      servers.push(devServer(port, config));

      resolve();
    });
  });
};
