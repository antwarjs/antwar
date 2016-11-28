const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const PATHS = {
  site: [
    path.join(__dirname, 'layouts'),
    path.join(__dirname, 'pages')
  ],
  style: [
    path.join(process.cwd(), 'layouts'),
    path.join(process.cwd(), 'styles')
  ],
  packages: path.join(__dirname, '..', 'packages')
};

const commonConfig = {
  resolve: {
    // Patch webpack module resolution so that the site works with `packages`
    modulesDirectories: [
      PATHS.packages
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: PATHS.site
      },
      {
        test: /\.woff$/,
        loaders: ['url?prefix=font/&limit=5000&mimetype=application/font-woff']
      },
      {
        test: /\.ttf$|\.eot$/,
        loaders: ['file?prefix=font/']
      },
      {
        test: /\.jpg$/,
        loaders: ['file']
      },
      {
        test: /\.png$/,
        loaders: ['file']
      },
      {
        test: /\.svg$/,
        loaders: ['raw']
      },
      {
        test: /\.html$/,
        loaders: ['raw']
      },
      {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ],
  plugins: [
    new CopyWebpackPlugin([
      {
        from: './CNAME',
        to: './'
      }
    ])
  ]
};

module.exports = function (env) {
  switch (env) {
    case 'build':
      return merge(
        commonConfig,
        buildConfig(PATHS.style)
      );
    default:
    case 'start':
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
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader?modules&localIdentName=[local]--[hash:base64:5]',
            'postcss-loader',
            'sass-loader'
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
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(
            'style-loader',
            'css-loader!postcss-loader!sass-loader'
          ),
          include: stylePaths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].css', {
        allChunks: true
      }),
      new CleanWebpackPlugin(['build'])
    ]
  };
}
