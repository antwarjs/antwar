const _path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

module.exports = ({ configurations }) => {
  return new Promise((resolve, reject) => {
    const devIndexConfig = {
      node: {
        fs: "empty",
      },
      name: "server",
      target: "node",
      entry: {
        site: _path.join(__dirname, "../build/site.js"),
      },
      output: {
        path: _path.join(process.cwd(), "./.antwar/build/"),
        filename: "[name].js",
        publicPath: "/",
        libraryTarget: "commonjs2",
      },
    };

    webpack(merge(devIndexConfig, configurations.webpack), (err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toString("errors-only"));
      }

      return resolve();
    });
  });
};
