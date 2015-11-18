'use strict';
var _ = require('lodash');

var config = require('config');

module.exports = {
  headContent: function (options) {
    return applyHooks(options, getFunctions('headContent'));
  }
};

var applyHooks = function (options, functionArray) {
  return functionArray.map(function(cb) {
    return cb(options);
  });
};

var getFunctions = function (hookName) {
  var functions = [];

  if (config.plugins) {
    _.each(config.plugins, function (plugin) {
      if(plugin[hookName]) {
        functions.push(plugin[hookName]);
      }
    });
  }
  if (config.functions && config.functions[hookName]) {
    functions.push(config.functions[hookName]);
  }

  return functions;
};
