'use strict';
var _ = require('lodash');

var themeFunctions = require('theme/functions') || {};
var config = require('config');

var applyHooks = function (options,functionArray) {
  var retVal = [];
  functionArray.forEach(function(callback){
    retVal.push(callback(options));
  });

  return retVal;
};

var getFunctions = function (hookName) {
  var functions = [];

  if (themeFunctions[hookName]) {
    functions.push(themeFunctions[hookName]);
  }
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

module.exports = {
  headContent: function (options) {
    return applyHooks(options, getFunctions('headContent'));
  }
};
