const path = require('path');

module.exports = function (env, options) {
  return commonConfig(options.paths);
};

function commonConfig(includes) {
  return {
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: includes.concat([
            path.join(__dirname, 'pages')
          ])
        }
      ]
    }
  };
}
