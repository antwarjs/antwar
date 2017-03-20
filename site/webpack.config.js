const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');

const PATHS = {
  site: [
    path.join(__dirname, 'layouts'),
    path.join(__dirname, 'components'),
    path.join(__dirname, 'pages')
  ],
  style: [
    path.join(__dirname, 'layouts'),
    path.join(__dirname, 'components'),
    path.join(__dirname, 'styles')
  ],
  packages: path.join(__dirname, '..', 'packages')
};

const commonConfig = {
  resolve: {
    // Patch webpack module resolution so that the site works with `packages`
    modules: [
      PATHS.packages
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: PATHS.site
      },
      {
        test: /\.woff$/,
        use: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf$|\.eot$/,
        use: 'file-loader?prefix=font/'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader'
      },
      {
        test: /\.png$/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: 'raw-loader'
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
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
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ],
          include: stylePaths
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader?modules&localIdentName=[local]--[hash:base64:5]',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => ([
                  autoprefixer({ browsers: ['last 2 versions'] })
                ])
              }
            },
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
    output: {
      // XXX: patch paths - this can be removed once there's a root domain
      publicPath: '//antwarjs.github.io/antwar'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          }),
          include: stylePaths
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader?modules',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => ([
                    autoprefixer({ browsers: ['last 2 versions'] })
                  ])
                }
              },
              'sass-loader'
            ]
          }),
          include: stylePaths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name].css',
        allChunks: true
      }),
      new CleanWebpackPlugin(['build'])
    ]
  };
}
