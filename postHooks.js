'use strict';
var _ = require('lodash');

var themeFunctions = require('theme').functions || {};
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
  preProcessPosts: function (posts) {
    return applyHooks(posts, getFunctions('preProcessPosts'));
  },
  postProcessPosts: function (posts) {
    return applyHooks(posts, getFunctions('postProcessPosts'));
  },
  postProcessPages: function (pages) {
    return applyHooks(pages, getFunctions('postProcessPages'));
  }
};
