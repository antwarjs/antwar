const webpack = require("webpack");
const webpackConfig = require("../config/dev_index");

module.exports = function(config) {
  config.buildDev = 1; // eslint-disable-line no-param-reassign

  return new Promise(function(resolve, reject) {
    webpackConfig(config)
      .then(function(c) {
        webpack(c, function(err, stats) {
          if (err) {
            return reject(err);
          }

          if (stats.hasErrors()) {
            return reject(stats.toString("errors-only"));
          }

          return resolve();
        });
      })
      .catch(function(err) {
        reject(err);
      });
  });
};
