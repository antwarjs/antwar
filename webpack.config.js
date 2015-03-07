'use strict';
var _ = require('lodash');


module.exports = function(hmrConfig, devConfig) {
  return _.merge({}, devConfig, hmrConfig, function(a, b) {
    return _.isArray(a) ? a.concat(b) : undefined;
  });
};
