const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

module.exports = function (env) {
  const stylePaths = [
    path.join(process.cwd(), 'styles')
  ];

  switch (env) {
    case 'build':
      return merge(
        commonConfig(),
        buildConfig(stylePaths)
      );
    default:
    case 'start':
      return merge(
        commonConfig(),
        developmentConfig(stylePaths)
      );
  }
};

function commonConfig() {
  return {
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          include: [
            path.join(__dirname, 'layouts'),
            path.join(__dirname, 'pages')
          ]
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
    }
  };
}

function developmentConfig(stylePaths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: stylePaths
        }
      ]
    }
  };
}

function buildConfig(stylePaths) {
  return {
    plugins: [
      new ExtractTextPlugin('[name].css', {
        allChunks: true
      })
    ],
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(
            'style',
            'css'
          ),
          include: stylePaths
        }
      ]
    }
  };
}
