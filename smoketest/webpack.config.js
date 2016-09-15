const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const PATHS = {
  style: [
    path.join(__dirname, 'style', 'main.css')
  ],
  packages: path.join(__dirname, '..', 'packages')
};

const commonConfig = {
  entry: {
    style: PATHS.style
  },
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
  resolve: {
    // Patch webpack module resolution so that the site works with `packages`
    modulesDirectories: [
      PATHS.packages
    ]
  }
};

module.exports = function (env) {
  switch (env) {
    case 'build':
      return merge(
        commonConfig,
        buildConfig(PATHS.style)
      );
    case 'start':
    default:
      return merge(
        commonConfig,
        developmentConfig(PATHS.style)
      );
  }
};

function developmentConfig(stylePaths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader'
          ],
          include: stylePaths
        }
      ]
    }
  };
}

function buildConfig(stylePaths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(
            'style-loader',
            'css-loader'
          ),
          include: stylePaths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css', {
        allChunks: true
      })
    ]
  };
}
