'use strict';
var _ = require('lodash');
var markdown = require('commonmark');

var mdReader = new markdown.Parser();
var mdWriter = new markdown.HtmlRenderer();


exports.render = function(content) {
  if(_.isObject(content)) {
    content = content.__content;
  }

  if(content) {
    return mdWriter.render(mdReader.parse(content));
  }
};

exports.parse = function(content) {
  if(_.isObject(content)) {
    content = content.__content;
  }

  if(content) {
    return mdReader.parse(content);
  }
};

exports.getContentPreview = function(content) {
  var parsed = getLiteral(mdReader.parse(content));

  if(parsed.length > 100) {
    return parsed.substr(0, 100) + '…';
  }

  return parsed;
};

function getLiteral(part) {
  if(part._literal) {
    return part._literal;
  }

  if(part._firstChild) {
    return getLiteral(part._firstChild);
  }

  return '';
}
