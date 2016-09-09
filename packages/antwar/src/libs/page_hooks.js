/* eslint-disable no-console */
const _ = require('lodash');
const config = require('config');

module.exports = {
  preProcessPages: process.bind(null, 'preProcess'),
  postProcessPages: process.bind(null, 'postProcess')
};

function process(prefix, pages) {
  return applyHooks(pages, getFunctions(prefix + 'Pages'));
}

function applyHooks(pages, functionArray) {
  let ret = [];

  if (!functionArray.length) {
    return pages;
  }

  functionArray.forEach(function (callback) {
    ret = callback(pages);
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
