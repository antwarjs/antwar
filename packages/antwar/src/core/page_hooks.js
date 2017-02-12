const _ = require('lodash');

module.exports = function (config) {
  return {
    preProcessPages: process('preProcess'),
    postProcessPages: process('postProcess')
  };

  function process(prefix) {
    return pages => applyHooks(pages, getFunctions(prefix + 'Pages'));
  }

  function applyHooks(pages, functionArray) {
    let ret = [];

    if (!functionArray.length) {
      return pages;
    }

    functionArray.forEach((callback) => {
      ret = callback(pages);
    });

    return ret;
  }

  function getFunctions(hookName) {
    const functions = [];

    if (config.plugins) {
      _.each(config.plugins, (plugin) => {
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
};
