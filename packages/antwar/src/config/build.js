import * as path from "path";
import merge from "webpack-merge";

module.exports = function(config) {
  config.buildDev = config.buildDev || 0; // eslint-disable-line no-param-reassign

  return require("./common")(config).then(function(commonConfig) {
    const buildConfig = {
      node: {
        fs: "empty"
      },
      name: "server",
      target: "node",
      entry: {
        site: path.join(__dirname, "../build/site.js")
      },
      output: {
        path: path.join(process.cwd(), config.antwar.output),
        filename: "[name].js",
        publicPath: "/",
        libraryTarget: "commonjs2"
      }
    };

    return merge(commonConfig, buildConfig, config.webpack);
  });
};
