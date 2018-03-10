import * as path from "path";
import merge from "webpack-merge";

module.exports = function({ configurations }) {
  const buildConfig = {
    mode: "production",
    node: {
      fs: "empty",
    },
    name: "server",
    target: "node",
    entry: {
      site: path.join(__dirname, "../build/site.js"),
    },
    output: {
      path: path.join(process.cwd(), configurations.antwar.output),
      filename: "[name].js",
      publicPath: "/",
      libraryTarget: "commonjs2",
    },
  };

  return merge(buildConfig, configurations.webpack);
};
