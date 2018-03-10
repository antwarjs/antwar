const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const devConfig = require("../config/dev");

module.exports = config => {
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
  };

  return runServer(config.antwar, merge(devConfig(config), devConfigParams));
};

function runServer({ port, console }, webpackConfig) {
  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: path.join(process.cwd(), "./.antwar/build"),
    hot: true,
    historyApiFallback: true,
    stats: webpackConfig.stats,
  }).listen(port, err => {
    if (err) {
      return console.error(err);
    }

    return console.info("Listening at port " + port);
  });
}
