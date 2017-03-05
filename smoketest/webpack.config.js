const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const PATHS = {
  style: [
    path.join(__dirname, 'style', 'main.css')
  ],
  parentModules: path.join(__dirname, '..', 'node_modules'),
  packages: path.join(__dirname, '..', 'packages')
};

module.exports = function (env) {
  switch (env) {
    case 'build':
      return merge(
        commonConfig(),
        buildConfig(PATHS.style)
      );
    case 'interactive':
      return merge(
        commonConfig(),
        interactiveConfig()
      );
    case 'start':
    default:
      return merge(
        commonConfig(),
        developmentConfig(PATHS.style)
      );
  }
};

function commonConfig() {
  return {
    entry: {
      style: PATHS.style
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
          include: [
            path.join(__dirname, 'layouts'),
            path.join(__dirname, 'pages')
          ]
        }
      ]
    },
    resolve: {
      // Patch webpack module resolution so that the site works with `packages`
      modules: [
        PATHS.packages,
        // Include parent so that interactive lookup works against preact etc.
        PATHS.parentModules
      ]
    },
    resolveLoader: {
      modules: [
        // Include parent so that interactive lookup works against preact etc.
        PATHS.parentModules
      ]
    }
  };
}

function interactiveConfig() {
  return {
    resolve: {
      alias: {
        react: 'preact-compat/dist/preact-compat.min.js',
        'react-dom': 'preact-compat/dist/preact-compat.min.js'
      }
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
}

function developmentConfig(stylePaths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
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
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'style-loader'
          }),
          include: stylePaths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].[chunkhash].css',
        allChunks: true
      }),
      new CleanWebpackPlugin(['build'])
    ]
  };
}
