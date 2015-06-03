'use strict';
var marked = require('marked');
var removeMd = require('remove-markdown');

exports.render = function(content) {
  if(content) {
    return marked(content);
  }
};

exports.renderPreview = function(content, limit, endChar) {
  endChar = endChar || '';

  if(!content) {
    return;
  }

  var stripped = removeMd(content);

  if (stripped.length > limit) {
    return stripped.substr(0, limit) + endChar;
  }

  return stripped;
};
