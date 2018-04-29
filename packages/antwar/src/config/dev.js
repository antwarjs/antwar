import * as path from "path";
import merge from "webpack-merge";
import MiniHtmlWebpackPlugin from "mini-html-webpack-plugin";
import webpack from "webpack";

module.exports = config => {
  const devConfig = {
    mode: "development",
    node: { __filename: true, fs: "empty" },
    output: {
      path: path.join(process.cwd(), "./.antwar/build/"),
      filename: "[name].js",
      publicPath: "/",
      chunkFilename: "[chunkhash].js",
    },
    plugins: [new MiniHtmlWebpackPlugin()],
  };

  return merge(devConfig, config.webpack);
};
