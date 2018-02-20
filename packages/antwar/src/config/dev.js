import * as path from "path";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import getCommon from "./common";

module.exports = config =>
  getCommon(config).then(function(commonConfig) {
    const template = config.antwar.template || {};
    const devConfig = {
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
            template.file || path.join(__dirname, "../../templates/page.ejs"),
          context: {
            ...template.context,
            cssFiles: [],
            jsFiles: [],
          },
        }),
        new webpack.NamedModulesPlugin(),
      ],
    };

    return merge(commonConfig, devConfig, config.webpack);
  });
