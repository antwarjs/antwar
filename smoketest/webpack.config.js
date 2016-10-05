const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const PATHS = {
  style: [
    path.join(__dirname, 'style', 'main.css')
  ],
  parentModules: path.join(__dirname, '..', 'node_modules'),
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
      PATHS.packages,
      // Include parent so that interactive lookup works against preact etc.
      PATHS.parentModules
    ]
  },
  resolveLoader: {
    modulesDirectories: [
      // Include parent so that interactive lookup works against preact etc.
      PATHS.parentModules
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
    case 'interactive':
      return merge(
        commonConfig,
        buildConfig(PATHS.style),
        {
          resolve: {
            alias: {
              react: 'preact-compat',
              'react-dom': 'preact-compat'
            }
          },
          plugins: [
            new webpack.optimize.UglifyJsPlugin({
              compress: {
                warnings: false
              }
            })
          ]
        }
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
