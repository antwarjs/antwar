const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  layouts() {
    return require('./layouts');
  },
  webpack: {
    build: {
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract(
              'style-loader',
              'css-loader?minimize!' +
              'sass-loader'
            )
          }
        ]
      }
    },
    development: {
      module: {
        loaders: [
          {
            test: /\.scss$/,
            loaders: [
              'style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
        ]
      }
    }
  }
};
