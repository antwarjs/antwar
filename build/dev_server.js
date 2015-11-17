'use strict';
var path = require('path');

var merge = require('webpack-merge');
var portfinder = require('portfinder');
var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server');
var devConfig = require('../config/dev');

module.exports = function(config) {
  return new Promise(function(resolve, reject) {
    portfinder.getPort(function(err, port) {
      if(err) {
        return reject(err);
      }

      devServer(port, config);

      resolve();
    });
  });
};

function devServer(port, config) {
  var devConfigParams = {
    entry: {
      main: path.join(__dirname, './dev_entry.js')
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'eval',
    debug: true
  };

  return devConfig(config).then(function(c) {
    runServer(port, merge(c, devConfigParams));
  });
}

function runServer(port, config) {
  new WebpackDevServer(webpack(config), {
    contentBase: path.join(process.cwd(), './.antwar/build'),
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: {
      hash: false,
      version: false,
      assets: false,
      cached: false,
      colors: true
    }
  }).listen(port, function(err) {
    if(err) {
      return console.error(err);
    }

    console.info('Listening at port ' + port);
  });
}
