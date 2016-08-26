'use strict';
var _ = require('lodash');

var config = require('config');

module.exports = {
  preProcessPages: process.bind(null, 'preProcess'),
  postProcessPages: process.bind(null, 'postProcess')
};

// XXX: drop deprecated bit in the future
function process(prefix, pages) {
  var oldFn = prefix + 'Items';
  var newFn = prefix + 'Pages';
  var itemFunctions = getFunctions(oldFn);

  if(itemFunctions.length) {
    console.warn(oldFn + ' has been deprecated, use ' + newFn + ' instead');
  }
  else {
    itemFunctions = getFunctions(newFn);
  }

  return applyHooks(pages, itemFunctions);
}

function applyHooks(items, functionArray) {
  functionArray.forEach(function(callback){
    items = callback(items);
  });

  return items;
}

function getFunctions(hookName) {
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
}
