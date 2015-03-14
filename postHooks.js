'use strict';
var _ = require('lodash');

var themeFunctions = require('theme/functions') || {};
var config = require('config');

var applyHooks = function (posts, functionArray) {
  functionArray.forEach(function(callback){
    posts = callback(posts);
  });

  return posts;
};

var getFunctions = function (hookName) {
  var functions = [];

  if (themeFunctions[hookName]) {
    functions.push(themeFunctions[hookName]);
  }
  if (config.site.plugins) {
    _.each(config.site.plugins, function (plugin) {
      if(plugin.functions && plugin.functions[hookName]) {
        functions.push(plugin.functions[hookName]);
      }
    });
  }
  if (config.site.functions && config.site.functions[hookName]) {
    functions.push(config.site.functions[hookName]);
  }

  return functions;
};

module.exports = {
  preProcessPosts: function (posts) {
    return applyHooks(posts, getFunctions('preProcessPosts'));
  },
  postProcessPosts: function (posts) {
    return applyHooks(posts, getFunctions('postProcessPosts'));
  }
};
