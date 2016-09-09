const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
  return {
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.join(__dirname, 'layouts'),
            path.join(__dirname, 'pages')
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin()
    ]
  };
};
