const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const devConfig = require("../config/dev");

module.exports = function(config) {
  const devConfigParams = {
    entry: {
      main: [
        // As inline mode doesn't work with the Node version (no access to
        // webpack configuration), we have to add entries by hand.
        "webpack-dev-server/client?http://localhost:" + config.antwar.port,
        "webpack/hot/dev-server",
        path.join(__dirname, "./entry.js"),
      ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: "eval",
  };

  return devConfig(config).then(function(c) {
    runServer(config.antwar, merge(c, devConfigParams));
  });
};

function runServer(siteConfig, webpackConfig) {
  const port = siteConfig.port;
  const console = siteConfig.console;

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.join(process.cwd(), "./.antwar/build"),
    hot: true,
    historyApiFallback: true,
    stats: webpackConfig.stats || "errors-only",
  }).listen(port, function(err) {
    if (err) {
      return console.error(err);
    }

    return console.info("Listening at port " + port);
  });
}
