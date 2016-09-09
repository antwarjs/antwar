/* eslint-disable no-console */
const _ = require('lodash');
const config = require('config');

module.exports = {
  preProcessPages: process.bind(null, 'preProcess'),
  postProcessPages: process.bind(null, 'postProcess')
};

// XXX: drop deprecated bit in the future
function process(prefix, pages) {
  const oldFn = prefix + 'Items';
  const newFn = prefix + 'Pages';
  let itemFunctions = getFunctions(oldFn);

  if (itemFunctions.length) {
    console.warn(oldFn + ' has been deprecated, use ' + newFn + ' instead');
  } else {
    itemFunctions = getFunctions(newFn);
  }

  return applyHooks(pages, itemFunctions);
}

function applyHooks(items, functionArray) {
  let ret = [];

  functionArray.forEach(function (callback) {
    ret = callback(ret);
  });

  return ret;
}

function getFunctions(hookName) {
  const functions = [];

  if (config.plugins) {
    _.each(config.plugins, function (plugin) {
      if (plugin[hookName]) {
        functions.push(plugin[hookName]);
      }
    });
  }
  if (config.functions && config.functions[hookName]) {
    functions.push(config.functions[hookName]);
  }

  return functions;
}
