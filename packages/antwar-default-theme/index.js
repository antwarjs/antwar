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
              'autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}!' +
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
              'autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}',
              'sass-loader'
            ]
          }
        ]
      }
    }
  }
};
