'use strict';
var _ = require('lodash');

var themeFunctions = require('theme').functions || {};
var config = require('config');

var applyHooks = function (items, functionArray) {
  functionArray.forEach(function(callback){
    items = callback(items);
  });

  return items;
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
  preProcessItems: function (items) {
    return applyHooks(items, getFunctions('preProcessItems'));
  },
  itemProcessItems: function (items) {
    return applyHooks(items, getFunctions('itemProcessItems'));
  },
  itemProcessPages: function (pages) {
    return applyHooks(pages, getFunctions('itemProcessPages'));
  }
};
