const _ = require('lodash');

module.exports = function processPages(config) {
  return applyHooks(getFunctions('processPages'));

  function applyHooks(functions) {
    return (pages) => {
      if (!functions.length) {
        return pages;
      }

      // XXX: reduce instead
      let ret = [];

      functions.forEach((callback) => {
        ret = callback(pages);
      });

      return ret;
    };
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

    return functions;
  }
};
