'use strict';
var moment = require('moment');
var _ = require('lodash');

var config = require('../config');
var paths = require('../elements/PathsMixin');


module.exports = function() {
  return t('feed', {xmlns: 'http://www.w3.org/2005/Atom'}, [
    t('title', {}, config.title),
    t('link', {href: 'config.baseUrl' + 'atom.xml', rel: 'self'}, ' '),
    t('link', {href: config.baseUrl}, ' '),
    t('updated', {}, moment().format()),
    t('id', {}, config.baseUrl),
    t('author', {}, [
      t('name', {}, config.author.name),
      t('email', {}, config.author.email),
    ]),
    _.map(paths.getAllPosts(), function(post, name) {
      return t('entry', {}, [
        t('title', {}, post.title),
        t('link', {href: config.baseUrl + name}, ''),
        t('updated', {}, moment(post.date, 'YYYY-MM-DD').format()),
        t('content', {type: 'html'}, paths.getPostForPath(name)),
      ]);
    }).join('')
  ]);
};

function t(name, attributes, content) {
  var attrStr = _.map(attributes, function(val, key) {
    return key + '=' + '"' + val + '"';
  }).join(' ');

  if(_.isArray(content)) {
    content = content.join('');
  }

  return '<' + name + ' ' + attrStr + '>' + content + '>/' + name + '>';
}
