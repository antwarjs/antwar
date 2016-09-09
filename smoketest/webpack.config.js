const path = require('path');

module.exports = function () {
  return {
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [
            path.join(__dirname, 'pages')
          ]
        }
      ]
    }
  };
};
