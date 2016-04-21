'use strict';
var path = require('path');

var merge = require('webpack-merge');
var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server');
var devConfig = require('../config/dev');

module.exports = function(config) {
  const devConfigParams = {
    entry: {
      main: [
        'webpack-dev-server/client?http://localhost:' + config.port,
        'webpack/hot/dev-server',
        path.join(__dirname, './dev_entry.js')
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ],
    devtool: 'eval',
    debug: true
  };

  return devConfig(config).then(function(c) {
    runServer(config, merge(c, devConfigParams));
  });
}

function runServer(siteConfig, webpackConfig) {
  const port = siteConfig.port;
  const console = siteConfig.console;

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.join(process.cwd(), './.antwar/build'),
    hot: true,
    historyApiFallback: true,
    stats: 'errors-only'
  }).listen(port, function(err) {
    if(err) {
      return console.error(err);
    }

    console.info('Listening at port ' + port);
  });
}
