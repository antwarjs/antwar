import * as path from "path";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import getCommon from "./common";

module.exports = config =>
  getCommon(config).then(function(commonConfig) {
    const devConfig = {
      cache: true,
      node: {
        __filename: true,
        fs: "empty",
      },
      output: {
        path: path.join(process.cwd(), "./.antwar/build/"),
        filename: "[name].js",
        publicPath: "/",
        chunkFilename: "[chunkhash].js",
      },
      plugins: [
        new HtmlWebpackPlugin({
          template:
            (config.antwar.template && config.antwar.template.file) ||
            path.join(__dirname, "../../templates/page.ejs"),
          context: {
            cssFiles: [],
            jsFiles: [],
            ...config.template,
          },
        }),
      ],
    };

    return merge(commonConfig, devConfig, config.webpack);
  });
