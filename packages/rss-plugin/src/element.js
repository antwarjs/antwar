'use strict';
var _url = require('url');
var _ = require('lodash');
var moment = require('moment');
var absolutify = require('absolutify')
var urljoin = require('url-join');

exports.feed = function (children) {
  return e('feed', {xmlns: 'http://www.w3.org/2005/Atom'}, children);
}

exports.title = function (title) {
  return e('title', {}, escapeHTML(title));
}

exports.link = function (target, rel) {
  target = target || '';
  rel = rel || '';

  return e('link', {href: target, rel: rel}, '');
}

exports.updated = function (date) {
  return e('updated', {}, date);
}

exports.id = function (value) {
  return e('id', {}, value);
}

exports.author = function (author) {
  return e('author', {}, [
    e('name', {}, author ? escapeHTML(author.name || author) : ''),
    e('email', {}, author ? author.email || '' : ''),
  ]);
}

exports.entries = function (baseUrl, sections, pages) {
  return _.map(pages, function(page, name) {
    if(!_.includes(sections, page.section) || !page.title) {
      return;
    }

    return e('entry', {}, [
      e('title', {}, escapeHTML(page.title)),
      e(
        'id',
        {},
        'a' +  _.camelCase(_.escape(_.deburr(page.title))).toLowerCase() +
        moment(page.date, 'YYYY-MM-DD').format().toLowerCase()
      ),
      e('link', {href: _url.resolve(baseUrl, name)}, ''),
        e('updated', {}, moment(page.date, 'YYYY-MM-DD').format()),
        e('content', {type: 'html'}, escapeHTML(resolveUrls(baseUrl, page.section, page.content))),
        ]);
  }).filter(_.identity).join('');
}

function e(name, attributes, content) {
  var attrStr = _.map(attributes, function(val, key) {
    return key + '=' + '"' + val + '"';
  });

  attrStr = attrStr.length ? ' ' + attrStr.join(' ') : '';

  if(_.isArray(content)) {
    content = content.join('');
  }

  return '<' + name + attrStr + '>' + content + '</' + name + '>';
};

function resolveUrls (baseUrl, section, content) {
  return absolutify(content, function (url, attrName) {
    if (!url.indexOf('./')) {
      return urljoin(baseUrl, section, _.trimStart(url, './'));
    }

    if (attrName === 'href') {
      return _.trimEnd(_url.resolve(baseUrl, url), '/');
    }

    return url;
  });
}

function escapeHTML (input) {
  return input.replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&apos;');
}
