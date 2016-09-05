module.exports = {
  layouts() {
    return require('./layouts');
  },
  webpack: {
    build(plugins) {
      const ExtractTextPlugin = plugins.ExtractTextPlugin;

      return {
        module: {
          loaders: [
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract(
                'style-loader',
                'css-loader?minimize!autoprefixer-loader?{browsers:["last 2 version", "ie 10", "Android 4"]}!sass-loader')
            }
          ]
        }
      };
    },
    development() {
      return {
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
      };
    }
  }
};
